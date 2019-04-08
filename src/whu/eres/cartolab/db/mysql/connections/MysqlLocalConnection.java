package whu.eres.cartolab.db.mysql.connections;

import java.sql.*;
import java.io.*;
import java.util.*;
/**
 * MySQL 数据库读写，底层操作类
 */
public class MysqlLocalConnection {
    public static final String dbDriver = "com.mysql.jdbc.Driver";
//    public static final String dbAddr = "jdbc:mysql://10.5.220.29:3306/";
//    public static String account = "root", password = "cartolab";
    public static String db_ip = "";
    public static String db_port = "";
    public static String dbAddr = "";
    public static String account = "", password = "";
    protected String dbName = null;
    public static String defDbName = "";
    protected static MysqlLocalConnection instance = null;
    protected Connection conn = null;   //  系统中所有数据库操作共用此连接

    public static String websitePath = "/";

    //  所有数据库操作共用此操作类实例
    public static MysqlLocalConnection getInstance() {
        if(instance == null) {
            instance = new MysqlLocalConnection();
        }
        return instance;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String _dbName) {
        this.dbName = _dbName;
    }

    //  执行SQL查询语句
    public static ResultSet executeQuery(String sql) {
        Statement st;
        ResultSet rs = null;
        Connection con = MysqlLocalConnection.getConnection();
        try {
            st = con.createStatement();
            rs = st.executeQuery(sql);
        } catch ( Exception de) {
            de.printStackTrace();
        }
        return rs;
    }

    //  执行SQL增删、更新语句
    public static boolean excuteUpdate(String sql) {
        Statement st;
        Connection con = MysqlLocalConnection.getConnection();
        boolean success = false;
        try {
            st = con.createStatement();
            success = st.execute(sql);
        } catch ( Exception de) {
            de.printStackTrace();
        } finally {
            if(success) {
                System.out.println(sql + "success");
            }
            return success;
        }
    }

    private Connection newConn() throws SQLException{
        String connStr = dbAddr + dbName;
        conn = DriverManager.getConnection(connStr, account, password);
        System.out.println("数据库连接成功");
        return conn;
    }

    private Connection ensureConnection() {
        try {
            if(conn == null || conn.isClosed()) {
                newConn();
            }
        } catch (SQLException se) {
            se.printStackTrace();
            System.out.println("数据库连接失败");
        }
        return conn;
    }

    public Connection getConn() {
        if(dbName == null || "".equals(dbName)) {
            setDbName(MysqlLocalConnection.defDbName);
        }
        return ensureConnection();
    }

    public Connection getConn(String _dbName) {
        setDbName(_dbName);
        return ensureConnection();
    }


    public boolean init() {
        try {
            Class.forName(dbDriver);
            System.out.println("加载驱动成功");
            Properties properties = new Properties();
            InputStream inputStream = null;
            //加载配置文件
            inputStream = getClass().getResourceAsStream("/conf.properties");
            properties.load(inputStream);
            //解析配置文件，其中production_url为配置文件中一个参数的key
            websitePath = properties.get("website_path").toString();
            db_ip = properties.get("mysql_addr").toString();
            db_port = properties.get("mysql_port").toString();
            account = properties.get("mysql_account").toString();
            password = properties.get("mysql_pw").toString();
            defDbName = properties.get("mysql_dbname").toString();
            dbAddr = "jdbc:mysql://" + db_ip + ":" + db_port + "/";
            System.out.println("读取数据库初始参数成功");
            return true;
        } catch (ClassNotFoundException ce) {
            System.out.println("加载驱动失败");
            ce.printStackTrace();
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("读取数据库初始参数失败");
            return false;
        }
    }

    protected MysqlLocalConnection() {
        init();
    }

    protected MysqlLocalConnection(String _dbName) {
        setDbName(_dbName);
        init();
    }


    public static Connection getConnection() {
        MysqlLocalConnection lc = MysqlLocalConnection.getInstance();
        Connection conn = lc.getConn();
        return conn;
    }


    public static void main(String[] args) {
        MysqlLocalConnection.getConnection();
    }


}
