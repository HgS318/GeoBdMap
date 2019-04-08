package whu.eres.cartolab.db.mysql.queries;

import whu.eres.cartolab.db.DbUse;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.db.office.WordDemo01;
import whu.eres.cartolab.json.PlaceJson;

import java.sql.*;
import java.util.*;
import java.io.*;

/**
 * 秭归地名查询操作类（过时）
 */
public class ZPlaceQuery extends MySQLQuery {

//    public static final String tbName = "zgpn";
    public static final String tbName = "zgpn_copy1";
//    public static final String tbName = "whpn_tmp";
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
    public static String[] easyColumnNames = new String[]{
            "id", "name", "spell", "大类", "小类", "类别名称", "position",
            "所在跨行政区", "dist", "brif", "desbrif", "使用时间", "geonamecode"
    };

    public static void main(String[] args) throws Exception {

//        String[] tmpColumns = new String[]{"id", "name", "ox", "oy"};
//        String cns = MySQLQuery.createSqlColumns(tmpColumns);
//        String sql = "SELECT " + cns + " from " + tbName;
//        List<PlaceJson> ps = searchEasyPlaces(sql);
//        if(ps.size() < 1) {
//            return;
//        }
//        for(PlaceJson pj : ps) {
//            long id = Long.parseLong(pj.getAttr("id"));
//            double ox = Double.parseDouble(pj.getAttr("ox"));
//            double oy = Double.parseDouble(pj.getAttr("oy"));
//            double[] gcjxy = GPSUtil.bd09_To_Gcj02(oy, ox);
//            double y = gcjxy[0];
//            double x = gcjxy[1];
//            String position = x + "," + y;
//
//            String sql1 = "update " + tbName +" set " + "x" + " = " + x + " where id = " + id;
//            String sql2 = "update " + tbName +" set " + "y" + " = " + y + " where id = " + id;
//            String sql3 = "update " + tbName +" set " + "position" + " = '" + position + "' where id = " + id;
//            MysqlLocalConnection.excuteUpdate(sql1);
//            MysqlLocalConnection.excuteUpdate(sql2);
//            MysqlLocalConnection.excuteUpdate(sql3);
//
//
//            System.out.println(id + "\t" + x + "\t" + y + "\t" + position);
//
//        }


        String[] typenames = new String[]{"单位", "非行政区域", "行政区域", "纪念地旅游景点",
                "建筑物", "交通运输设施", "居民点", "陆地地形", "陆地水系", "群众自治组织", "水利电力设施",};
//        String typeName = "水利电力设施";
        for(String typeName : typenames) {
            typeIntoDb(typeName);
        }
//        indivIntoDb(typeName, "6146秭归县森林公安局地名成果表" + ".docx");

//        int[] idds= new int[]{14, 242, 435, 3816, 4218, 4436, 4486, 4517, 4912, 4994, 6504};
//        for(int i = 0; i < idds.length - 1; i++) {
//            int start = idds[i] + 1, end = idds[i + 1] - 1;
//            int dif = end - start;
//            int step = dif / 11;
//            for(int j = 1; j < 10; j++) {
//                int id = start + j * step;
//                String sql = "insert into zgpn_copy1(select * FROM zgpn where id = " + id + ")";
//                MysqlLocalConnection.excuteUpdate(sql);
//            }
//        }
    }

    //  批量读取doc文档构建地名数据库
    static void typeIntoDb(String typeName) throws Exception  {
        String rootPath = "D:\\temp\\geoname\\秭归县第二次全国地名普查地名成果表" + File.separator;
        String folderPath = rootPath + typeName + File.separator;
        File folder = new File(folderPath);
        File[] files = folder.listFiles();
        int i = 0;
        for(File file : files) {
            Map<String, String> map = WordDemo01.readZiguiDocsTable(file.getAbsolutePath());
            map.put("大类", typeName + "类");
            map.put("filename", file.getName());
//            placeIntoDb(map);
//            if(file.getName().contains("秭归县人民法院"))
                placeUpdateCoordinate(map);
//            System.out.println(typeName + "\t" + i++ + "\t" + map.get("汉字"));
        }
    }

    //  读取单个doc文档构建地名数据库
    static void indivIntoDb(String typeName, String indivName) throws Exception  {
        String rootPath = "D:\\temp\\geoname\\秭归县第二次全国地名普查地名成果表" + File.separator;
        String filePath = rootPath + typeName + File.separator + indivName;
        Map<String, String> map = WordDemo01.readZiguiDocsTable(filePath);
        map.put("大类", typeName + "类");
//        placeIntoDb(map);
        placeUpdateCoordinate(map);
    }

    public static String getTotalGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getTotalTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonameInfo(){
        String cns = createSqlColumns(easyColumnNames);
        String sql = "SELECT " + cns + " from " + tbName;
        List<PlaceJson> ps = searchEasyPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
//        String str = PlaceJson.toJson(ps, easyColumnNames);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

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
                dj = new PlaceJson(rs, false);
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

    public static String getGeonameInfoByAttr(String attr, String val, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'":
                "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getGeonameInfoByNum(String attr, String numVal, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = " + numVal :
                "SELECT * from " + tbName + " where " + attr + " = " + numVal;
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getGeonameFullByAttr(String attr, String val, boolean admin){
        String sql =admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'" :
                "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
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
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

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


    public static void placeUpdateCoordinate(Map<String, String> map) {


        String geonamecode = map.get("地名代码");

        double dj = PlaceJson.drg2num(map.get("东经（自）"));
        double zdj = PlaceJson.drg2num(map.get("东经（至）"));
        double x = (zdj == -200.00 ? dj : (dj + zdj) / 2);
        double bw = PlaceJson.drg2num(map.get("北纬（自）"));
        double zbw = PlaceJson.drg2num(map.get("北纬（至）"));
        double y = (zbw == -200.00 ? bw : (bw + zbw) / 2);
        String posStr = x + "," + y;
        String sql1 = "update " + tbName +" set " + "ox" + " = " + x + " where geonamecode = '" + geonamecode + "'";
        String sql2 = "update " + tbName +" set " + "oy" + " = " + y + " where geonamecode = '" + geonamecode + "'";
        String sql3 = "update " + tbName +" set " + "opos" + " = '" + posStr + "' where geonamecode = '" + geonamecode + "'";
        MysqlLocalConnection.excuteUpdate(sql1);
        MysqlLocalConnection.excuteUpdate(sql2);
        MysqlLocalConnection.excuteUpdate(sql3);

//        System.out.println(posStr);


    }

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
