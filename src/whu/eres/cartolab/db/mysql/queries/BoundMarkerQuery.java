package whu.eres.cartolab.db.mysql.queries;

import whu.eres.cartolab.db.DbUse;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.json.BoundMarkerJson;
import whu.eres.cartolab.json.ObjectJson;

import java.sql.*;
import java.util.*;

/**
 * Created by Administrator on 2017/7/28 0028.
 */
public class BoundMarkerQuery extends MySQLQuery {

//    public static final String tbName = "enshiboundrymarker";
//    public static final String tbName = "zgboundmarkers";
    public static final String tbName = "zgboundmarkers_copy";
    public static final String tmpTbName = "enshiboundrymarker_temp";

    public static String getEasyBoundMarkersInfo() {
        BoundMarkerJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundMarkersInfoFromResultSet(rs);
        return str;
    }

    public static String getEasyTempBoundMarkersInfo() {
        BoundMarkerJson.consColumnNames(dbType, tmpTbName);
        String sql = "SELECT * from " + tmpTbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundMarkersInfoFromResultSet(rs);
        return str;
    }

    public static String getRandomResults(boolean admin) {
        String sql = null;
        if(admin) {
            BoundMarkerJson.consColumnNames(dbType, tmpTbName);
            sql = "SELECT * from " + tmpTbName;
        } else {
            BoundMarkerJson.consColumnNames(dbType, tbName);
            sql = "SELECT * from " + tbName;
        }
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundMarkerJson[] bs = searchBoundMarkersInfoFromResultSet(rs);
        int len = bs.length;
        if(len < 1) {
            return "{}";
        }
        int[] randomIds = DbUse.createRandomIds(len);
        if(randomIds.length <1) {
            return "{}";
        }
        BoundMarkerJson[] re = new BoundMarkerJson[randomIds.length];
        for(int i = 0; i < randomIds.length; i++) {
            re[i] = bs[i];
        }
        String str = BoundMarkerJson.toJson(re);
        return str;
    }

    public static String getBoundMarkerInfoByNum(String attr, String val) {
        BoundMarkerJson bj = searchBoundInfoByNum(attr, val);
        if(bj != null) {
            return bj.toJson();
        } else {
            return null;
        }
    }

    public static String getBoundMarkerRelatedDists(String idStr) {
        Map<String, String> dists = new HashMap<String, String>();
        String sql = "select " + tbName + ".id as mid, " + BoundQuery.tbName +
                ".Id as bid, LeftName, RightName FROM " + tbName +
                " INNER JOIN " + BoundQuery.tbName + " on " +
                BoundQuery.tbName + ".Id = " + tbName +".Bound1ID or " +
                BoundQuery.tbName + ".Id = " + tbName + ".Bound2ID or " +
                BoundQuery.tbName + ".Id = " + tbName + ".Bound3ID or " +
                BoundQuery.tbName + ".Id = " + tbName + ".Bound4ID or " +
                BoundQuery.tbName + ".Id = " + tbName + ".Bound5ID " +
                " where " + tbName + ".Id = " + idStr;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        try {
            while (rs.next()) {
                String ln = rs.getString("LeftName");
                String rn = rs.getString("RightName");
                dists.put(ln, "");
                dists.put(rn, "");
            }
        } catch (SQLException se) {
            se.printStackTrace();
        }
        Set<String> strs = dists.keySet();
        String str = strs.toString();
        str = str.replace("[", "\"");
        str = str.replace("]", "\"");
        return str;

    }

    protected static BoundMarkerJson[] searchBoundMarkersInfoFromResultSet(ResultSet rs) {
        int num = DbUse.getResultSetRowNum(rs);
        if(num < 1) {
            return null;
        }
        BoundMarkerJson[] bs = new BoundMarkerJson[num];
        try {
            int i = 0;
            do {
                BoundMarkerJson dj = new BoundMarkerJson(rs);
                bs[i] = dj;
                i++;
            } while (rs.next());
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
            return null;
        }
        return bs;
    }

    protected static String getBoundMarkersInfoFromResultSet(ResultSet rs) {
        BoundMarkerJson[] bs = searchBoundMarkersInfoFromResultSet(rs);
        if(bs == null || bs.length < 1) {
            return "";
        }
        String str = ObjectJson.toJson(bs);
        return str;
    }


    public static BoundMarkerJson searchBoundInfoByNum(String attr, String val) {
        BoundMarkerJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName +" where " + attr +" = " + val;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundMarkerJson bj = null;
        try {
            if (rs.next()) {
                bj = new BoundMarkerJson(rs);
            }
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            return bj;
        }
    }


}
