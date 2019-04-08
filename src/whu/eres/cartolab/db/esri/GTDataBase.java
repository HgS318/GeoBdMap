package whu.eres.cartolab.db.esri;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.geotools.data.FeatureWriter;
import org.geotools.data.Transaction;
import org.geotools.data.postgis.PostgisNGDataStoreFactory;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.shapefile.files.ShpFiles;
import org.geotools.data.shapefile.shp.ShapefileReader;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

//import com.appleyk.pojo.Geometry;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.MultiPolygon;
import com.vividsolutions.jts.geom.Polygon;

public class GTDataBase {

    static Connection connection = null;
    static DataStore pgDatastore = null;
    @SuppressWarnings("rawtypes")
    static FeatureSource fSource = null;
    static Statement statement   = null ;
    static GeometryCreator gCreator = GeometryCreator.getInstance();

    /**
     * 1.连接postgrepsql数据库
     *
     * @param ip
     * @param port
     * @param user
     * @param password
     * @param database
     * @return
     * @throws Exception
     */
    private static boolean ConnDataBase(String ip, Integer port, String user, String password, String database)
            throws Exception {

        // "jdbc:postgresql://192.168.1.104:5432/test"
        // user=postgres
        // password=bluethink134

        // 拼接url
        String url = "jdbc:postgresql://" + ip + ":" + port + "/" + database;
        Class.forName("org.postgresql.Driver"); // 一定要注意和上面的MySQL语法不同
        connection = DriverManager.getConnection(url, user, password);
        if (connection != null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 2.连接数据库 使用的postgis 链接代码如下：
     *
     * @param dbtype
     * @param host
     * @param port
     * @param database
     * @param userName
     * @param password
     */
    private static void ConnPostGis(String dbtype, String host, int port, String database, String userName,
                                    String password) {

        Map<String, Object> params = new HashMap<String, Object>();

        params.put(PostgisNGDataStoreFactory.DBTYPE.key, dbtype);
        params.put(PostgisNGDataStoreFactory.HOST.key, host);
        params.put(PostgisNGDataStoreFactory.PORT.key, new Integer(port));
        params.put(PostgisNGDataStoreFactory.DATABASE.key, database);
        params.put(PostgisNGDataStoreFactory.SCHEMA.key, "public");
        params.put(PostgisNGDataStoreFactory.USER.key, userName);
        params.put(PostgisNGDataStoreFactory.PASSWD.key, password);
        try {
            pgDatastore = DataStoreFinder.getDataStore(params);
            if (pgDatastore != null) {
                System.out.println("系统连接到位于：" + host + "的空间数据库" + database + "成功！");
            } else {
                System.out.println("系统连接到位于：" + host + "的空间数据库" + database + "失败！请检查相关参数");
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("系统连接到位于：" + host + "的空间数据库" + database + "失败！请检查相关参数");
        }

    }

    // 3.针对某个地理图层，进行地理信息的读取
    @SuppressWarnings("unchecked")
    public static void PostGisReading(String Schema) throws Exception {

        fSource = pgDatastore.getFeatureSource(Schema);
        // 一个用于处理FeatureCollection的实用工具类。提供一个获取FeatureCollection实例的机制
        FeatureCollection<SimpleFeatureType, SimpleFeature> result = fSource.getFeatures();

        // 计算本图层中所有特征的数量
        //System.out.println(result.size());

        //1.迭代特征
        FeatureIterator<SimpleFeature> iterator = result.features();

        //迭代 特征  只迭代30个 太大了，一下子迭代完，非常耗时
        int stop = 0;
        while(iterator.hasNext()){

            if(stop >30){
                break;
            }

            SimpleFeature feature = iterator.next();
            Collection<Property> p = feature.getProperties();
            Iterator<Property> it  = p.iterator();

            //2.特征里面的属性再迭代,属性里面有字段
            System.out.println("================================");
            while(it.hasNext()){

                Property pro = it.next();
                System.out.println(pro.getName()+"\t = "+pro.getValue());



            }//end 里层while

            stop++;
        }//end 最外层 while

        iterator.close();

    }

    // 4.取得POSTGIS中所有的地理图层
    public static void getAllLayers() throws Exception {

        String[] typeName = pgDatastore.getTypeNames();
        for (int i = 0; i < typeName.length; i++) {
            System.out.println((i + 1) + ":" + typeName[i]);
        }

    }



    /**
     * 将几何对象信息写入一个shapfile文件
     * @throws Exception
     */
    public static void WriteSHP(String path) throws Exception{

        //String path="C:\\my.shp";
        //1.创建shape文件对象
        File file =new File(path);
        Map<String, Serializable> params = new HashMap<>();
        //用于捕获参数需求的数据类
        //URLP:url to the .shp file.
        params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
        //2.创建一个新的数据存储——对于一个还不存在的文件。
        ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
        //3.定义图形信息和属性信息
        //SimpleFeatureTypeBuilder 构造简单特性类型的构造器
        SimpleFeatureTypeBuilder tBuilder = new SimpleFeatureTypeBuilder();
        //设置
        //WGS84:一个二维地理坐标参考系统，使用WGS84数据
        tBuilder.setCRS(DefaultGeographicCRS.WGS84);
        tBuilder.setName("shapefile");
        //添加 一个几何对象：特殊的多边形：圆
        tBuilder.add("the_geom", Polygon.class);
        //添加一个id
        tBuilder.add("osm_id", Long.class);
        //添加名称
        tBuilder.add("name", String.class);
        //添加描述
        tBuilder.add("des", String.class);
        //设置此数据存储的特征类型
        ds.createSchema(tBuilder.buildFeatureType());
        //设置编码
        ds.setCharset(Charset.forName("UTF-8"));
        //设置writer
        //为给定的类型名称创建一个特性写入器

        //1.typeName：特征类型
        //2.transaction :事物,写入失败，回滚
        //3.ShapefileDataStore::getTypeNames:
		/*public String[] getTypeNames()
		 获取这个数据存储保存的类型名称数组。
		ShapefileDataStore总是返回一个名称
		*/
        FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(
                ds.getTypeNames()[0], Transaction.AUTO_COMMIT);

        //Interface SimpleFeature：一个由固定列表值以已知顺序组成的SimpleFeatureType实例。
        //写一个点
        SimpleFeature feature = writer.next();
        //SimpleFeature ::setAttribute(String attrName, Object val)
        //给指定的属性名称添加一个对象 POINT
        double x = 116.123; //X轴坐标
        double y = 39.345 ; //Y轴坐标
		/*
		 * Coordinate : GeoAPI几何接口的实现
		 一个轻量级的类，用于存储二维笛卡尔平面上的坐标。
		 它不同于点，它是几何的一个子类。
		 不同于类型点的对象(包含额外的信息，如信封、精确模型和空间引用系统信息)，
		 坐标只包含有序值和访问方法。
		 */
        //Coordinate coordinate = new Coordinate(x, y);

        //GeometryFactory:提供一套实用的方法，用于从坐标列表中构建几何对象。

        //构造一个几何图形工厂，生成具有浮动精度模型的几何图形和一个0的空间引用ID。
        //Point point = new GeometryFactory().createPoint(coordinate);
//		feature.setAttribute("the_geom",polygon);
//		feature.setAttribute("osm_id", 1234567890l);
//		feature.setAttribute("name", "帅鱼");
//		feature.setAttribute("des", "爱宝宝");

        //利用几何对象构造器创建一个圆
        Polygon polygon = gCreator.createCircle(x, y, 20);

        feature.setAttribute("the_geom",polygon);
        feature.setAttribute("osm_id", 1234567890l);
        feature.setAttribute("name", "太阳");
        feature.setAttribute("des", "一个半径等于20的圆");

        //再来一个点
//
//		feature = writer.next();
//
//		x = 116.456;
//		y = 39.678 ;
//	    coordinate = new Coordinate(x, y);
//		point = new GeometryFactory().createPoint(coordinate);
//
//		feature.setAttribute("the_geom",point);
//		feature.setAttribute("osm_id", 1234567891l);
//		feature.setAttribute("name", "宝宝");
//		feature.setAttribute("des", "爱帅鱼");

        //写入
        writer.write();
        //关闭
        writer.close();
        //释放资源
        ds.dispose();


        //读取shapefile文件的图形信息
        ShpFiles shpFiles = new ShpFiles(path);
		/*ShapefileReader(
		 ShpFiles shapefileFiles,
		 boolean strict, --是否是严格的、精确的
		 boolean useMemoryMapped,--是否使用内存映射
		 GeometryFactory gf,     --几何图形工厂
		 boolean onlyRandomAccess--是否只随机存取
		 )
		*/
        ShapefileReader reader = new ShapefileReader(shpFiles,
                false, true, new GeometryFactory(), false);
        while(reader.hasNext()){
            System.out.println(reader.nextRecord().shape());
        }

        reader.close();

    }


    /**
     * 3.根据几何对象名称 查询几何对象信息 [Query]
     * @param name
     * @throws Exception
     */
    public static void Query(String name) throws Exception{

        //String sql = "select st_astext(geom) from geotable where name ='"+name+"'";
        String sql = "select  st_geometrytype(geom) as type,st_astext(geom) as geom from geotable where name ='"+name+"'";
        statement = connection.createStatement();
        ResultSet result = statement.executeQuery(sql);
        if(result!=null){
            while(result.next()){
                Object val = result.getString(1);
                if(val.equals("ST_MultiPolygon")){
                    System.out.println("几何对象类型：多多边形");
                    MultiPolygon mPolygon = gCreator.createMulPolygonByWKT(result.getString(2));
                    System.out.println(mPolygon instanceof MultiPolygon);
                    System.out.println("获取几何对象中的点个数："+mPolygon.getNumPoints());
                }

            }
        }



    }

    /**
     * 将几何对象信息写入一个shapefile文件并读取 == 可叠加写入 == MultiPolygon类型
     * 目前shape文件被局限于只能包含同种shape类型，比如Point集合的shape文件中不能掺杂其他类型
     * 但在将来shape文件可能会允许包含多种shape类型 == 混合shape？
     * @throws Exception
     */
    public static void appendSHP(String path, Geometry geometry,String desc) throws Exception {

        // 1.创建shape文件对象
        File file = new File(path);
        ShapefileDataStore ds = new ShapefileDataStore(file.toURI().toURL());

        if (!file.exists()) {
            //如果文件不存在，创建schema，存在的话，就不创建了，防止覆盖
            SimpleFeatureTypeBuilder tBuilder = new SimpleFeatureTypeBuilder();
            // 5.设置
            // WGS84:一个二维地理坐标参考系统，使用WGS84数据
            tBuilder.setCRS(DefaultGeographicCRS.WGS84);
            tBuilder.setName("shapefile");
            // 6.置该shape文件几何类型
            tBuilder.add( "the_geom", MultiPolygon.class );
            // 7.添加一个id
            tBuilder.add("osm_id", Long.class);
            // 8.添加名称
            tBuilder.add("name", String.class);
            // 9.添加描述
            tBuilder.add("des", String.class);
            SimpleFeatureType buildFeatureType = tBuilder.buildFeatureType();
            // 10.设置此数据存储的特征类型
            ds.createSchema(buildFeatureType);
        }

        // 11.设置编码
        ds.setCharset(Charset.forName("UTF-8"));

        // 12.设置writer
        // 为给定的类型名称创建一个特性写入器
        String typeName = ds.getTypeNames()[0];
        FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriterAppend(typeName,
                Transaction.AUTO_COMMIT);

        // Interface SimpleFeature：一个由固定列表值以已知顺序组成的SimpleFeatureType实例。
        // 13.写一个特征
        SimpleFeature feature = writer.next();

        feature.setAttribute("the_geom", geometry);
        /**
         * 下面的属性值，外面可以当做一个实体对象传进来，不写死！
         */
        feature.setAttribute("osm_id", 1234567890l);
        feature.setAttribute("name", "建筑物");
        feature.setAttribute("des", desc);

        // 14.写入
        writer.write();

        // 15.关闭
        writer.close();

        // 16.释放资源
        ds.dispose();

        // 17.读取shapefile文件的图形信息
        ShpFiles shpFiles = new ShpFiles(path);
		/*
		 * ShapefileReader( ShpFiles shapefileFiles, boolean strict,
		 * --是否是严格的、精确的 boolean useMemoryMapped,--是否使用内存映射 GeometryFactory gf,
		 * --几何图形工厂 boolean onlyRandomAccess--是否只随机存取 )
		 */
        ShapefileReader reader = new ShapefileReader(shpFiles, false, true, new GeometryFactory(), false);
        while (reader.hasNext()) {
            System.err.println(reader.nextRecord().shape());
        }
        reader.close();
    }

//    public static void main2(String[] args) throws Exception {
//        System.out.println("===============创建自己的shp文件==============");
//        String MPolygonWKT1 = "MULTIPOLYGON(((121.5837313 31.2435225,121.5852142 31.2444795,121.5860999 31.2434539,121.586133 31.2433016,121.5856866 31.243208,121.5846169 31.2425171,121.5837313 31.2435225)))";
//        MultiPolygon multiPolygon1 = gCreator.createMulPolygonByWKT(MPolygonWKT1);
//        //写入一个多多边形 【建筑物】== 信合花园
//        writeSHP("C:/my/multipol.shp", multiPolygon1,"信合花园");
//
//        String MPolygonWKT2 = "MULTIPOLYGON(((121.5869337 31.2479069,121.5874496 31.248256,121.5877683 31.247914,121.5872516 31.2475652,121.5869337 31.2479069)))";
//        MultiPolygon multiPolygon2 = gCreator.createMulPolygonByWKT(MPolygonWKT2);
//        //再追加写入一个多多边形 【建筑物】== 信合花园
//        writeSHP("C:/my/multipol.shp", multiPolygon2,"新金桥大厦");
//        System.out.println("===============打开shp文件==============");
//        openShpFile();
//    }
    // Main 方法测试
    public static void main(String[] args) throws Exception {


        //1.利用Provider连接 空间数据库
//        if (!ConnDataBase("192.168.1.104", 5432, "postgres", "123456", "test")) {
//            System.out.println("连接postgresql数据库失败，请检查参数！");
//        }
//        ConnPostGis("postgis", "192.168.1.104", 5432, "test", "postgres", "123456");
//
//
//
//        String path = "E:\\china-latest-free\\gis.osm_buildings_a_free_1.shp";
//
//        //2.读shapfile文件，并将内容写入空间数据库
//        //ReadSHP(path);
//
//        //3.获得空间数据库中所有的  地理图层
//        getAllLayers();
//
//        //4.根据空间几何对象的名称 查询几何对象信息
//        Query("国家大剧院");

        //5.创建一个圆【多边形】，并写入shapfile文件
        WriteSHP("D:\\try\\temp\\track\\sun.shp");

    }
}
