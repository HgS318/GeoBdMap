package whu.eres.cartolab.json;

import java.sql.*;
import java.util.*;

/**
 * Created by Administrator on 2017/7/28 0028.
 */
public class BoundMarkerJson extends ObjectJson {

    protected static Map<Integer, String> columnNames = new HashMap<Integer, String>();

    public BoundMarkerJson() {

    }

    public static void main(String[] args) {
        System.out.println("½ç×®");
    }


    public BoundMarkerJson(ResultSet rs) {
        for(int i = 0; i < columnNames.size(); i++) {
            String key = columnNames.get(i);
            Object obj = null;
            try {
                obj = rs.getObject(key);
            } catch (SQLException se) {
                continue;
            }
            if(obj == null) {
                continue;
            }
            String tmpValue = obj.toString();
            if(tmpValue == null || "".equals(tmpValue)) {
                continue;
            }
            String value = tmpValue.replace('\"', '\'');
            if(key.equals("position")) {
                value = "[" + value +"]";
            }
            if(key.equalsIgnoreCase("name")) {
                this.name = value;
            }
            this.attr.put(key, value);
        }
        if(name == null || "".equals(name)) {
            name = "½ç×®" + attr.get("Id");
        }
        String posStr = "[" + attr.get("X") + ", " + attr.get("Y") + "]";
        this.attr.put("position", posStr);
    }


    public static void consColumnNames(List<String> columns) {
        ObjectJson.consColumnNames(columns, BoundMarkerJson.columnNames);
    }

    public static void consColumnNames(String dbType, String tbName) {
        ObjectJson.consColumnNames(dbType, tbName, BoundMarkerJson.columnNames);
    }

    public static ResultSet consColumnNamesBySql(String dbType, String sql) {
        return ObjectJson.consColumnNamesBySql(dbType, sql, BoundMarkerJson.columnNames);
    }

}
