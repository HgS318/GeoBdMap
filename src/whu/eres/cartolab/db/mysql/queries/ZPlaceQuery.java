package whu.eres.cartolab.db.mysql.queries;

import whu.eres.cartolab.db.DbUse;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.db.office.WordDemo01;
import whu.eres.cartolab.json.PlaceJson;

import java.sql.*;
import java.util.*;
import java.io.*;

/**
 * ���������ѯ�����ࣨ��ʱ��
 */
public class ZPlaceQuery extends MySQLQuery {

//    public static final String tbName = "zgpn";
    public static final String tbName = "zgpn_copy1";
//    public static final String tbName = "whpn_tmp";
    public static final String tmpTbName = "pn_temp";
    //    public static String[] columns = null;
    public static String[] columns = new String[]{
            "id", "name", "����", "С��", "position", "X", "Y", "spaType", "spaTypeName",
            "path", "��׼����", "ͼ��ͼ�����", "������", "ʹ��ʱ��", "�ղ�״̬",
            "�������", "��ֹ���", "����", "��γ", "����γ", "����ϵ", "��������", "��������",
            "��������", "��ʷ�ظ�", "����ʵ������", "������Դ������", "���ڿ�������",
            "dist", "citycode", "ChnSpell", "brif", "TSCG", "DXCG", "SJCG", "SJQJ", "SJHR",
            "SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"
    };
    public static String[] easyColumnNames = new String[]{
            "id", "name", "spell", "����", "С��", "�������", "position",
            "���ڿ�������", "dist", "brif", "desbrif", "ʹ��ʱ��", "geonamecode"
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


        String[] typenames = new String[]{"��λ", "����������", "��������", "��������ξ���",
                "������", "��ͨ������ʩ", "�����", "½�ص���", "½��ˮϵ", "Ⱥ��������֯", "ˮ��������ʩ",};
//        String typeName = "ˮ��������ʩ";
        for(String typeName : typenames) {
            typeIntoDb(typeName);
        }
//        indivIntoDb(typeName, "6146������ɭ�ֹ����ֵ����ɹ���" + ".docx");

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

    //  ������ȡdoc�ĵ������������ݿ�
    static void typeIntoDb(String typeName) throws Exception  {
        String rootPath = "D:\\temp\\geoname\\�����صڶ���ȫ�������ղ�����ɹ���" + File.separator;
        String folderPath = rootPath + typeName + File.separator;
        File folder = new File(folderPath);
        File[] files = folder.listFiles();
        int i = 0;
        for(File file : files) {
            Map<String, String> map = WordDemo01.readZiguiDocsTable(file.getAbsolutePath());
            map.put("����", typeName + "��");
            map.put("filename", file.getName());
//            placeIntoDb(map);
//            if(file.getName().contains("����������Ժ"))
                placeUpdateCoordinate(map);
//            System.out.println(typeName + "\t" + i++ + "\t" + map.get("����"));
        }
    }

    //  ��ȡ����doc�ĵ������������ݿ�
    static void indivIntoDb(String typeName, String indivName) throws Exception  {
        String rootPath = "D:\\temp\\geoname\\�����صڶ���ȫ�������ղ�����ɹ���" + File.separator;
        String filePath = rootPath + typeName + File.separator + indivName;
        Map<String, String> map = WordDemo01.readZiguiDocsTable(filePath);
        map.put("����", typeName + "��");
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


        String geonamecode = map.get("��������");

        double dj = PlaceJson.drg2num(map.get("�������ԣ�"));
        double zdj = PlaceJson.drg2num(map.get("����������"));
        double x = (zdj == -200.00 ? dj : (dj + zdj) / 2);
        double bw = PlaceJson.drg2num(map.get("��γ���ԣ�"));
        double zbw = PlaceJson.drg2num(map.get("��γ������"));
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
                " (`geonamecode`,`�������`,`name`,`��������`,`����`,`ChnSpell`,`ʹ��ʱ��`,`abbre`,`nickname`,`oldname`," +
                "`����`,`������`,`��γ`,`����γ`,`ԭͼ����`,`������`,`ͼ��ͼ�����`,`���ڿ�������`,`����������ʷ`,`����ʵ������`," +
                "`������Դ������`,`��ý����Ϣ`,`��ע`,`�Ʊ���`,`�����`,`�Ʊ�ʱ��`,`����`,`X`,`Y`,`position`," +
                "`citycode`,`dist`,`��������`,`��������`,`��ʷ�ظ�`,`brif`,`spell`) " +
                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        PreparedStatement ps;
        try {
            Connection conn = MysqlLocalConnection.getConnection();
            ps = conn.prepareStatement(sql);

            ps.setString(1, map.get("��������"));
            ps.setString(2, map.get("�������"));
            ps.setString(3, map.get("����"));
            ps.setString(4, map.get("��������"));
            ps.setString(5, map.get("����"));
            ps.setString(6, map.get("������ĸƴд"));
            ps.setString(7, map.get("ʹ��ʱ��"));
            ps.setString(8, map.get("���"));
            ps.setString(9, map.get("����"));
            ps.setString(10, map.get("������"));
            ps.setString(11, map.get("�������ԣ�"));
            ps.setString(12, map.get("����������"));
            ps.setString(13, map.get("��γ���ԣ�"));
            ps.setString(14, map.get("��γ������"));
            ps.setString(15, map.get("ԭͼ����"));
            ps.setString(16, map.get("������"));
            ps.setString(17, map.get("ͼ�ţ���棩"));
            ps.setString(18, map.get("���ڣ��磩������"));
            String lt = map.get("���������������弰��ʷ�ظ�").replace('\"', '\'');
            ps.setString(19, lt);
            ps.setString(20, map.get("����ʵ��ſ�").replace('\"', '\''));
            ps.setString(21, map.get("������Դ"));
            ps.setString(22, map.get("��ý����Ϣ"));
            ps.setString(23, map.get("��ע"));
            ps.setString(24, map.get("�Ʊ���"));
            ps.setString(25, map.get("�����"));
            ps.setString(26, map.get("�Ʊ�ʱ��"));

            ps.setString(27, map.get("����"));

            double dj = PlaceJson.drg2num(map.get("�������ԣ�"));
            double zdj = PlaceJson.drg2num(map.get("����������"));
            double x = (zdj == -200.00 ? dj : (dj + zdj) / 2);
            double bw = PlaceJson.drg2num(map.get("��γ���ԣ�"));
            double zbw = PlaceJson.drg2num(map.get("��γ������"));
            double y = (zbw == -200.00 ? bw : (bw + zbw) / 2);
            String posStr = x + "," + y;
            ps.setDouble(28, x);
            ps.setDouble(29, y);
            ps.setString(30, posStr);

            ps.setString(31, "0717");
            long distcode = getDist(map.get("���ڣ��磩������"));
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

            String spell = PlaceJson.pinyin2spell(map.get("������ĸƴд"));
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
        if("������".equals(distStr)) {
            return 420527000;
        } else if("éƺ��".equals(distStr)) {
            return 420527101;
        } else if("������".equals(distStr)) {
            return 420527102;
        } else if("��ԭ��".equals(distStr)) {
            return 420527103;
        } else if("ɳ��Ϫ��".equals(distStr)) {
            return 420527104;
        } else if("���ӿ���".equals(distStr)) {
            return 420527105;
        } else if("���Ұ���".equals(distStr)) {
            return 420527106;
        } else if("��������".equals(distStr)) {
            return 420527107;
        } else if("���Ϫ��".equals(distStr)) {
            return 420527108;
        } else if("ˮ�����".equals(distStr)) {
            return 420527201;
        } else if("й̲��".equals(distStr)) {
            return 420527202;
        } else if("÷�Һ���".equals(distStr)) {
            return 420527203;
        } else if("ĥƺ��".equals(distStr)) {
            return 420527204;
        }  else {
            return 420527000;
        }
    }


}
