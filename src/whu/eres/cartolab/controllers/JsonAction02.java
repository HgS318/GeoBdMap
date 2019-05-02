package whu.eres.cartolab.controllers;

import javax.servlet.http.*;
import java.io.*;
import java.net.*;
import java.util.*;
import java.text.SimpleDateFormat;
import net.sf.json.*;
import org.apache.struts2.ServletActionContext;

import whu.eres.cartolab.db.esri.ShapeFile;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;


public class JsonAction02 {

//    public static void main(String[] args){
//        sortTracks01();
//    }

    public String sortTracks01() {
        int len = 30000;
        int i = 0;
        MysqlLocalConnection.getInstance();
        String websitePath = MysqlLocalConnection.websitePath;
        String csvFile = websitePath + "download/mapv/examples/data/tracks/bj_A_B.csv";
        StringBuffer jsonStr = new StringBuffer();
        jsonStr.append("[");
        List<SimpleTrack> tracks = new ArrayList<>();
        try {

            BufferedReader br = new BufferedReader(new FileReader(csvFile));//构造一个BufferedReader类来读取文件

            String s = null;
            while ((s = br.readLine()) != null) {//使用readLine方法，一次读一行
                if (i > len) {
                    break;
                }
                i++;
                String[] infoStr = s.split(",");
                double x = Double.parseDouble(infoStr[1]);
                double y = Double.parseDouble(infoStr[2]);
                String ID = infoStr[4];
                String timestr = infoStr[5];
                Long time = Long.parseLong(timestr) * 1000;
                SimpleTrack track = new SimpleTrack(time, ID, x, y);
                tracks.add(track);
            }
                Collections.sort(tracks, new Comparator<SimpleTrack>() {
                    public int compare(SimpleTrack o1, SimpleTrack o2) {
                        long sn_diff = o1.time - o2.time;
                        if (sn_diff < 0) {
                            return -1;
                        }
                        if (sn_diff > 0) {
                            return 1;
                        }
                        return o1.userid.compareTo(o2.userid);
                    }
                });
        for(SimpleTrack track:tracks){
            double X=track.x;
            double Y=track.y;
            String id=track.userid;
//            int id = (int)(1+Math.random()*(10000) + 3);
            Long Time=track.time;
            Date d = new Date(Time);
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
            String Timestr=sdf.format(d);
            String infoJson = "{\"lng\": " + X + ", \"lat\": " + Y +", \"id\": " +"\""+ id+"\""+", \"time\": \"" + Timestr+"\"}," ;
            jsonStr.append(infoJson);
        }
        br.close();
        jsonStr.deleteCharAt(jsonStr.length() - 1);
        jsonStr.append("]");
//        System.out.println(jsonStr.toString());
            toBeJson(jsonStr.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String sortTracks02() {
        int len = 30000;
        int i = 0;
        MysqlLocalConnection.getInstance();
        String websitePath = MysqlLocalConnection.websitePath;
        String csvFile = websitePath + "download/mapv/examples/data/tracks/bj_B_C.csv";
        StringBuffer jsonStr = new StringBuffer();
        jsonStr.append("[");
        List<SimpleTrack> tracks = new ArrayList<>();
        try {

            BufferedReader br = new BufferedReader(new FileReader(csvFile));//构造一个BufferedReader类来读取文件

            String s = null;
            while ((s = br.readLine()) != null) {//使用readLine方法，一次读一行
                if (i > len) {
                    break;
                }
                i++;
                String[] infoStr = s.split(",");
                double x = Double.parseDouble(infoStr[1]);
                double y = Double.parseDouble(infoStr[2]);
                String ID = infoStr[4];
                String timestr = infoStr[5];
                Long time = Long.parseLong(timestr) * 1000;
                SimpleTrack track = new SimpleTrack(time, ID, x, y);
                tracks.add(track);
            }
            Collections.sort(tracks, new Comparator<SimpleTrack>() {
                public int compare(SimpleTrack o1, SimpleTrack o2) {
                    long sn_diff = o1.time - o2.time;
                    if (sn_diff < 0) {
                        return -1;
                    }
                    if (sn_diff > 0) {
                        return 1;
                    }
                    return o1.userid.compareTo(o2.userid);
                }
            });
            for(SimpleTrack track:tracks){
                double X=track.x;
                double Y=track.y;
                String id=track.userid;
//                int id = (int)(1+Math.random()*(10000) + 3);
                Long Time=track.time;
                Date d = new Date(Time);
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                String Timestr=sdf.format(d);
                String infoJson = "{\"lng\": " + X + ", \"lat\": " + Y +", \"id\": " +"\""+ id+"\""+", \"time\": \"" + Timestr+"\"}," ;
                jsonStr.append(infoJson);
            }
            br.close();
            jsonStr.deleteCharAt(jsonStr.length() - 1);
            jsonStr.append("]");
//        System.out.println(jsonStr.toString());
            toBeJson(jsonStr.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String sortTracks03() {
        int len = 30000;
        int i = 0;
        MysqlLocalConnection.getInstance();
        String websitePath = MysqlLocalConnection.websitePath;
        String csvFile = websitePath + "download/mapv/examples/data/tracks/bj_A_C.csv";
        StringBuffer jsonStr = new StringBuffer();
        jsonStr.append("[");
        List<SimpleTrack> tracks = new ArrayList<>();
        try {

            BufferedReader br = new BufferedReader(new FileReader(csvFile));//构造一个BufferedReader类来读取文件

            String s = null;
            while ((s = br.readLine()) != null) {//使用readLine方法，一次读一行
                if (i > len) {
                    break;
                }
                i++;
                String[] infoStr = s.split(",");
                double x = Double.parseDouble(infoStr[1]);
                double y = Double.parseDouble(infoStr[2]);
                String ID = infoStr[4];
                String timestr = infoStr[5];
                Long time = Long.parseLong(timestr) * 1000;
                SimpleTrack track = new SimpleTrack(time, ID, x, y);
                tracks.add(track);
            }
            Collections.sort(tracks, new Comparator<SimpleTrack>() {
                public int compare(SimpleTrack o1, SimpleTrack o2) {
                    long sn_diff = o1.time - o2.time;
                    if (sn_diff < 0) {
                        return -1;
                    }
                    if (sn_diff > 0) {
                        return 1;
                    }
                    return o1.userid.compareTo(o2.userid);
                }
            });
            for(SimpleTrack track:tracks){
                double X=track.x;
                double Y=track.y;
                String id=track.userid;
//                int id = (int)(1+Math.random()*(10000) + 3);
                Long Time=track.time;
                Date d = new Date(Time);
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                String Timestr=sdf.format(d);
                String infoJson = "{\"lng\": " + X + ", \"lat\": " + Y +", \"id\": " +"\""+ id+"\""+", \"time\": \"" + Timestr+"\"}," ;
                jsonStr.append(infoJson);
            }
            br.close();
            jsonStr.deleteCharAt(jsonStr.length() - 1);
            jsonStr.append("]");
//        System.out.println(jsonStr.toString());
            toBeJson(jsonStr.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String outputCoordsJson02() {
        int len = 30000;
        int i = 0;
        String csvFile ="E:/Data/222.csv";
        StringBuffer jsonStr = new StringBuffer();
        jsonStr.append("[");
        StringBuilder result = new StringBuilder();
        try{
            BufferedReader br = new BufferedReader(new FileReader(csvFile));//构造一个BufferedReader类来读取文件
            String s = null;
            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
                if (i > len) {
                    break;
                }
                i++;
                String[] infoStr = s.split(",");
                try {
                    double x = Double.parseDouble(infoStr[1]);
                    double y = Double.parseDouble(infoStr[2]);
                    String ID=infoStr[4];
                    String timestr=infoStr[5];
                    Long time = Long.parseLong(timestr)*1000;
                    Date d = new Date(time);
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String Timestr=sdf.format(d);
//                    Long Time=Long.parseLong(Timestr);

                    String infoJson = "{\"lng\": " + x + ", \"lat\": " + y +", \"id\": " +"\""+ ID+"\""+", \"time\": \"" + Timestr+"\"}," ;
                    jsonStr.append(infoJson);
                    //{"lng": "120.85631249942352", "lat": "30.662593566467432"}
                } catch (Exception e2) {

                }
            }
            br.close();
            jsonStr.deleteCharAt(jsonStr.length() - 1);
            jsonStr.append("]");
            toBeJson(jsonStr.toString());

        } catch(Exception e){
            e.printStackTrace();
        }

        return null;
    }

    //  测试读取shp输出上海市
    public String getShape() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String outStr = "";
        try {
            String province = request.getParameter("province");
            String city = request.getParameter("city");
            String district = request.getParameter("district");
            if(district == null || "".equals(district)) {
                if(city == null || "".equals(city)) {
                    outStr = ShapeFile.getCityShapeByName(province);
                } else {
                    outStr = ShapeFile.getCityShapeByName(city);
                }
            } else {
                outStr = ShapeFile.getDistrictShapeByName(district);
            }
            JsonAction00.toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public static void toBeJson(String jsonStr){
        HttpServletResponse response = ServletActionContext.getResponse();
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("text/javascript");
        response.setCharacterEncoding("utf-8");
        try {
            PrintWriter out=response.getWriter();
            out.write(jsonStr);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void toBeText(String str){
        HttpServletResponse response = ServletActionContext.getResponse();
        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
        try {
            PrintWriter out=response.getWriter();
            out.write(str);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
class SimpleTrack {
    public long time;

    public String userid;
    public double x, y;

    public SimpleTrack(long time, String userid, double x, double y) {
        this.time = time;
        this.userid = userid;
        this.x = x;
        this.y = y;
    }
}