package test;

import java.util.*;
import net.sf.json.*;
import whu.eres.cartolab.db.mysql.connections.*;
import whu.eres.cartolab.geo.*;

import java.sql.*;

public class test {

    public static String getPointGeoEntities() {
        MysqlLocalConnection conn = MysqlLocalConnection.getInstance();
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
        MysqlLocalConnection conn = MysqlLocalConnection.getInstance();
        String sql = "SELECT * from info order by geid";
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
        MysqlLocalConnection conn = MysqlLocalConnection.getInstance();
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
        MysqlLocalConnection conn = MysqlLocalConnection.getInstance();
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

    public static void main(String[] args) throws Exception {
//        getAllSynData();
//        getAllInfo();
        getAllGeoEntities();
    }


}
