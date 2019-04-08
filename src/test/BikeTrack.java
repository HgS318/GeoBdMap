package test;

import org.jaitools.imageutils.iterator.AbstractSimpleIterator;

import com.vividsolutions.jts.geom.*;
import org.geotools.data.FeatureWriter;
import org.geotools.data.Transaction;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.shapefile.files.ShpFiles;
import org.geotools.data.shapefile.shp.ShapefileReader;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import whu.eres.cartolab.db.esri.GeometryCreator;

import java.io.*;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

public class BikeTrack {

    public Bike bike;
    public BikeOrder order;
    public List<BikeTrackPoint> points = new ArrayList<>();

    public BikeTrack(Bike bike, BikeOrder order) {
        this.bike = bike;
        this.order = order;
    }

    public void appendPoint(BikeTrackPoint point) {
        this.points.add(point);
    }


    public static void main(String[] args) {
//        pos_seq_by_bike();
//        order_seq();
//        createOrderTracks();
        createBikeTracks();
    }

    public static void createOrderTracks() {
        List<Bike> bikes = initBikes();
        List<BikeOrder> orders = initOrders(bikes);
        createTracks(bikes);
        ordersToShp(orders, "D:\\try\\temp\\track\\共享单车数据\\OrderTracks.shp");
    }

    public static void createBikeTracks() {
        List<Bike> bikes = initBikes();
        bikesToShp(bikes, "D:\\try\\temp\\track\\共享单车数据\\BikeTracks.shp");
    }

