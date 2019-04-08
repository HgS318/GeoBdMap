package whu.eres.cartolab.db.sqlite.connections;

import java.sql.*;

public class SQLiteConnection {

    public static void main( String args[] )
    {
        Connection c = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            c = DriverManager.getConnection("jdbc:sqlite:D:\\MyData\\Dbs\\sqlite\\osm_china_ex.sqlite");
            c.setAutoCommit(false);
            System.out.println("Opened database successfully");

            stmt = c.createStatement();
            ResultSet rs = stmt.executeQuery( "SELECT * FROM node;" );
            int i = 0;
            while ( rs.next() ) {
                int id = rs.getInt("id");
                double lon = rs.getDouble("lon");
                double lat = rs.getDouble("lat");
                System.out.println(id + "\t" + lon + "\t" + lat);
                if(i++ > 100) {
                    break;
                }
//                String  name = rs.getString("name");
//                int age  = rs.getInt("age");
//                String  address = rs.getString("address");
//                float salary = rs.getFloat("salary");
//                System.out.println( "ID = " + id );
//                System.out.println( "NAME = " + name );
//                System.out.println( "AGE = " + age );
//                System.out.println( "ADDRESS = " + address );
//                System.out.println( "SALARY = " + salary );
//                System.out.println();
            }
            rs.close();
            stmt.close();
            c.close();
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
        System.out.println("Operation done successfully");
    }

}