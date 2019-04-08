package whu.eres.cartolab.db.ms.SQLArgs;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Local {
    public static final String dbDriver = "sun.jdbc.odbc.JdbcOdbcDriver";
    public static final String dbAddr = "jdbc:sqlserver://localhost:1433";
    public static String dbName = null;

    public Connection conn = null;

    public static void setDbName(String name) {
        dbName = name;
    }




    public static Connection connect () {
        Connection conn=null;
        try {
            Class.forName(dbDriver);
            System.out.println("加载驱动成功");
        } catch (ClassNotFoundException e1) {
            System.out.println("加载驱动失败");
            e1.printStackTrace();
        }
        try {
            if(dbName == null || "".equals(dbName)) {
                dbName = "StudentMan";
            }
            String connStr = dbAddr + "; DatabaseName=" + dbName;
            conn=DriverManager.getConnection(connStr, "sa", "111");
            System.out.println("数据库连接成功");
        } catch (SQLException e2) {
            System.out.println("数据库连接失败");
            e2.printStackTrace();
        }
        return conn;
    }

    public static Connection connect (String databasename) {
        setDbName(databasename);
        Connection conn=null;
        try {
            Class.forName(dbDriver);
            System.out.println("加载驱动成功");
        } catch (ClassNotFoundException e1) {
            System.out.println("加载驱动失败");
            e1.printStackTrace();
        }
        try {
            if(dbName == null || "".equals(dbName)) {
                dbName = "StudentMan";
            }
            String connStr = dbAddr + "; DatabaseName=" + dbName;
            conn=DriverManager.getConnection(connStr, "sa", "111");
            System.out.println("数据库连接成功");
        } catch (SQLException e2) {
            System.out.println("数据库连接失败");
            e2.printStackTrace();
        }
        return conn;
    }




}
