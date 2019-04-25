package whu.eres.cartolab.controllers;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import java.net.*;
import org.apache.struts2.*;
import net.sf.json.*;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.MultiPolygon;
import com.vividsolutions.jts.geom.Point;
import org.apache.struts2.ServletActionContext;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.xml.xsi.XSISimpleTypes;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.DataInputStream;
import java.io.File;
import java.io.*;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import whu.eres.cartolab.db.esri.*;
import whu.eres.cartolab.db.csv.*;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.geo.*;


public class JsonAction03 {

//    public static void main(String[] args) {
//        new JsonAction03().getChinaAirMixedMultiDaysSplit();
//    }

    public String readCsvTest() {
        int i,l,k;
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/test.csv");  // CSV文件路径
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)  //读取到的内容给line变量
            {
                k = 1;
                l = 0;
                String context[] = line.split(",",-1);
                try {
                    for ( i=0 ;i<context.length/7;i++ ) {
                        String sites_name = context[0];
                        double AQI_num = Double.parseDouble("".equals(context[1+l])?"0.00":context[1+l]);
                        double PM2_5_num = Double.parseDouble("".equals(context[2+l])?"0.00":context[2+l]);
                        double PM10_num = Double.parseDouble("".equals(context[3+l])?"0.00":context[3+l]);
                        double SO2_num = Double.parseDouble("".equals(context[4+l])?"0.00":context[4+l]);
                        double NO2_num = Double.parseDouble("".equals(context[5+l])?"0.00":context[5+l]);
                        double O3_num = Double.parseDouble("".equals(context[6+l])?"0.00":context[6+l]);
                        double CO_num = Double.parseDouble("".equals(context[7+l])?"0.00":context[7+l]);
                        buf.append("{\"监测点\""  +":" + "\"" + sites_name  + "1月" + k + "日\""
                                + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":\"" + PM2_5_num + "\"," + "\"PM10\":" +
                                PM10_num + "," + "\"SO2\":" + SO2_num + ","
                                + "\"NO2\":" + NO2_num + "," + "\"O3\":" + O3_num + "," +
                                "\"CO\":" + CO_num + " },");
                        l += 7;
                        k++;
                    }
                } catch (Exception e2) {
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getBeijingAirMoment() {

        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/collocation_overlay/beijing_20180101_00.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(csv),"utf-8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                String context[] = line.split(",");
                try {
                    String sites_name = context[0];
                    double lng_num = Double.parseDouble(context[1]);
                    double lat_num = Double.parseDouble(context[2]);
                    double AQI_num = Double.parseDouble(context[3]);
                    double PM2_5_num = Double.parseDouble(context[4]);
                    double PM10_num = Double.parseDouble(context[5]);
                    double SO2_num = Double.parseDouble(context[6]);
                    double NO2_num = Double.parseDouble(context[7]);
                    double O3_num = Double.parseDouble(context[8]);
                    double CO_num = Double.parseDouble(context[9]);
                    buf.append("{\"监测点\""+":" + "\"" + sites_name + "\"" + "," + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num
                            + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" +
                            PM10_num + "," + "\"SO2\":" + SO2_num + "," + "\"NO2\":" + NO2_num + "," + "\"O3\":" + O3_num + "," + "\"CO\":" + CO_num + " },");
                } catch (Exception e2) {
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getChinaAirMoment() {
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/collocation_overlay/china_20180101_00.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                String context[] = line.split(",");
                try {
                    String sites_code = context[0];
                    String sites_name = context[1];
                    String city = context[2];
                    double lng_num = Double.parseDouble(context[3]);
                    double lat_num = Double.parseDouble(context[4]);
                    double AQI_num = Double.parseDouble(context[5]);
                    double PM2_5_num = Double.parseDouble(context[6]);
                    double PM10_num = Double.parseDouble(context[7]);
                    buf.append("{\"监测点编码\":" + "\"" + sites_code + "\"" + "," + "\"监测点名称\":" + "\"" + sites_name + "\"" + "," + "\"城市\":" + "\"" + city + "\"" + ","
                            + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" + PM10_num + " },");
                } catch (Exception e2) {
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getBeijingAirMomentMixed() {

        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/collocation_overlay/beijing_coincide_00.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                String context[] = line.split(",");
                try {
                    String sites_code = context[0];
                    String sites_name = context[1];
                    String city = context[2];
                    double lng_num = Double.parseDouble(context[3]);
                    double lat_num = Double.parseDouble(context[4]);
                    double AQI_num = Double.parseDouble(context[5]);
                    double PM2_5_num = Double.parseDouble(context[6]);
                    double PM10_num = Double.parseDouble(context[7]);
                    double SO2_num = Double.parseDouble(context[8]);
                    double NO2_num = Double.parseDouble(context[9]);
                    double O3_num = Double.parseDouble(context[10]);
                    double CO_num = Double.parseDouble(context[11]);
                    buf.append("{\"监测点编码\":" + "\"" + sites_code + "\"" + "," + "\"监测点名称\":" + "\"" + sites_name + "\"" + "," + "\"城市\":" + "\"" + city + "\","
                            + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" +
                            PM10_num + "," + "\"SO2\":" + SO2_num + "," + "\"NO2\":" + NO2_num + "," + "\"O3\":" + O3_num + "," + "\"CO\":" + CO_num + " },");
                } catch (Exception e2) {
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String geiBeijingAirMultiDaysSplit() {
        int i,l,k;
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/parallel_overlay/beijing_01to10_3.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                k = 1;
                l = 0;
                String context[] = line.split(",",-1);
                try {
                    for ( i=0 ;i<(context.length/3-1);i++ ) {
                        String sites_name = context[0];
                        String city = context[1];
                        double lng_num = Double.parseDouble(context[2]);
                        double lat_num = Double.parseDouble(context[3]);
                        double AQI_num = Double.parseDouble("".equals(context[4+l].toString())?"0.00":context[4+l].toString());
                        double PM2_5_num = Double.parseDouble("".equals(context[5+l].toString())?"0.00":context[5+l].toString());
                        double PM10_num = Double.parseDouble("".equals(context[6+l].toString())?"0.00":context[6+l].toString());
                        buf.append("{\"监测点名称\":" + "\"" + sites_name + "-1月" + k + "日\"" + "," + "\"城市\":" + "\"" + city + "\"" + ","
                                + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":\"" + PM2_5_num + "\"," + "\"PM10\":" + PM10_num + " },");
//                        l += 3;
                        l += 3;
                        k++;
                    }
                } catch (Exception e2) {
                    continue;
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String geiAirMultiDays() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String jsonStr = "";
        try {
            String path = request.getParameter("path");
            MysqlLocalConnection.getInstance();
            String filePath = MysqlLocalConnection.websitePath + "data/air/parallel_overlay/" + path + ".csv";
            jsonStr = CSVToJSon.ConvertToJson(filePath);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            toBeJson(jsonStr);
        }
        return null;
    }

    public String getChinaAirMultiDaysSplit() {
        int i,l,k;
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/parallel_overlay/china_06to15_3.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                k = 6;
                l = 0;
                String context[] = line.split(",",-1);
                try {
                    for ( i=0 ;i<(context.length/3-1);i++ ) {
                        String sites_code = context[0];
                        String sites_name = context[1];
                        String city = context[2];
                        double lng_num = Double.parseDouble(context[3]);
                        double lat_num = Double.parseDouble(context[4]);
                        double AQI_num = Double.parseDouble("".equals(context[5+l].toString())?"0.00":context[4+l].toString());
                        double PM2_5_num = Double.parseDouble("".equals(context[6+l].toString())?"0.00":context[5+l].toString());
                        double PM10_num = Double.parseDouble("".equals(context[7+l].toString())?"0.00":context[6+l].toString());
                        buf.append("{\"监测点编码\":" + "\"" + sites_code + "\"" + "," + "\"监测点名称\":" + "\"" + sites_name + "-1月" + k + "日\"" + "," + "\"城市\":" + "\"" + city + "\"" + ","
                                + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" + PM10_num + " },");
                        l += 3;
                        k++;
                    }
                } catch (Exception e2) {
                    continue;
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getBeijing0610Split() {
        int i,l,j;
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/parallel_overlay/beijing_coincide_06to10.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                j = 6;
                l = 0;
                String context[] = line.split(",",-1);
                try {
                    for ( i=0 ;i<(context.length/3-1);i++ ) {
                        String sites_code = context[0];
                        String sites_name = context[1];
                        String city = context[2];
                        double lng_num = Double.parseDouble(context[3]);
                        double lat_num = Double.parseDouble(context[4]);
                        double AQI_num = Double.parseDouble("".equals(context[5+l].toString())?"0.00":context[5+l].toString());
                        double PM2_5_num = Double.parseDouble("".equals(context[6+l].toString())?"0.00":context[6+l].toString());
                        double PM10_num = Double.parseDouble("".equals(context[7+l].toString())?"0.00":context[7+l].toString());
                        buf.append("{\"监测点编码\":" + "\"" + sites_code + "\"" + "," + "\"监测点名称\":" + "\"" + sites_name + "-1月" + j + "日\"" + "," + "\"城市\":" + "\"" + city + "\"" + ","
                                + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" + PM10_num + " },");
                        l += 3;
                        j++;
                    }
                } catch (Exception e2) {
                    continue;
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getChinaAirMixedMultiDaysSplit() {
        int i,l,j;
        MysqlLocalConnection.getInstance();
        File csv = new File(MysqlLocalConnection.websitePath + "data/air/parallel_overlay/china_coincide_06to10.csv");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String line ;
        try {
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            line = br.readLine();
            while ((line = br.readLine()) != null)
            {
                j = 6;
                l = 0;
                String context[] = line.split(",",-1);
                try {
                    for ( i=0 ;i<(context.length/3-1);i++ ) {
                        String sites_code = context[0];
                        String sites_name = context[1];
                        String city = context[2];
                        double lng_num = Double.parseDouble(context[3]);
                        double lat_num = Double.parseDouble(context[4]);
                        double AQI_num = Double.parseDouble("".equals(context[5+l].toString())?"0.00":context[5+l].toString());
                        double PM2_5_num = Double.parseDouble("".equals(context[6+l].toString())?"0.00":context[6+l].toString());
                        double PM10_num = Double.parseDouble("".equals(context[7+l].toString())?"0.00":context[7+l].toString());
                        buf.append("{\"监测点名称\":" + "\"" + sites_name + "-1月" + j + "日\"" + "," + "\"城市\":" + "\"" + city + "\"" + ","
                                + "\"经度\":" + lng_num + "," + "\"纬度\":" + lat_num + "," + "\"AQI\":" + AQI_num + "," + "\"PM2.5\":" + PM2_5_num + "," + "\"PM10\":" + PM10_num + " },");
                        l += 3;
                        j++;
                    }
                } catch (Exception e2) {
                    continue;
                }
            }
            br.close();
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
//            System.out.println(buf);
            toBeJson(buf.toString());
        } catch (IOException e) {
            e.printStackTrace();
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
