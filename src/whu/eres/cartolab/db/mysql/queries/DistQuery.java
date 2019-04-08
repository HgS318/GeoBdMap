package whu.eres.cartolab.db.mysql.queries;

import whu.eres.cartolab.db.DbUse;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.json.DistJson;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;


public class DistQuery extends MySQLQuery {

//    public static final String tbName = "enshidists";
//    public static final String tbName = "zgdists";
    public static final String tbName = "zgdists_copy";
    public static final String tmpTbName = "enshidists_temp";
    public static String[] columns = null;
    public static String[] easyColumnNames = new String[]{
            "id", "name", "nickname", "大类", "小类", "position", "spaType", "path",
            "所在跨行政区", "dist", "citycode", "ChnSpell", "brif", "SymName"
    };


    public static String getEasyDistInfo() {
        DistJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName + " order by Id";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static String getEasyDistInfoWithZeroChilds() {
        DistJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName + " order by Id";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        if(ds == null) {
            return null;
        }
        for(DistJson pj : ds) {
            DistJson par = DistJson.findObj(ds, pj.parcode);
            if(par != null) {
                pj.setParent(par);
            }
        }
        for(DistJson pj : ds) {
            if(pj.needsZeroChild()) {
                pj.addZeroChild();
            }
        }
        DistJson root = ds.get(0);
        return root.toFullJson();
    }

    public static String getTotalDistInfo() {
        String sql = "SELECT * from " + tbName + " INNER JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id order by " + tbName + ".id";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static String getZiguiDistInfo() {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id order by " + tbName + ".id";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static String getTotalTempDistInfo() {
        String sql = "SELECT * from " + tmpTbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tmpTbName +".PNid = " + PlaceQuery.tbName + ".id order by " + tmpTbName + ".id";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static String getRandomResults(boolean admin) {
        String sql = null;
        if(admin) {
            sql = "SELECT * from " + tmpTbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                    tmpTbName +".PNid = " + PlaceQuery.tbName + ".id " +
                    " where " + tmpTbName + ".OBJECTID < 25 " +
                    " order by " + tbName + ".id ";
        } else {
            sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                    tbName +".PNid = " + PlaceQuery.tbName + ".id " +
                    " where " + tbName + ".OBJECTID > 429 AND " + tbName + ".OBJECTID < 442 " +
                    " order by " + tbName + ".id ";
        }
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        List<DistJson> ld = getDistsFromResultSet(rs);
        int len = ld.size();
        if(len < 1) {
            return "{}";
        }
        int[] randomIds = DbUse.createRandomIds(len);
        if(randomIds.length <1) {
            return "{}";
        }
        List<DistJson> re = new LinkedList<DistJson>();
        for(int i = 0; i < randomIds.length; i++) {
            re.add(ld.get(i));
        }
        String str = DistJson.toJson(re);
        return str;
    }

    public static String getDistInfoByAttr(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = '" + val +"'";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static List<DistJson> serachDistsByAttr(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = '" + val +"'";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    public static String getDistInfoByNum(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".Id where "
                + tbName + "." + attr + " = " + val;
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static List<DistJson> serachDistsByNum(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = " + val;
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    protected static List<DistJson> getDistsFromResultSet(ResultSet rs) {
        List<DistJson> ds = new LinkedList<DistJson>();
        try {
            while (rs.next()) {
                DistJson dj = new DistJson(rs);
                ds.add(dj);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        if(ds.size() < 1) {
            return null;
        }
        return ds;
    }

    protected static String getDistsInfoFromResultSet(ResultSet rs) {
        List<DistJson> ds = getDistsFromResultSet(rs);
        if(ds == null) {
            return null;
        }
        for(DistJson pj : ds) {
            DistJson par = DistJson.findObj(ds, pj.parcode);
            if(par != null) {
                pj.setParent(par);
            }
        }
        return ds.get(0).toFullJson();
    }

    public static List<DistJson> searchDists(String sql) {
        DistJson.consColumnNames(dbType, tbName);
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    public static void main(String[] args) {
//        getTotalDistInfo();
//        createZeroIds();
    }

    private void createZeroIds() {
        DistJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName + " order by Id";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        if(ds == null) {
            return;
        }
        for(DistJson pj : ds) {
            DistJson par = DistJson.findObj(ds, pj.parcode);
            if(par != null) {
                pj.setParent(par);
            }
        }
        DistJson root = ds.get(0);
        root.setChildIds();
        for(DistJson dj : ds) {
            String OBJECTID = dj.getAttr("OBJECTID");
//            if(dj.getParent() != null) {
//                String parid = dj.getParent().getAttr("id");
//                sql = "update " + tbName + " set parent = " + parid + " where OBJECTID = " + OBJECTID;
//                MysqlLocalConnection.excuteUpdate(sql);
//            }
            String childid = dj.getAttr("childid");
            if(childid != null) {
                sql = "update " + tbName + " set childid = " + childid + " where OBJECTID = " + OBJECTID;
                MysqlLocalConnection.excuteUpdate(sql);
            }
            String pchildid = dj.getAttr("pchildid");
            if(pchildid != null) {
                sql = "update " + tbName + " set pchildid = " + pchildid + " where OBJECTID = " + OBJECTID;
                MysqlLocalConnection.excuteUpdate(sql);
            }
            String gpchildid = dj.getAttr("gpchildid");
            if(gpchildid != null) {
                sql = "update " + tbName + " set gpchildid = " + gpchildid + " where OBJECTID = " + OBJECTID;
                MysqlLocalConnection.excuteUpdate(sql);
            }

        }
    }



}
