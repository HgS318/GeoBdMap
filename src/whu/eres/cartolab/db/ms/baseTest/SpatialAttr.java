package whu.eres.cartolab.db.ms.baseTest;

public class SpatialAttr {
	
	
	public int type;
	public String typeName;
	public double X, Y;
	public String path;
	
	
	
	public void calAttrs(String geoStr) {
		if(geoStr.startsWith("POINT")) {
			type = 1;
			typeName = "Point";
		} else if(geoStr.startsWith("LINESTRING")) {
			type = 3;
			typeName = "Polyline";
		} else if(geoStr.startsWith("POLYGON")) {
			type = 5;
			typeName = "Polygon";
		}
		
		String arrayStr = geoStr.substring(geoStr.indexOf("(") + 1, geoStr.length() - 1);
		String[] coodArray = arrayStr.split(",");
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		
		double xt = 0, yt = 0;
		for(int i = 0; i < coodArray.length; i++) {
			String coodStr = coodArray[i].replace('(', ' ').replace(')', ' ').trim();
			String[] xyStr = coodStr.split(" ");
			double x = Double.parseDouble(xyStr[0]);
			double y = Double.parseDouble(xyStr[1]);
			xt += x;
			yt += y;
			sb.append(" [").append(xyStr[0]).append(", ").append(xyStr[1]).append("],");
		}
		sb.deleteCharAt(sb.length() - 1);
		sb.append("]");
		path = sb.toString();
		X = xt / coodArray.length;
		Y = yt / coodArray.length;
		
	}
	
	public SpatialAttr() {
		
	}

	public SpatialAttr(String geoStr) {
		calAttrs(geoStr);
	}
	

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		

	}

}
