package whu.eres.cartolab.db.esri;

import com.vividsolutions.jts.geom.*;
import org.geotools.data.FeatureWriter;
import org.geotools.data.Transaction;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;

import java.io.*;
import java.nio.charset.Charset;
import java.util.*;
import java.sql.*;


//import org.geotools.data.oracle.sdo.AttributeList;
//import org.geotools.geometry.iso.io.wkt.Coordinate;
//import com.vividsolutions.jts.geom.GeometryFactory;

//import org.opengis.geometry.primitive.Point;


public class ShapeFile {

    public static void main(String[] args) throws Exception{
//        ShapeFile.readShp("D:\\try\\World\\china\\chinaWGS84\\A_��������");
//        WriteSHP("D:\\try\\temp\\track\\osm_ways_sim.shp");
//        System.out.println(getCityShapeByName("�Ϻ���"));
        System.out.println(getShapeByFid("data/geo/chinaWGS84/L_�ؽ���", 1));
        System.out.println(getShapeByFid("data/geo/chinaWGS84/L_�ؽ���", 50));
//        ShapeUtils.readGisObject("D:\\try\\World\\china\\chinaWGS84\\L_ʡ����");
    }


    public static void readShp(String shapeFileName) {
        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
        try {
            String shpName = shapeFileName;
            if (!shapeFileName.endsWith(".shp") && !shapeFileName.endsWith(".SHP")) {
                shpName = shapeFileName + ".shp";
            }
            ShapefileDataStore sds = (ShapefileDataStore) dataStoreFactory.createDataStore(
                    new File(shpName).toURI().toURL());
            sds.setCharset(Charset.forName("GBK"));
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureIterator itertor = featureSource.getFeatures().features();

            while (itertor.hasNext()) {
                SimpleFeature feature = itertor.next();
                Object obj = feature.getDefaultGeometry();
                SimpleFeatureType type = feature.getType();
//                Point point = (Point)feature.getDefaultGeometry();
//                Geometry geo = (Geometry)feature.getDefaultGeometry();
//                double[] xy = new double[]{point.getCoordinate().x, point.getCoordinate().y};
//                System.out.println(xy[0] + ", " + xy[1]);

                Iterator<Property> it = feature.getProperties().iterator();
                while (it.hasNext()) {
                    Property pro = it.next();
                    Object val = pro.getValue();
                    if (val instanceof Point) {
                        Point point = (Point) val;
                        System.out.println("PointX = " + point.getX() + ", PointY = " + point.getY());
                    } else if (pro.getValue() instanceof MultiLineString) {
                        MultiLineString line = (MultiLineString) val;
                        Coordinate[] coords = line.getCoordinates();
                        for (Coordinate coord : coords) {
                            System.out.print("(" + coord.x + ", " + coord.y + "); ");
                        }
                        System.out.println();
                    } else if (pro.getValue() instanceof MultiPolygon) {
                        MultiPolygon polygon = (MultiPolygon) val;
                        Coordinate[] coords = polygon.getCoordinates();
                        for (Coordinate coord : coords) {
                            System.out.print("(" + coord.x + ", " + coord.y + "); ");
                        }
                        System.out.println();
                    } else {
                        System.out.println(val);
                    }
                }
            }
            itertor.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static long getInfoAmountByFid(String path, int fid) {
        long length = 0L;
        MysqlLocalConnection.getInstance();
        String shapeFileName = MysqlLocalConnection.websitePath +  path;
        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
        try {
            String shpName = shapeFileName;
            if (!shapeFileName.endsWith(".shp") && !shapeFileName.endsWith(".SHP")) {
                shpName = shapeFileName + ".shp";
            }
            ShapefileDataStore sds = (ShapefileDataStore) dataStoreFactory.createDataStore(
                    new File(shpName).toURI().toURL());
            sds.setCharset(Charset.forName("GBK"));
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureIterator itertor = featureSource.getFeatures().features();
            Object outObj = null;
            int i = 0;
            while (itertor.hasNext()) {
                SimpleFeature feature = itertor.next();
                if(i == fid) {
                    Iterator<Property> it = feature.getProperties().iterator();
                    while (it.hasNext()) {
                        Property pro = it.next();
                        Object val = pro.getValue();
                        if(val instanceof Point || val instanceof MultiLineString || val instanceof MultiPolygon) {
                            outObj = val;
                            break;
                        }
                    }
                    break;
                }
                i++;
            }
            itertor.close();
            if(outObj == null) {
                length = 0L;
            }
            else if (outObj instanceof Point) {
                Point point = (Point) outObj;
                length = 16L + 200;
            } else if (outObj instanceof MultiLineString) {
                MultiLineString line = (MultiLineString) outObj;
                Coordinate[] coords = line.getCoordinates();
                length = coords.length * 8 + 200;
            } else if (outObj instanceof MultiPolygon) {
                MultiPolygon polygon = (MultiPolygon) outObj;
                Coordinate[] coords = polygon.getCoordinates();
                length = coords.length * 8 + 200;
            }
            return length;
        } catch (Exception e) {
            e.printStackTrace();
            return length;
        }
    }

    public static String getReturnStr(Object figureObj) {
        String jsonStr;
        if(figureObj == null) {
            jsonStr = null;
        } else if (figureObj instanceof Point) {
            Point point = (Point) figureObj;
            jsonStr = "{\"spaType\": 1, \"shape\": \"[" + point.getX() + ", " + point.getY() + "]}";
        } else if (figureObj instanceof MultiLineString) {
            MultiLineString line = (MultiLineString) figureObj;
            Coordinate[] coords = line.getCoordinates();
            StringBuffer buf = new StringBuffer();
            buf.append("{\"spaType\": 3, \"shape\": \"[");
            for (Coordinate coord : coords) {
                buf.append(" [ ").append(coord.x).append(", ").append(coord.y).append(" ],");
            }
            buf.deleteCharAt(buf.length() - 1);
            buf.append(" ]\" }");
            jsonStr = buf.toString();
        } else if (figureObj instanceof MultiPolygon) {
            MultiPolygon polygon = (MultiPolygon) figureObj;
            Coordinate[] coords = polygon.getCoordinates();
            StringBuffer buf = new StringBuffer();
            buf.append("{\"spaType\": 5, \"shape\": \"[");
            for (Coordinate coord : coords) {
                buf.append(" [ ").append(coord.x).append(", ").append(coord.y).append(" ],");
            }
            buf.deleteCharAt(buf.length() - 1);
            buf.append(" ]\" }");
            jsonStr = buf.toString();
        } else {
            jsonStr = null;
        }
        return jsonStr;
    }

    public static String getShapeByFid(String path, int fid) {
        MysqlLocalConnection.getInstance();
        String shapeFileName = MysqlLocalConnection.websitePath +  path;
        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
        try {
            String shpName = shapeFileName;
            if (!shapeFileName.endsWith(".shp") && !shapeFileName.endsWith(".SHP")) {
                shpName = shapeFileName + ".shp";
            }
            ShapefileDataStore sds = (ShapefileDataStore) dataStoreFactory.createDataStore(
                    new File(shpName).toURI().toURL());
            sds.setCharset(Charset.forName("GBK"));
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureIterator itertor = featureSource.getFeatures().features();
            Object outObj = null;
            String outJson = null;
            int i = 0;
            while (itertor.hasNext()) {
                SimpleFeature feature = itertor.next();
                if(i == fid) {
                    Iterator<Property> it = feature.getProperties().iterator();
                    while (it.hasNext()) {
                        Property pro = it.next();
                        Object val = pro.getValue();
                        if(val instanceof Point || val instanceof MultiLineString || val instanceof MultiPolygon) {
                            outObj = val;
                            break;
                        }
                    }
                    break;
                }
                i++;
            }
            itertor.close();
            if(outObj == null) {
                return null;
            }
            outJson = getReturnStr(outObj);
            return outJson;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getShapeByName(String path, String name) {
        MysqlLocalConnection.getInstance();
        String shapeFileName = MysqlLocalConnection.websitePath +  path;
        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
        try {
            String shpName = shapeFileName;
            if (!shapeFileName.endsWith(".shp") && !shapeFileName.endsWith(".SHP")) {
                shpName = shapeFileName + ".shp";
            }
            ShapefileDataStore sds = (ShapefileDataStore) dataStoreFactory.createDataStore(
                    new File(shpName).toURI().toURL());
            sds.setCharset(Charset.forName("GBK"));
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureIterator itertor = featureSource.getFeatures().features();
            Object thisObj = null, outObj = null;
            String outJson = null;
            while (itertor.hasNext()) {
                SimpleFeature feature = itertor.next();
//                Object obj = feature.getDefaultGeometry();
                SimpleFeatureType type = feature.getType();
                Iterator<Property> it = feature.getProperties().iterator();
                while (it.hasNext()) {
                    Property pro = it.next();
                    Object val = pro.getValue();
                    if(val instanceof Point || val instanceof MultiLineString || val instanceof MultiPolygon) {
                        thisObj = val;
                    }
                    if (val instanceof String) {
                        if (name.equals(((String) val))) {
                            outObj = thisObj;
                            break;
                        }
                    }
                }
            }
            itertor.close();
            outJson = getReturnStr(outObj);
            return outJson;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getAreaShapeByName(String name, String scale) {
        String fileName = "A_��������";
        if("��".equals(scale)) {
            fileName = "A_��������";
        } else if("��".equals(scale)) {
            fileName = "A_��������";
        }
        String shapeFileName = "data/geo/chinaWGS84/" + fileName;
        return getShapeByName(shapeFileName, name);
    }

    public static String getCityShapeByName(String name) {
        String shapeStr = getAreaShapeByName(name, "��");
        if(shapeStr == null || "".equals(shapeStr)) {
            shapeStr = getAreaShapeByName(name + "��", "��");
        }
        return shapeStr;
    }

    public static String getDistrictShapeByName(String name) {
        return getAreaShapeByName(name, "��");
    }


    /**
     * �����ζ�����Ϣд��һ��shapfile�ļ�
     *
     * @throws Exception
     */
    public static void WriteSHP(String path) throws Exception {

        //String path="C:\\my.shp";
        //1.����shape�ļ�����
        File file = new File(path);
        Map<String, Serializable> params = new HashMap<>();
        //���ڲ�����������������
        //URLP:url to the .shp file.
        params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
        //2.����һ���µ����ݴ洢��������һ���������ڵ��ļ���
        ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
        //3.����ͼ����Ϣ��������Ϣ
        //SimpleFeatureTypeBuilder ������������͵Ĺ�����
        SimpleFeatureTypeBuilder tBuilder = new SimpleFeatureTypeBuilder();
        //����
        //WGS84:һ����ά��������ο�ϵͳ��ʹ��WGS84����
        tBuilder.setCRS(DefaultGeographicCRS.WGS84);
        tBuilder.setName("shapefile");
        //��� һ�����ζ���
//        tBuilder.add("the_geom", Polygon.class);
        tBuilder.add("the_geom", LineString.class);
//        //���һ��id
//        tBuilder.add("osm_id", Long.class);
        //�������
        tBuilder.add("id", String.class);
//        tBuilder.add("tags", String.class);
//        tBuilder.add("latMin", Double.class);
//        tBuilder.add("latMax", Double.class);
//        tBuilder.add("lonMin", Double.class);
//        tBuilder.add("lonMax", Double.class);
//        //�������
//        tBuilder.add("des", String.class);
        //���ô����ݴ洢����������
        ds.createSchema(tBuilder.buildFeatureType());
        //���ñ���
        ds.setCharset(Charset.forName("GBK"));
        //����writer
        //Ϊ�������������ƴ���һ������д����

        //1.typeName����������
        //2.transaction :����,д��ʧ�ܣ��ع�
        //3.ShapefileDataStore::getTypeNames:
		/*public String[] getTypeNames()
		 ��ȡ������ݴ洢����������������顣
		ShapefileDataStore���Ƿ���һ������
		*/
        FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(
                ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
        GeometryCreator geometryCreator = GeometryCreator.getInstance();

        Connection c = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            c = DriverManager.getConnection("jdbc:sqlite:D:\\MyData\\Dbs\\sqlite\\osm_china_ex.sqlite");
            c.setAutoCommit(false);
            System.out.println("Opened database successfully");

            stmt = c.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, pts FROM way");
//            ResultSet rs = stmt.executeQuery("select id, tags, latMin, latMax, lonMin, lonMax, pts from way");
            int i = 0;
            while (rs.next()) {
                i++;
//                if (i > 100) {
//                    break;
//                }
                if (i % 1000 == 0) {
                    System.out.println(i);
                }
                try {
                    String wid = rs.getString("id");
                    String pts = rs.getString("pts").trim();
//                    String tags = rs.getString("tags").trim();
//                    if(tags.length() > 127) {
//                        tags = tags.substring(0, 127);
//                    }
//                    double latMin = rs.getDouble("latMin");
//                    double latMax = rs.getDouble("latMax");
//                    double lonMin = rs.getDouble("lonMin");
//                    double lonMax = rs.getDouble("lonMax");
                    String[] coords = pts.split(";");
                    List<Coordinate> mvs = new LinkedList<Coordinate>();
                    for (String coord : coords) {
                        if (coord.length() > 2) {
                            String[] xy = coord.split(",");
                            double x = Double.parseDouble(xy[0]);
                            double y = Double.parseDouble(xy[1]);
                            Coordinate mv = new Coordinate(x, y);
                            mvs.add(mv);
                        }
                    }
                    int cd_size = mvs.size();
                    Coordinate[] cds = new Coordinate[cd_size];
                    for (int j = 0; j < cd_size; j++) {
                        cds[j] = mvs.get(j);
                    }
//                    cds[cd_size] = cds[0];
//                Polygon polygon = geometryCreator.geometryFactory.createPolygon(cds);
                    LineString lineString = geometryCreator.geometryFactory.createLineString(cds);
                    SimpleFeature feature = writer.next();
                    feature.setAttribute("the_geom", lineString);
                    feature.setAttribute("id", wid);
//                    feature.setAttribute("tags", tags);
//                    feature.setAttribute("latMin", latMin);
//                    feature.setAttribute("latMax", latMax);
//                    feature.setAttribute("lonMin", lonMin);
//                    feature.setAttribute("lonMax", lonMax);
                } catch (Exception e1) {
                    System.err.println(e1.getClass().getName() + ": " + e1.getMessage());
                }
            }
            rs.close();
            stmt.close();
            c.close();
        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
//            System.exit(0);
        }
        //д��
        writer.write();
        //�ر�
        writer.close();
        //�ͷ���Դ
        ds.dispose();
        System.out.println("Operation done successfully");

//        //Interface SimpleFeature��һ���ɹ̶��б�ֵ����֪˳����ɵ�SimpleFeatureTypeʵ����
//        //дһ����
//        SimpleFeature feature = writer.next();
//        //SimpleFeature ::setAttribute(String attrName, Object val)
//        //��ָ���������������һ������ POINT
//		/*
//		 * Coordinate : GeoAPI���νӿڵ�ʵ��
//		 һ�����������࣬���ڴ洢��ά�ѿ���ƽ���ϵ����ꡣ
//		 ����ͬ�ڵ㣬���Ǽ��ε�һ�����ࡣ
//		 ��ͬ�����͵�Ķ���(�����������Ϣ�����ŷ⡢��ȷģ�ͺͿռ�����ϵͳ��Ϣ)��
//		 ����ֻ��������ֵ�ͷ��ʷ�����
//		 */
//        //Coordinate coordinate = new Coordinate(x, y);
//
//        //GeometryFactory:�ṩһ��ʵ�õķ��������ڴ������б��й������ζ���
//
//        //����һ������ͼ�ι��������ɾ��и�������ģ�͵ļ���ͼ�κ�һ��0�Ŀռ�����ID��
//        //Point point = new GeometryFactory().createPoint(coordinate);
////		feature.setAttribute("the_geom",polygon);
////		feature.setAttribute("osm_id", 1234567890l);
////		feature.setAttribute("name", "˧��");
////		feature.setAttribute("des", "������");
//
//        //���ü��ζ�����������һ��Բ
//        double x = 116.123; //X������
//        double y = 39.345 ; //Y������
//        Polygon polygon = gCreator.createCircle(x, y, 20);
//
//        feature.setAttribute("the_geom",polygon);
//        feature.setAttribute("osm_id", 1234567890l);
//        feature.setAttribute("name", "̫��");
//        feature.setAttribute("des", "һ���뾶����20��Բ");
//
//        //����һ����
////
////		feature = writer.next();
////
////		x = 116.456;
////		y = 39.678 ;
////	    coordinate = new Coordinate(x, y);
////		point = new GeometryFactory().createPoint(coordinate);
////
////		feature.setAttribute("the_geom",point);
////		feature.setAttribute("osm_id", 1234567891l);
////		feature.setAttribute("name", "����");
////		feature.setAttribute("des", "��˧��");
//
//        //д��
//        writer.write();
//        //�ر�
//        writer.close();
//        //�ͷ���Դ
//        ds.dispose();
//
//
//        //��ȡshapefile�ļ���ͼ����Ϣ
//        ShpFiles shpFiles = new ShpFiles(path);
//		/*ShapefileReader(
//		 ShpFiles shapefileFiles,
//		 boolean strict, --�Ƿ����ϸ�ġ���ȷ��
//		 boolean useMemoryMapped,--�Ƿ�ʹ���ڴ�ӳ��
//		 GeometryFactory gf,     --����ͼ�ι���
//		 boolean onlyRandomAccess--�Ƿ�ֻ�����ȡ
//		 )
//		*/
//        ShapefileReader reader = new ShapefileReader(shpFiles,
//                false, true, new GeometryFactory(), false);
//        while(reader.hasNext()){
//            System.out.println(reader.nextRecord().shape());
//        }
//
//        reader.close();

    }

//    public void transShape(String srcfilepath, String destfilepath) {
//        try {
//
//            ShapefileDataStore shapeDS = (ShapefileDataStore) new ShapefileDataStoreFactory().createDataStore(new File(srcfilepath).toURI().toURL());
//
//            Map<String, Serializable> params = new HashMap<String, Serializable>();
//            FileDataStoreFactorySpi factory = new ShapefileDataStoreFactory();
//            params.put(ShapefileDataStoreFactory.URLP.key, new File(destfilepath).toURI().toURL());
//            ShapefileDataStore ds = (ShapefileDataStore) factory.createNewDataStore(params);
//            ds.createSchema(SimpleFeatureTypeBuilder.retype(fs.getSchema(), DefaultGeographicCRS.WGS84));
//
//            FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
//
//            SimpleFeatureIterator it = fs.getFeatures().features();
//            try {
//                while (it.hasNext()) {
//                    SimpleFeature f = it.next();
//                    SimpleFeature fNew = writer.next();
//                    fNew.setAttributes(f.getAttributes());
//                    writer.write();
//                }
//            } finally {
//                it.close();
//            }
//            writer.close();
//            ds.dispose();
//            shapeDS.dispose();
//        } catch (Exception e) { e.printStackTrace();    }
//    }

}