    public static List<Bike> initBikes() {
        String charset = "UTF-8";
        String path = "D:\\try\\temp\\track\\共享单车数据\\";
        File file = new File(path + "position_seq1.txt");
        List<BikeTrackPoint> points = new ArrayList<>();
        List<Bike> bikes = new ArrayList<>();
        if(file.isFile() && file.exists()) {
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, charset);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String text = "";
                int i = 0;
                while ((text = bufferedReader.readLine()) != null) {
                    i++;
                    if(i % 1000000 == 0) {
                        System.out.println("read bike track points: " + i);
                    }
                    try {
                        String[] props = text.split(",");
                        long sn = Long.parseLong(props[0]);
                        double lng = Double.parseDouble(props[1]);
                        double lat = Double.parseDouble(props[2]);
                        short status = Short.parseShort((props[3]));
                        long postionTime = Long.parseLong(props[4]);
                        BikeTrackPoint btp = new BikeTrackPoint(sn, lng, lat, status, postionTime);
                        points.add(btp);
                    } catch (Exception e1) {
                        System.err.println("read bike track points error...");
                    }
                }
                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
            } catch (Exception e) {

            }
            System.out.println("read bike track points ok");
            long lastSn = -1L;
            Bike lastBike = null;
            for(BikeTrackPoint point : points) {
                if(point.sn != lastSn) {
                    Bike bike = new Bike(point);
                    bikes.add(bike);
                    lastBike = bike;
                    lastSn = point.sn;
                } else {
                    lastBike.appendPoint(point);
                }
            }
        }
        return bikes;
    }

    public static List<BikeOrder> initOrders(List<Bike> bikes) {

        String charset = "UTF-8";
        String path = "D:\\try\\temp\\track\\共享单车数据\\";
        File file = new File(path + "order_seq1.txt");
        List<BikeOrder> orders = new ArrayList<>();
        int i = 0;
        if(file.isFile() && file.exists()) {
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, charset);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String text = "";
                while ((text = bufferedReader.readLine()) != null) {
                    i++;
                    if(i % 1000000 == 0) {
                        System.out.println("read orders: " + i);
                    }
                    try {
//                        text = bufferedReader.readLine();
                        String[] props = text.split(",");
                        long sn = Long.parseLong(props[0]);
                        long startTime = Long.parseLong(props[1]);
                        long endTime = Long.parseLong(props[2]);
                        if(endTime != 0L) {
                            BikeOrder btp = new BikeOrder(sn, startTime, endTime);
                            orders.add(btp);
                        }
                    } catch (Exception e1) {
                        System.err.println("read order error...");
                    }
                }
                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
            } catch (Exception e) {

            }
            System.out.println("read orders ok");
            int bikeNum = bikes.size();
            long[] bikeSns = new long[bikeNum];
            i = 0;
            for(Bike bike : bikes) {
                bikeSns[i] = bike.sn;
                i++;
            }
            i = 0;
            long lastSn = -1L;
            Bike lastBike = null;
            for(BikeOrder order : orders) {
                i++;
                if(i % 1000000 == 0) {
                    System.out.println("process orders into bike: " + i);
                }
                Bike bike;
                if(order.sn == lastSn) {
                    bike = lastBike;
                } else {
                    bike = Bike.findBikeBySn(order.sn, bikes, bikeSns);
                }
                if(bike != null) {
                    bike.appendOrder(order);
                    lastSn = bike.sn;
                } else {
                    lastSn = -1L;
                }
                lastBike = bike;
            }
        }
        return orders;
    }

    public static void createTracks(List<Bike> bikes) {
        int i = 0;
        for(Bike bike : bikes) {
            i++;
            if(i % 1000000 == 0 ) {
                System.out.println("mapped track points of " + i + " bikes into orders...");
            }
            bike.mappingPoints2Orders();
        }
    }

    public static void ordersToShp(List<BikeOrder> orders, String path) {

        File file = new File(path);
        Map<String, Serializable> params = new HashMap<>();
        try {
            params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
            ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
            SimpleFeatureTypeBuilder tBuilder = new SimpleFeatureTypeBuilder();
            tBuilder.setCRS(DefaultGeographicCRS.WGS84);
            tBuilder.setName("shapefile");
            tBuilder.add("the_geom", LineString.class);
            tBuilder.add("sn", Long.class);
            tBuilder.add("time", String.class);
            ds.createSchema(tBuilder.buildFeatureType());
            //设置编码
            ds.setCharset(Charset.forName("GBK"));
            FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(
                    ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
            GeometryCreator geometryCreator = GeometryCreator.getInstance();

            int i = 0;
            for (BikeOrder order : orders) {
                i++;
                if (i % 100000 == 0) {
                    System.out.println("created " + i + " map lines...");
                }
                Coordinate[] cds = order.getCoordinates();
                if(cds != null && cds.length > 1) {
                    LineString lineString = geometryCreator.geometryFactory.createLineString(cds);
                    SimpleFeature feature = writer.next();
                    feature.setAttribute("the_geom", lineString);
                    feature.setAttribute("sn", order.sn);
                    String orderTime = order.getTimeStr();
                    feature.setAttribute("time", orderTime);
                }
            }
            writer.write();
            writer.close();
            ds.dispose();
            System.out.println("Operation done successfully");
        } catch (Exception exp) {
            exp.printStackTrace();
        }

    }

    public static void bikesToShp(List<Bike> bikes, String path) {

        File file = new File(path);
        Map<String, Serializable> params = new HashMap<>();
        try {
            params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
            ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
            SimpleFeatureTypeBuilder tBuilder = new SimpleFeatureTypeBuilder();
            tBuilder.setCRS(DefaultGeographicCRS.WGS84);
            tBuilder.setName("shapefile");
            tBuilder.add("the_geom", LineString.class);
            tBuilder.add("sn", Long.class);
            tBuilder.add("time", String.class);
            ds.createSchema(tBuilder.buildFeatureType());
            //设置编码
            ds.setCharset(Charset.forName("GBK"));
            FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(
                    ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
            GeometryCreator geometryCreator = GeometryCreator.getInstance();

            int i = 0;
            for (Bike bike : bikes) {
                i++;
                if (i % 100000 == 0) {
                    System.out.println("created " + i + " map lines...");
                }
                Coordinate[] cds = bike.getCoordinates();
                if(cds != null && cds.length > 1) {
                    LineString lineString = geometryCreator.geometryFactory.createLineString(cds);
                    SimpleFeature feature = writer.next();
                    feature.setAttribute("the_geom", lineString);
                    feature.setAttribute("sn", bike.sn);
                    String orderTime = bike.getTimeStr();
                    feature.setAttribute("time", orderTime);
                }
            }
            writer.write();
            writer.close();
            ds.dispose();
            System.out.println("Operation done successfully");
        } catch (Exception exp) {
            exp.printStackTrace();
        }

    }

    public static void pos_seq_by_bike() {
        String charset = "UTF-8";
        String path = "D:\\try\\temp\\track\\共享单车数据\\";
        File file = new File(path + "position1.csv");
        List<BikeTrackPoint> points = new ArrayList<>();
        if(file.isFile() && file.exists()) {
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, charset);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String text = bufferedReader.readLine();
                while(text != null){
                    try {
                        text = bufferedReader.readLine();
                        String[] props = text.split(",");
                        long sn = Long.parseLong(props[2]);
                        double lng = Double.parseDouble(props[3]);
                        double lat = Double.parseDouble(props[4]);
                        short status = Short.parseShort((props[5]));
                        long postionTime = Long.parseLong(props[6]);
                        BikeTrackPoint btp = new BikeTrackPoint(sn, lng, lat, status, postionTime);
                        points.add(btp);
                    } catch (Exception e1) {
                        System.err.println("read line error...");
                    }
                }
                Collections.sort(points, new Comparator<BikeTrackPoint>() {
                    public int compare(BikeTrackPoint o1, BikeTrackPoint o2) {
                        long sn_diff =  o1.sn - o2.sn;
                        if(sn_diff < 0) {
                            return -1;
                        }
                        if(sn_diff > 0) {
                            return 1;
                        }
                        long time_diff = o1.postionTime - o2.postionTime;
                        if(time_diff < 0) {
                            return  -1;
                        }
                        if(time_diff > 0) {
                            return 1;
                        }
                        return 0;
                    }
                });
                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
            } catch (Exception e) {

            }
            try {
                File outFile = new File(path + "position_seq1.txt");
                if(!outFile.exists()){
                    outFile.createNewFile();
                }
                FileWriter fw = new FileWriter(outFile, false);
                BufferedWriter bw = new BufferedWriter(fw);
                for(BikeTrackPoint btp : points) {
                    bw.write(btp + "\n");
                }
                bw.close();
                fw.close();
                System.out.println("test1 done!");
            } catch (Exception e) {
                // TODO: handle exception
            }
        }
    }

    public static void order_seq() {
        String charset = "UTF-8";
        String path = "D:\\try\\temp\\track\\共享单车数据\\";
        File file = new File(path + "order.csv");
        List<BikeOrder> orders = new ArrayList<>();
        if(file.isFile() && file.exists()) {
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, charset);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String text = bufferedReader.readLine();
                while(text != null){
                    try {
                        text = bufferedReader.readLine();
                        String[] props = text.split(",");
                        long sn = Long.parseLong(props[2]);
                        long startTime = Long.parseLong(props[3]);
                        long endTime = Long.parseLong(props[4]);
                        BikeOrder btp = new BikeOrder(sn, startTime, endTime);
                        orders.add(btp);
                    } catch (Exception e1) {
                        System.err.println("read line error...");
                    }
                }
                Collections.sort(orders, new Comparator<BikeOrder>() {
                    public int compare(BikeOrder o1, BikeOrder o2) {
                        long sn_diff =  o1.sn - o2.sn;
                        if(sn_diff < 0) {
                            return -1;
                        }
                        if(sn_diff > 0) {
                            return 1;
                        }
                        long time_diff = o1.startTime - o2.startTime;
                        if(time_diff < 0) {
                            return  -1;
                        }
                        if(time_diff > 0) {
                            return 1;
                        }
                        return 0;
                    }
                });
                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
            } catch (Exception e) {

            }
            try {
                File outFile = new File(path + "order_seq1.txt");
                if(!outFile.exists()){
                    outFile.createNewFile();
                }
                FileWriter fw = new FileWriter(outFile, false);
                BufferedWriter bw = new BufferedWriter(fw);
                for(BikeOrder btp : orders) {
                    bw.write(btp + "\n");
                }
                bw.close();
                fw.close();
                System.out.println("test1 done!");
            } catch (Exception e) {
                // TODO: handle exception
            }
        }
    }

    public static String readFile(File file, String charset){
        //设置默认编码
        if(charset == null){
            charset = "UTF-8";
        }
        if(file.isFile() && file.exists()){
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, charset);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                StringBuffer sb = new StringBuffer();
                String text = null;
                while((text = bufferedReader.readLine()) != null){
                    sb.append(text);
                }
                return sb.toString();
            } catch (Exception e) {
                // TODO: handle exception
            }
        }
        return null;
    }


}

