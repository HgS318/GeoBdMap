package whu.eres.cartolab.db.ms.SQLArgs;

import java.sql.*;

public class LocalConnection {
    public static final String dbDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    public static String db_ip = "", db_port = "";
    public static final String dbAddr = "jdbc:sqlserver://localhost:1433";
    public static String account = "sa", password = "111";
    protected String dbName = null;
    public static String defDbName = "P1M_arcgis";
    protected static LocalConnection instance = null;
    protected Connection conn = null;

    public static LocalConnection getInstance() {
        if(instance == null) {
            instance = new LocalConnection();
        }
        return  instance;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String _dbName) {
        this.dbName = _dbName;
    }

    public static ResultSet executeQuery(String sql) {
        Statement st = null;
        ResultSet rs = null;
        Connection con = LocalConnection.getConnection();
        try {
            st = con.createStatement();
            rs = st.executeQuery(sql);
        } catch ( Exception de) {
            de.printStackTrace();
        }
        return rs;
    }

    private Connection newConn() throws SQLException{
        String connStr = dbAddr + "; DatabaseName=" + dbName;
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
            setDbName(LocalConnection.defDbName);
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
            return true;
        } catch (ClassNotFoundException e1) {
            System.out.println("加载驱动失败");
            e1.printStackTrace();
            return false;
        }
    }

    protected LocalConnection() {
        init();
    }

    protected LocalConnection(String _dbName) {
        setDbName(_dbName);
        init();
    }


    public static Connection getConnection() {
        LocalConnection lc = LocalConnection.getInstance();
        Connection conn = lc.getConn();
        return conn;
    }

    public static void main(String[] args) {
        LocalConnection.getConnection();
    }

}
