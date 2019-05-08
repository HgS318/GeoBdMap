package whu.eres.cartolab.db.mysql.queries;

import java.sql.*;
import java.util.*;
import java.util.Date;

import net.sf.json.*;
import whu.eres.cartolab.db.mysql.connections.*;
import whu.eres.cartolab.geo.*;

public class GeoInfoQuery {

    public static String posadd(String spaMethodStr, String timeMethodStr, String time1Str,
                                String time2Str, String ids) {
        int spaMethod = 1;
        int timeMethod = 1;
        Date moment = null, start = null, end = null;
        try {
            spaMethod = Integer.parseInt(spaMethodStr);
            timeMethod = Integer.parseInt(timeMethodStr);
            start = parseEasyuiDateStr(time1Str);
            end = parseEasyuiDateStr(time2Str);
        } catch (Exception e1) {
            return null;
        }
        String sql = "SELECT * FROM info ";
        if(ids != null && !"".equals(ids)) {
            StringBuffer buf = new StringBuffer();
            boolean id_started = false;
            String[] ids_str = ids.split(",");
            for(String idStr : ids_str) {
                try {
                    if(idStr == null || "".equals(idStr)) {
                        continue;
                    }
                    String idTrim = idStr.trim();
                    int id = Integer.parseInt(idTrim);
                    if(!id_started) {
                        buf.append("WHERE");
                        id_started = true;
                    }
                    buf.append(" infoId = ").append(idTrim).append(" OR");
                } catch (Exception e2) {

                }
            }
            if(id_started) {
//                sql += buf.substring(0, buf.length() - 2);
                sql += buf.toString() + " infoId < 0 ";
            }
//            if(spaMethod == 2) {    //  下确共位叠加，加上infoId为负的元素
//                sql += "OR infoId < 0 ";
//            }
        } else {
//            if(spaMethod == 1) {    //  下确共位叠加，加上infoId为负的元素
//                sql += "WHERE infoId > 0 ";
//            }
            sql += "WHERE infoId is NOT NULL ";
        }
        sql += "ORDER BY infoId";
        if(spaMethod == 2) {
            sql += " DESC";
        }
        List<GeoInfo> infos = createGeoInfoBySql(sql);
        List<GeoEntity> entities = null;
        if(timeMethod == 1 || timeMethod == 2) {
            entities = GeoInfo.posadd(infos, spaMethod, timeMethod, null, null, null);
        } else if(timeMethod == 3) {
            moment = start;
            entities = GeoInfo.posadd(infos, spaMethod, timeMethod, moment, null, null);
        } else if(timeMethod == 4) {
            entities = GeoInfo.posadd(infos, spaMethod, timeMethod, null, start, end);
        }
        InfoAmount infoIA = GeoInfo.infoAmount(infos);
        InfoAmount entityIA = GeoEntity.infoAmount(entities);
        String brief1 = "文本: " + infoIA.textLenth + "字节, " +
                "图形: " + infoIA.figureLength + "字节, " +
                "图像: " + infoIA.imageLength + "字节, " +
                "视频: " + infoIA.vedioLength + "秒, " +
                "音频: " + infoIA.audioLength + "秒, " +
                "动画: " + infoIA.flashLength + "秒, " +
                "三维模型: " + infoIA.modelLength + "字节. ";
        String brief2 = "文本: " + entityIA.textLenth + "字节, " +
                "图形: " + entityIA.figureLength + "字节, " +
                "图像: " + entityIA.imageLength + "字节, " +
                "视频: " + entityIA.vedioLength + "秒, " +
                "音频: " + entityIA.audioLength + "秒, " +
                "动画: " + entityIA.flashLength + "秒, " +
                "三维模型: " + entityIA.modelLength + "字节. ";
        String infoStr = String.format("    参与叠加的要素: %d 个，叠加前信息量: %s;" +
                "    叠加产生的要素: %d 个，叠加产生的要素信息量: %s",
                infos.size(), brief1, entities.size(), brief2);
        String entitiesStr = GeoEntity.toJson(entities);
        System.out.println(entitiesStr);
        String resultStr = "{" + "\"brief\": \"" + infoStr + "\", \"entities\":" + entitiesStr + "}";
        return resultStr;
    }

    public static Date parseEasyuiDateStr(String dateStr) {
        String[] m_d_y = dateStr.split("/");
        int month = Integer.parseInt(m_d_y[0].trim());
        int day = Integer.parseInt(m_d_y[1].trim());
        int year = Integer.parseInt(m_d_y[2].trim());
        return new Date(year - 1900, month - 1, day);
    }

    public static List<GeoInfo> createGeoInfoBySql(String sql) {
        List<GeoInfo> infos = new ArrayList<>();
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        try {
            int i = 0;
            while (rs.next()) {
                GeoInfo geoInfo = new GeoInfo(rs);
                infos.add(geoInfo);
//                System.out.println(i + "\t-\t" + geoInfo.infoAmount());
                i++;
            }
            rs.close();
        } catch (Exception se) {
            se.printStackTrace();
        }
        return infos;
    }

    public static String getAllGeoInfo() {
        String sql = "SELECT * from info where infoId > 0 order by infoId";
        List<GeoInfo> infos = createGeoInfoBySql(sql);
        JSONArray results = GeoInfo.toJSONList(infos, true);
        System.out.println(results);
        return results.toString();
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

    public static void main(String[] args) throws Exception {
//        getAllSynData();
        getAllGeoInfo();
//        getAllGeoEntities();
    }

}
