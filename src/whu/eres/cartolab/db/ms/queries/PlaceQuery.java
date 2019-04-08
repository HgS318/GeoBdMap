package whu.eres.cartolab.db.ms.queries;

import whu.eres.cartolab.json.PlaceJson;
import whu.eres.cartolab.db.ms.SQLArgs.LocalConnection;

import java.sql.*;
import java.util.*;

public class PlaceQuery extends MSQuery {

    public static final String tbName = "PN";
//    public static String[] columns = null;
    public static String[] columns = new String[]{
            "id", "name", "大类", "小类", "position", "X", "Y", "spaType", "spaTypeName",
            "path", "标准名称", "图名图号年版", "比例尺", "使用时间", "普查状态",
            "设立年份", "废止年份", "东经", "北纬", "至北纬", "坐标系", "测量方法", "地名来历",
            "地名含义", "历史沿革", "地理实体描述", "资料来源及出处", "所在跨行政区",
            "dist", "citycode", "ChnSpell", "brif", "TSCG", "DXCG", "SJCG", "SJQJ", "SJHR",
            "SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"
    };
    public static String[] easyColumnNames = new String[]{
            "id", "name", "nickname", "大类", "小类", "position", "spaType", "path",
            "所在跨行政区", "dist", "citycode", "ChnSpell", "brif"
    };

    public static String getTotalGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps, easyColumnNames);
        return str;
    }

    public static String getGeonameInfoByNickname(String val){
        PlaceJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName +" where nickname = '" + val +"'";
        ResultSet rs = LocalConnection.executeQuery(sql);
        PlaceJson dj = null;
        try {
            if (rs.next()) {
                dj = new PlaceJson(rs);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        String str = dj.toFullJson();
        return str;
    }

    public static String getGeonameInfoByAttr(String attr, String val){
        String sql = "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getGeonameFullByAttr(String attr, String val){
        String sql = "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toFullJson(ps);
        return str;
    }

    public static List<PlaceJson> searchByAttribute(String attr, String val) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchByNumber(String attr, Object numObj) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = " + numObj;
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchFuzzy(String val) {
        String sql = "SELECT * from " + tbName + " where name like '%" + val + "' ";
        ResultSet rs = LocalConnection.executeQuery(sql);
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchPlaces(String sql) {
        PlaceJson.consColumnNames(dbType, tbName);
        ResultSet rs = LocalConnection.executeQuery(sql);
        List<PlaceJson> ps = new LinkedList<PlaceJson>();
        try {
            while (rs.next()) {
                PlaceJson dj = new PlaceJson(rs);
                ps.add(dj);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        return ps;
    }





}
