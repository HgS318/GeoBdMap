package whu.eres.cartolab.db.mysql.queries;

/**
 * MySQL 数据库操作的操作类
 */
public class MySQLQuery {

//    public static Connection conn = null;
    public static String dbType = "mysql";

    //  在SQL语句中，构造符合MySQL格式的列名
    public static String createSqlColumns(String[] columnNames) {
        StringBuffer sb = new StringBuffer();
        for(String str : columnNames) {
            sb.append(" `" ).append(str).append("`,");
        }
        sb.deleteCharAt(sb.length() - 1);
        sb.append(' ');
        String sqlColumns = sb.toString();
        return sqlColumns;
    }


}
