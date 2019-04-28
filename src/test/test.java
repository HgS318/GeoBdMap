package test;

import java.util.*;
import net.sf.json.*;
import net.sf.json.*;
import org.apache.poi.poifs.crypt.HashAlgorithm;
import org.apache.solr.common.util.Hash;
import whu.eres.cartolab.db.esri.*;
import whu.eres.cartolab.db.mysql.connections.*;
import whu.eres.cartolab.geo.*;

import java.sql.*;

public class test {

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

    public static String getPointGeoEntities() {
        String sql = "SELECT * from info WHERE spaType = 1 order by geid";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<GeoInfo> infos = new ArrayList<>();
        List<GeoEntity> entities = new ArrayList<>();
        String result = "";
        try {
            int i = 0;
            while (rs.next()) {
                GeoInfo geoInfo = new GeoInfo(rs);
                infos.add(geoInfo);
                i++;
            }
            rs.close();
            int len = infos.size();
            List<GeoInfo> group = new ArrayList<>();
            int lastGeid = -1;
            for(i = 0; i < len; i++) {
                GeoInfo info = infos.get(i);
                if(info.geid != lastGeid) {
                    if(group.size() > 0) {
                        GeoEntity entity = new GeoEntity(group);
                        entities.add(entity);
                        group.clear();
                    }
                }
                group.add(info);
                if(i == len - 1) {
                    GeoEntity entity = new GeoEntity(group);
                    entities.add(entity);
                }
                lastGeid = info.geid;
            }
            i = 0;
            for(GeoEntity entity : entities) {
                System.out.println(i + "\t-\t" + entity.infoAmount());
//                System.out.println(i + "\t-\t" + entity.toJson());
                i++;
            }
            String listStr = GeoEntity.toJson(entities);
            System.out.println(listStr);
            result = listStr;
        } catch (Exception se) {
            se.printStackTrace();
        }
        return result;
    }

    public static String getAllGeoEntities() {
        String sql = "SELECT * from info WHERE geid < 1000 order by geid";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<GeoInfo> infos = new ArrayList<>();
        List<GeoEntity> entities = new ArrayList<>();
        String result = "";
        try {
            int i = 0;
            while (rs.next()) {
                GeoInfo geoInfo = new GeoInfo(rs);
//                System.out.println(i + "\t-\t" + geoInfo.infoAmount());
                infos.add(geoInfo);
                i++;
            }
            rs.close();
            int len = infos.size();
            List<GeoInfo> group = new ArrayList<>();
            int lastGeid = -1;
            for(i = 0; i < len; i++) {
                GeoInfo info = infos.get(i);
                if(info.geid != lastGeid) {
                    if(group.size() > 0) {
                        GeoEntity entity = new GeoEntity(group);
                        entities.add(entity);
                        group.clear();
                    }
                }
                group.add(info);
                if(i == len - 1) {
                    GeoEntity entity = new GeoEntity(group);
                    entities.add(entity);
                }
                lastGeid = info.geid;
            }
            i = 0;
            for(GeoEntity entity : entities) {
                System.out.println(i + "\t-\t" + entity.infoAmount());
//                System.out.println(i + "\t-\t" + entity.toJson());
                i++;
            }
            String listStr = GeoEntity.toJson(entities);
            System.out.println(listStr);
            result = listStr;
        } catch (Exception se) {
            se.printStackTrace();
        }
        return result;
    }

    public static String getAllInfo() {
        String sql = "SELECT * from info";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        JSONArray results = new JSONArray();
        try {
            int i = 0;
            while (rs.next()) {
                GeoInfo geoInfo = new GeoInfo(rs);
                System.out.println(i + "\t-\t" + geoInfo.infoAmount());
                i++;
            }
            rs.close();
        } catch (Exception se) {
            se.printStackTrace();
        }
        return results.toString();
    }

    public static String getAllSynData() {
        String sql = "SELECT * from syn_data";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        JSONArray results = new JSONArray();
        try {
            int i = 0;
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String address = rs.getString("address");
                String phoneNum = rs.getString("phoneNum");
                String position= rs.getString("position");
                String type = rs.getString("type");
                String picturePath1 = rs.getString("picturePath1");
                String picturePath2 = rs.getString("picturePath2");
                String picturePath3 = rs.getString("picturePath3");
                String picturePath4 = rs.getString("picturePath4");
                String videoURL1= rs.getString("videoURL1");
                String videoURL2 = rs.getString("videoURL2");
                String videoURL3 = rs.getString("videoURL3");
                String introduction1 = rs.getString("introduction1");
                String introduction2 = rs.getString("introduction2");
                String introduction3 = rs.getString("introduction3");

                JSONObject obj = new JSONObject();

//                obj.append("name", name);
                obj.put("name", name);
                obj.put("address",address);
                obj.put("phoneNum",phoneNum);
                obj.put("position",position);
                obj.put("type",type);
                obj.put("picturePath1", picturePath1);
                obj.put("picturePath2",picturePath2);
                obj.put("picturePath3",picturePath3);
                obj.put("picturePath4",picturePath4);
                obj.put("videoURL1", videoURL1);
                obj.put("videoURL2", videoURL2);
                obj.put("videoURL3", videoURL3);
                obj.put("introduction1",introduction1);
                obj.put("introduction2",introduction2);
                obj.put("introduction3",introduction3);

                results.put(i, obj);
                i++;

            }
            System.out.println(results.toString());
            rs.close();
        } catch (Exception se) {
            se.printStackTrace();
        }
        return results.toString();
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
//        getAllSynData();
//        getAllInfo();
        getAllGeoEntities();
    }


}
