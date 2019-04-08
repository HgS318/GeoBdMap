package whu.eres.cartolab.db.mysql.queries;

import whu.eres.cartolab.db.DbUse;
import whu.eres.cartolab.json.PlaceJson;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;

import java.sql.*;
import java.util.*;

/**
 * 秭归地名查询操作类（现用）
 */
public class PlaceQuery extends MySQLQuery {

    //    public static final String tbName = "pn";
//    public static final String tbName = "zgpn_copy1";
    public static final String tbName = "zgpn_copy2";
//    public static final String tbName = "whpn_tmp";
//    public static final String tbName = "zgpn";
    public static final String tmpTbName = "pn_temp";
    //    public static String[] columns = null;
    public static String[] columns = new String[]{
            "id", "name", "大类", "小类", "position", "X", "Y", "spaType", "spaTypeName",
            "path", "标准名称", "图名图号年版", "比例尺", "使用时间", "普查状态",
            "设立年份", "废止年份", "东经", "北纬", "至北纬", "坐标系", "测量方法", "地名来历",
            "地名含义", "历史沿革", "地理实体描述", "资料来源及出处", "所在跨行政区",
            "dist", "citycode", "ChnSpell", "brif", "TSCG", "DXCG", "SJCG", "SJQJ", "SJHR",
            "SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"
    };
    //  简单式地名数据，只导出以下列
    public static String[] easyColumnNames = new String[]{
            "id", "name", "nickname", "大类", "小类", "类别名称", "position", "spaType", "path",
            "所在跨行政区", "dist", "citycode", "spell", "brif", "desbrif", "多媒体信息"
    };

