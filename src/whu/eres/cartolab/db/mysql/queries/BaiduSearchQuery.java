package whu.eres.cartolab.db.mysql.queries;

import java.sql.*;
import java.util.*;

import cn.edu.hfut.dmic.contentextractor.ContentExtractor;
import net.sf.json.*;
import whu.eres.cartolab.db.esri.*;
import whu.eres.cartolab.db.mysql.connections.*;

public class BaiduSearchQuery {

    public static String extractContentSimple(String url) {
        String content = null;
        try {
            content = ContentExtractor.getContentByUrl(url);
//            System.out.println(content);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return content;
    }

    public static void WebCollectorTest() {
        String url = "http://hb.sina.com.cn/news/b/2019-02-27/detail-ihsxncvf8277887.shtml";
        try {
            //		News news = ContentExtractor.getNewsByHtml(html, url);
            //		News news = ContentExtractor.getNewsByHtml(html);
//            News news = ContentExtractor.getNewsByUrl(url);
//            System.out.println(news);

            //		String content = ContentExtractor.getContentByHtml(html, url);
            //		String content = ContentExtractor.getContentByHtml(html);
            String content = ContentExtractor.getContentByUrl(url);
            System.out.println(content);

            //		Element contentElement = ContentExtractor.getContentElementByHtml(html, url);
            //		Element contentElement = ContentExtractor.getContentElementByHtml(html);
//            Element contentElement = ContentExtractor.getContentElementByUrl(url);
//            System.out.println(contentElement);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getAllTestSearchPositions() {
        HashMap<String, String> positionMap =new HashMap<String, String>() {{
            put("中山路400号", "[[114.32392283964214,30.54320062851014]]");
            put("中山路", "[[114.32542681686255,30.549359559792695]]");
            put("大东门", "[[114.32584296317818,30.54402484602882]]");
            put("武昌火车站", "[[114.32357842661469,30.53442711489473]]");
            put("湖北经视", "[[114.34844073658718,30.551600064658352]]");
            put("武汉大东门一栋", "[[114.32584296317818,30.54402484602882]]");
            put("武汉市武昌区千家街", "[[114.32355013268604,30.543364593503387]]");
            put("武昌区中山路400号一居民楼", "[[114.32393276951125,30.54323326028592]]");
            put("武汉市千家街大东门", "[[114.32584296317818,30.54402484602882]]");
            put("武昌区中山路千家街", "[[114.32355013268604,30.543364593503387]]");
            put("大东门居民楼", "[[114.32584296317818,30.54402484602882]]");
            put("武汉大东门千家街", "[[114.32584296317818,30.54402484602882]]");
            put("武昌区中山路400号一居民楼4楼", "[[114.32393276951125,30.54323326028592]]");
            put("大东门千家街机电市场", "[[114.32447690998914,30.541983168597138]]");
            put("大东门立交纽宾凯", "[[114.32584296317818,30.54402484602882]]");
            put("中山路大东门", "[[114.32584296317818,30.54402484602882]]");
            put("武昌区中山路400号", "[[114.32392283964214,30.54320062851014]]");
            put("大东门千家街", "[[114.32584296317818,30.54402484602882]]");
            put("交通广播", "[[114.388661,30.470317]]");
            put("千家街", "[[114.32355013268604,30.543364593503387]]");
            put("武昌区千家街天桥", "[[114.32355013268604,30.543364593503387]]");
            put("武昌区千家街天桥", "[[114.32355013268604,30.543364593503387]]");
        }
        };
        HashMap<String, Map> relposMap =new HashMap<String, Map>(){{
            put("武汉市武昌区千家街 - 附近", new HashMap<String, Object>(){{
                put("shape", "circle");
                put("buffer", 0.008571428571428572);
                put("coords", "[[114.3235466,30.5433591]]");
            }});
            put("中山路大东门 - 附近", new HashMap<String, Object>(){{
                put("shape", "circle");
                put("buffer", 0.008571428571428572);
                put("coords", "[[114.32583931,30.54401962]]");
            }});
        }};
        String sql = "SELECT * from search";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
//        List<GeoInfo> infos = new ArrayList<>();
//        List<GeoEntity> entities = new ArrayList<>();
        HashMap<String, JSONObject> map = new HashMap<>();
//        HashMap<String, GeoEntity> map = new HashMap<>();
        String result = "";
        try {
            int i = 0;
            while (rs.next()) {
                String poswords = rs.getString("poswords");
                if(poswords != null && poswords.length() > 0) {
                    String[] posSplits = poswords.split(";");
                    for(String posStr : posSplits) {
                        JSONObject obj = null;
//                        GeoEntity obj = null
                        if(map.containsKey(posStr)) {
                            obj = map.get(posStr);
                        } else {
                            obj = new JSONObject();
//                            obj = new GeoEntity();
                            obj.put("name", posStr);
                            if(positionMap.containsKey(posStr)) {
                                String coords = positionMap.get(posStr);
//                                obj.put("coords", coords);
                                obj.put("coords", coords);
                            } else if(relposMap.containsKey(posStr)) {
                                HashMap<String, Object> relMap =  (HashMap) relposMap.get(posStr);
                                for (Map.Entry<String, Object> entry : relMap.entrySet()) {
                                    obj.put(entry.getKey(), entry.getValue());
                                }
                            }
                            map.put(posStr, obj);
                        }
                        String url = rs.getString("url");
                        String local = rs.getString("local");
                        String content = rs.getString("content");
                        String text = rs.getString("text");
                        String imageStr = rs.getString("iamges");
                        String vedio = rs.getString("vedio");
//                        obj.put("url", url);
                        obj.put("url", "data/syn_data/fires0227/Contents/" + local);

                    }
                }
            }
        } catch (Exception e) {

        }

        return null;
    }

    public static String getAllFireLocalSites() {

        String sql = "SELECT * from search";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<String> sites = new ArrayList<>();
        try {
            while (rs.next()) {
                String site = rs.getString("local");
                if(site!=null && !site.equals("")) {
                    if(site.indexOf(".html") < 0) {
                        site = site + ".html";
                        String stiePath = "data/syn_data/fires0227/Contents/" + site;
                        sites.add(stiePath);
                    }
                }
            }
        } catch (Exception e) {

        }
        JSONArray arr = new JSONArray();
        int i = 0;
        for(String site : sites) {
            arr.put(i, site);
            i++;
        }
        return arr.toString();
    }

    public static String getFireTraffics() {
        List objs = ShapeUtils.readGisObject(MysqlLocalConnection.websitePath + "data/geo/Wuhan/lukuang3.shp");
        JSONArray array = new JSONArray();
        for(Object obj : objs) {
            GISObjectBase geo = (GISObjectBase)obj;
            JSONObject jo = geo.toJSONObject();
            array.put(jo);
        }
        return array.toString();
//        System.out.println(str);
    }

    public static void main(String[] args) throws Exception {
        WebCollectorTest();
    }


}