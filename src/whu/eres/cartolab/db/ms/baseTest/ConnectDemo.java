package whu.eres.cartolab.db.ms.baseTest;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class ConnectDemo {

    /**
     * @param args
     */
    static String name = "周星星";
    static int clas = 6;
    static Date birthday = new Date(1229223834);
    static String sql = "INSERT INTO StudentList (name,Birthday,class) values (?,?,?)";

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("成功加载SQL驱动程序");
        } catch (Exception e) {
            System.out.println("找不到SQL驱动程序");
        }
        try {
            Connection conn = DriverManager.getConnection(
                    "jdbc:sqlserver://localhost:1433; DatabaseName=StudentMan",
                    "sa", "111");
            PreparedStatement ps = null;
            ps = conn.prepareStatement("use StudentMan");
            ps.executeUpdate();
            ps = conn.prepareStatement(sql);
            ps.setString(1, name);
            java.sql.Date dt = new java.sql.Date(birthday.getTime());
            ps.setDate(2, dt); // ODBC 不支持 setDate();
            ps.setInt(3, clas);
//			ps.executeUpdate();
//			System.out.println("Inerted succeeded!\n");

            Statement st=null;
            st=conn.createStatement();
            ResultSet r = null;
            r=st.executeQuery("select id,Name,Birthday from StudentList");

            while(r.next()) {
                int id =r.getInt(1);
                String name =r.getString(2);
                java.sql.Date da=r.getDate(3);
                System.out.println("id = "+id+"\tname = "+name+"\tBirthday = "+da);
            }
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("数据库连接失败");
        }

    }
    public static void go() {
        String[] s=null;
        main(s);
    }


}