class Bike {
    public long sn;
    public List<BikeTrackPoint> points = new ArrayList<>();
    public List<BikeOrder> orders = new ArrayList<>();

    public Bike() {

    }

    public Bike(long id) {
        sn = id;
    }

    public Bike(BikeTrackPoint point) {
        sn = point.sn;
        points.add(point);
    }

    public void appendPoint(BikeTrackPoint point) {
        points.add(point);
    }

    public void appendOrder( BikeOrder order) {
        orders.add(order);
    }

    public void mappingPoints2Orders() {
        for(BikeOrder order : orders) {
            for(BikeTrackPoint point : points) {
                if(point.order == null) {
                    if(point.postionTime >= order.startTime && point.postionTime <= order.endTime) {
                        point.order = order;
                        order.appendPoint(point);
                    }
                }
            }
        }
    }

    public Coordinate[] getCoordinates() {
        int len = points.size(), i = 0;
        Coordinate[] coords = new Coordinate[len];
        for(BikeTrackPoint point : points) {
            Coordinate coord = new Coordinate(point.lng, point.lat);
            coords[i] = coord;
            i++;
        }
        return coords;
    }

    public String getTimeStr() {
        if(points.size() == 0) {
            return "";
        }
        if(points.size() == 1) {
            return new Long(points.get(0).postionTime).toString();
        }
        Long startTime = points.get(0).postionTime;
        Long endTime = points.get(points.size() - 1).postionTime;
        return startTime + "-" + endTime;
    }