    //  获取所有地名的json
    public static String getTotalGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  获取所有临时地名的json
    public static String getTotalTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  获取所有地名的简单式json
    public static String getEasyGeonameInfo(){
        String cns = MySQLQuery.createSqlColumns(easyColumnNames);
        String sql = "SELECT " + cns + " from " + tbName;
        List<PlaceJson> ps = searchEasyPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
//        String str = PlaceJson.toJson(ps, easyColumnNames);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  获取所有临时地名的简单式json
    public static String getEasyTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonamesByBigType(String bigTypeName) {
        String cns = MySQLQuery.createSqlColumns(easyColumnNames);
        String sql = "SELECT " + cns + " from " + tbName + " WHERE `大类` = '" + bigTypeName + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonamesByType(String typeName) {
        String cns = MySQLQuery.createSqlColumns(easyColumnNames);
        String sql = "SELECT " + cns + " from " + tbName + " WHERE `类别名称` = '" + typeName + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonamesByInitial(String initial) {
        String cns = MySQLQuery.createSqlColumns(easyColumnNames);
        String sql = "SELECT " + cns + " from " + tbName +
                " WHERE `spell` like '" + initial +  "%'";
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  随机获取一些地名
    public static String getRandomResults(boolean admin) {
        String sql = null;
        if(admin) {
            sql = "SELECT * from " + tmpTbName;
        } else {
            sql = "SELECT * from " + tbName;
        }
        List<PlaceJson> ps = searchPlaces(sql);
        int len = ps.size();
        if(len < 1) {
            return "{}";
        }
        int[] randomIds = DbUse.createRandomIds(len);
        if(randomIds.length < 1) {
            return "{}";
        }
        List<PlaceJson> re = new LinkedList<PlaceJson>();
        for(int i = 0; i < randomIds.length; i++) {
            re.add(ps.get(i));
        }
        String str = PlaceJson.toJson(re);
        return str;
    }

    public static String getGeonameInfoByNickname(String val, boolean admin){
        String sql = null;
        if(admin) {
            PlaceJson.consColumnNames(dbType, tmpTbName);
            sql = "SELECT * from " + tmpTbName + " where nickname = '" + val +
                    "' or spell = '" + val + "' or name = '" + val + "'";
        } else {
            PlaceJson.consColumnNames(dbType, tbName);
            sql = "SELECT * from " + tbName + " where nickname = '" + val +
                    "' or spell = '" + val + "' or name = '" + val + "'";
        }
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        PlaceJson dj = null;
        try {
            if (rs.next()) {
                dj = new PlaceJson(rs);
            } else {
                return null;
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        String str = dj.toFullJson();
        return str;
    }

    //  通过字符串型的列查询相关地名，输出简单式json
    public static String getGeonameInfoByAttr(String attr, String val, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'":
                "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  通过数值型的列查询相关地名，输出简单式json
    public static String getGeonameInfoByNum(String attr, String numVal, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = " + numVal :
                "SELECT * from " + tbName + " where " + attr + " = " + numVal;
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    //  通过字符串型的列查询相关地名，输出完整式json
    public static String getGeonameFullByAttr(String attr, String val, boolean admin){
        String sql =admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'" :
                "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toFullJson(ps);
        return str;
    }

    public static String getGeonameSpecificInfo(String id_str, String tb_name) {

        String pre_sql = "select FieldName, AliasName from att_dic_layerfields\n" +
                "\tINNER JOIN att_dic_layersets ON\n" +
                "\tatt_dic_layerfields.LayerID = att_dic_layersets.LayerID\n" +
                "\tWHERE att_dic_layersets.TableName = '" + tb_name +"'";

        ResultSet rs_pre = MysqlLocalConnection.executeQuery(pre_sql);
        HashMap<String, String> dict_sim_chn = new HashMap<String, String>();
        try {
            while (rs_pre.next()) {
                String sim = rs_pre.getObject("FieldName").toString();
                String chn = rs_pre.getObject("AliasName").toString();
                dict_sim_chn.put(sim, chn);
            }
            rs_pre.close();
        } catch (SQLException se) {
            se.printStackTrace();
            return "";
        }
        String sql = "SELECT * from " + tb_name + " where " + "DMID" + " = " + id_str;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        HashMap<String, String> dict_key_val = new HashMap<String, String>();
        try {
            if(rs.next()) {
                for(String sim : dict_sim_chn.keySet()) {
                    String chn_key = dict_sim_chn.get(sim);
                    try {
                        String val = rs.getObject(sim).toString();
                        dict_key_val.put(chn_key, val);
                    } catch (Exception exp) {
                        exp.printStackTrace();
                    }
                }
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
            return "";
        }
        StringBuffer sb = new StringBuffer();
        sb.append("[{");
        for(String _key : dict_key_val.keySet()) {
            String _val = dict_key_val.get(_key);
            sb.append(" \"").append(_key).append("\": \"").append(_val).append("\",");
        }
        sb.deleteCharAt(sb.length() - 1);
        sb.append(" }]");
        String dict_str = sb.toString();
        return dict_str;
    }

    //  通过字符串型的列查询相关地名
    public static List<PlaceJson> searchByAttribute(String attr, String val) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    //  通过数值型的列查询相关地名
    public static List<PlaceJson> searchByNumber(String attr, Object numObj) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = " + numObj;
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    //  通过名称模糊查询地名
    public static List<PlaceJson> searchFuzzy(String val) {
        String sql = "SELECT * from " + tbName + " where name like '%" + val + "' ";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    //  通过一个SQL语句查询地名
    public static List<PlaceJson> searchPlaces(String sql) {
        PlaceJson.consColumnNames(dbType, tbName);
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
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

    //  通过一个SQL语句查询easy型地名（引号。换行号等不必替换）
    public static List<PlaceJson> searchEasyPlaces(String sql) {
        PlaceJson.consColumnNames(dbType, tbName);
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<PlaceJson> ps = new LinkedList<PlaceJson>();
        try {
            while (rs.next()) {
                PlaceJson dj = new PlaceJson(rs, true);
                ps.add(dj);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        return ps;
    }


    //  将一个地名写入数据库中
    public static boolean placeIntoDb(Map<String, String> map) {
        String sql= "insert into " + tbName +
                " (`geonamecode`,`类别名称`,`name`,`民族文字`,`语种`,`ChnSpell`,`使用时间`,`abbre`,`nickname`,`oldname`," +
                "`东经`,`至东经`,`北纬`,`至北纬`,`原图名称`,`比例尺`,`图名图号年版`,`所在跨行政区`,`来历含义历史`,`地理实体描述`," +
                "`资料来源及出处`,`多媒体信息`,`备注`,`制表人`,`审核人`,`制表时间`,`大类`,`X`,`Y`,`position`," +
                "`citycode`,`dist`,`地名来历`,`地名含义`,`历史沿革`,`brif`,`spell`) " +
                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        PreparedStatement ps;
        try {
            Connection conn = MysqlLocalConnection.getConnection();
            ps = conn.prepareStatement(sql);

            ps.setString(1, map.get("地名代码"));
            ps.setString(2, map.get("类别名称"));
            ps.setString(3, map.get("汉字"));
            ps.setString(4, map.get("民族文字"));
            ps.setString(5, map.get("语种"));
            ps.setString(6, map.get("罗马字母拼写"));
            ps.setString(7, map.get("使用时间"));
            ps.setString(8, map.get("简称"));
            ps.setString(9, map.get("别名"));
            ps.setString(10, map.get("曾用名"));
            ps.setString(11, map.get("东经（自）"));
            ps.setString(12, map.get("东经（至）"));
            ps.setString(13, map.get("北纬（自）"));
            ps.setString(14, map.get("北纬（至）"));
            ps.setString(15, map.get("原图名称"));
            ps.setString(16, map.get("比例尺"));
            ps.setString(17, map.get("图号（年版）"));
            ps.setString(18, map.get("所在（跨）行政区"));
            String lt = map.get("地名的来历、含义及历史沿革").replace('\"', '\'');
            ps.setString(19, lt);
            ps.setString(20, map.get("地理实体概况").replace('\"', '\''));
            ps.setString(21, map.get("资料来源"));
            ps.setString(22, map.get("多媒体信息"));
            ps.setString(23, map.get("备注"));
            ps.setString(24, map.get("制表人"));
            ps.setString(25, map.get("审核人"));
            ps.setString(26, map.get("制表时间"));

            ps.setString(27, map.get("大类"));

            double dj = PlaceJson.drg2num(map.get("东经（自）"));
            double zdj = PlaceJson.drg2num(map.get("东经（至）"));
            double x = (zdj == -200.00 ? dj : (dj + zdj) / 2);
            double bw = PlaceJson.drg2num(map.get("北纬（自）"));
            double zbw = PlaceJson.drg2num(map.get("北纬（至）"));
            double y = (zbw == -200.00 ? bw : (bw + zbw) / 2);
            String posStr = x + "," + y;
            ps.setDouble(28, x);
            ps.setDouble(29, y);
            ps.setString(30, posStr);

            ps.setString(31, "0717");
            long distcode = getDist(map.get("所在（跨）行政区"));
            ps.setLong(32, distcode);

            String[] strs = lt.split("<br/>");
            String ll = strs[0];
            String hy = strs[1];
            StringBuffer sb = new StringBuffer();
            for(int i = 2; i < strs.length; i++) {
                sb.append(strs[i]).append("<br/>");
            }
            String ls = sb.toString();
            ps.setString(33, ll);
            ps.setString(34, hy);
            ps.setString(35, ls);
            if(hy != null && hy.length() > 23) {
                hy = hy.substring(0, 23) + "...";
            }
            ps.setString(36, hy);

            String spell = PlaceJson.pinyin2spell(map.get("罗马字母拼写"));
            ps.setString(37, spell);
//            ps.setString(36, "");
            int un = ps.executeUpdate();
//            System.out.println(un);
//            boolean un = ps.execute();
//            System.out.println(un);
        } catch (Exception e) {
            System.out.println(map.get("filename") + " insert failed...");
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //  获取行政区的地名代码
    public static long getDist(String distStr) {
        if("秭归县".equals(distStr)) {
            return 420527000;
        } else if("茅坪镇".equals(distStr)) {
            return 420527101;
        } else if("归州镇".equals(distStr)) {
            return 420527102;
        } else if("屈原镇".equals(distStr)) {
            return 420527103;
        } else if("沙镇溪镇".equals(distStr)) {
            return 420527104;
        } else if("两河口镇".equals(distStr)) {
            return 420527105;
        } else if("郭家坝镇".equals(distStr)) {
            return 420527106;
        } else if("杨林桥镇".equals(distStr)) {
            return 420527107;
        } else if("九畹溪镇".equals(distStr)) {
            return 420527108;
        } else if("水田坝乡".equals(distStr)) {
            return 420527201;
        } else if("泄滩乡".equals(distStr)) {
            return 420527202;
        } else if("梅家河乡".equals(distStr)) {
            return 420527203;
        } else if("磨坪乡".equals(distStr)) {
            return 420527204;
        }  else {
            return 420527000;
        }
    }

}
