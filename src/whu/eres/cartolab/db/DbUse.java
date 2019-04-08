package whu.eres.cartolab.db;

import java.sql.*;
import java.util.*;

/**
 * 数据库、文件操作相关的常用方法
 */
public class DbUse {

    //  将数据库查询结果(ResultSet)的信息写入json格式的 StringBuffer 中
    public static void appendResult2JsonBuffer(ResultSet rs, StringBuffer jsonBuf,
            String[] columns) throws SQLException {
        jsonBuf.append("{");
        for(int j = 0; j < columns.length; j++) {
            String columnName = columns[j];
            Object obj = rs.getObject(columnName);
            if(obj == null) {
                continue;
            }
            String tmpValue = obj.toString();
            if(tmpValue == null || "".equals(tmpValue)) {
                continue;
            }
            tmpValue = tmpValue.replace('\"', '\'');
            String val = null;
            val = tmpValue.replace("\n", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
            jsonBuf.append("\"").append(columnName).append("\":\"").append(val).append("\",");
        }
        jsonBuf.append("}");
    }

    public static String result2String(ResultSet rs, String[] columns) throws SQLException {
        StringBuffer sb = new StringBuffer();
        appendResult2JsonBuffer(rs, sb, columns);
        String str = sb.toString();
        return str;
    }

    //  获取 ResultSet 结果的数目
    public static int getResultSetRowNum(ResultSet resultSet) {
        int rowCount = -1;
        try {
            resultSet.last();
            rowCount = resultSet.getRow();
            resultSet.first();
        } catch (Exception e) {
            System.out.println("获取ResultSet行数失败...");
            e.printStackTrace();
        }
        return rowCount;
    }

    //  构造SQL语句中的列名
    public static String columnsToSQL(String[] columns) {
        StringBuffer sb = new StringBuffer();
        for(int i = 0; i < columns.length; i++) {
            sb.append(" ").append(columns[i]);
            if(i != columns.length - 1) {
                sb.append(",");
            }
        }
        sb.append(" ");
        return sb.toString();
    }

    //  获取文件后缀名
    public static String getFileSuffix(String fileName) {
        int dId = fileName.lastIndexOf('.');
        if(dId < 0) {
            return null;
        }
        String suf = fileName.substring(dId);
        return suf;
    }


    public static void main(String[] args) {
        createRandomIds(4);
        createRandomIds(23);
        createRandomIds(58);
        createRandomIds(24);
    }

    //  在不大于 len 的自然数中，获取互不相同的随机数（随机数的个数也是随机确定的）
    public static int[] createRandomIds(int len) {
        Random random = new Random();
        List<Integer> lis = new LinkedList<Integer>();
        int total = random.nextInt(len);
        int resttotal = len - total;
        int offset = random.nextInt(resttotal);
        while(lis.size() < total) {
            int num = random.nextInt(total);
            boolean flag = false;
            for(Integer ext : lis) {
                if(ext == num) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                lis.add(num);
            }
        }
        int[] re = new int[total];
        for(int i = 0; i < total; i++) {
            re[i] = lis.get(i) + offset;
        }
        return re;
    }

}