    public static Bike findBikeBySn(long id, List<Bike> bikes) {
        for(Bike bike : bikes) {
            if(bike.sn == id) {
                return bike;
            }
        }
        return null;
    }

    public static Bike findBikeBySn(long sn, List<Bike> bikes, long[] snArr) {
        int idx = binarySearch(snArr, sn);
        if(idx == -1) {
            return null;
        }
        return bikes.get(idx);
    }

    public static int binarySearch(long[] arr,long num){
        int low = 0;
        int upper = arr.length - 1;
        while(low <= upper){
            int mid = (upper+low)/2;
            if(arr[mid]<num){
                low = mid + 1;
            }
            else if(arr[mid] > num){
                upper = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -1;
    }

}


class BikeTrackPoint {

    public long sn, postionTime;
    public double lng, lat;
    public short status;

    public BikeOrder order = null;

    public BikeTrackPoint() {

    }

    public BikeTrackPoint(long _sn, double _lng, double _lat,
                          short _status, long _time) {
        sn = _sn;
        lng = _lng;
        lat = _lat;
        status = _status;
        postionTime = _time;
    }

    public String toString() {
        return sn + "," + lng + "," + lat + "," + status + "," + postionTime;
    }

}


class BikeOrder {

    public long sn, startTime, endTime;
    List<BikeTrackPoint> points = new ArrayList<>();

    public BikeOrder() {

    }

    public BikeOrder(long _sn, long stime, long etime) {
        sn = _sn;
        startTime = stime;
        endTime = etime;
    }

    public String getTimeStr() {
        return startTime + "-" + endTime;
    }

    public Coordinate[] getCoordinates() {
        int len = points.size(), i = 0;
        Coordinate[] coords = new Coordinate[len];
        for(BikeTrackPoint point : points) {
            Coordinate coord = new Coordinate(point.lng, point.lat);
            coords[i] = coord;
            i++;
        }
        return coords;
    }

    public void appendPoint(BikeTrackPoint point) {
        this.points.add(point);
    }

    public String toString() {
        return sn + "," + startTime + "," + endTime;
    }

}
