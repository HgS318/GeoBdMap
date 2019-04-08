package whu.eres.cartolab.db.mysql.mytest;

import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;
import whu.eres.cartolab.db.ms.baseTest.SpatialAttr;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class ArcGISdataTest {

	static String tbName = "enshidivid";

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		Connection conn = MysqlLocalConnection.getConnection();
		Statement st = conn.createStatement();
		ResultSet r = null;
		r = st.executeQuery("select Id, shapeCopy from " + tbName);
		
		while(r.next()) {
			long id =r.getInt(1);
			Object geoObj =r.getObject(2);
			if(geoObj != null) {
				String geoStr = geoObj.toString();
				if(geoStr != null && !"".equals(geoStr)) {
					SpatialAttr sa = new SpatialAttr(geoStr);
					String path = sa.path;
					String sql = "update " + tbName + " set path = '" + path +"' where Id = " + id;
					PreparedStatement ps = null;
					ps = conn.prepareStatement(sql);
					ps.executeUpdate();
					System.out.println("updated " + id);
					ps.close();
				}
			}
		}
		r.close();
		st.close();
		conn.close();
		
	}
	
	
	
	

}
