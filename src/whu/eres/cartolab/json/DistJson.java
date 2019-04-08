package whu.eres.cartolab.json;

import whu.eres.cartolab.db.office.ExcelDemo02;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class DistJson extends ObjectJson {

	
	public String clas = null;
	public int code = 0, parcode = 0;


	protected static Map<Integer, String> columnNames = new HashMap<Integer, String>();

	public DistJson() {
		
	}

	public DistJson(List<String> data) {
		for(int i = 0; i < columnNames.size(); i++) {
			String key = columnNames.get(i);
			String tmpValue = data.get(i);
			dbValue2Attr(tmpValue, key);
		}
	}

	public DistJson(ResultSet rs) {
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
			dbValue2Attr(tmpValue, key);
		}
	}
	
	private void dbValue2Attr(String dbValue, String key) {
		String tmpValue = dbValue.replace('\"', '\'');
		String value = tmpValue;
		if(tmpValue.contains("\r\n")) {
			value = tmpValue.replace("\r\n", "<br/>");
		}
		value = value.replace("\n", "<br/>");
		if(key.equals("position")) {
			value = "[" + value +"]";
		}
		if(key.equalsIgnoreCase("treestate")) {
			if("open".equals(value)) {
				this.open = true;
			}
		} else if(key.equalsIgnoreCase("name")) {
			this.name = value;
		} else if(key.equalsIgnoreCase("id")) {
			try {
				this.code = Integer.parseInt(value);
			} catch(Exception ee) {
				this.code = 0;
			}
			if(code % 10000000 == 0) {
				clas = "province";
				parcode = 0;
			} else if(code % 100000 == 0) {
				clas = "city";
				parcode = code / 10000000 * 10000000;
			} else if(code % 1000 == 0) {
				clas = "county";
				parcode = code / 100000 * 100000;
			} else {
				clas = "street";
				parcode = code / 1000 * 1000;
			}
			this.setAttr("id", value);
		} else {
			this.attr.put(key, value);
		}
	}
	
	public static void main(String[] args) {

		List<DistJson> ps = new LinkedList<DistJson>();
		List<List<String>> data = null;
		try {
			data = ExcelDemo02.readExcel("web/data/distsdemo01.xlsx","Sheet1");
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		List<String> columns = data.get(0);
		consColumnNames(columns);
		for(int i = 1; i < data.size(); i++) {
			List<String> pdata = data.get(i);
			DistJson pj = new DistJson(pdata);
			ps.add(pj);
		}


		for(DistJson pj : ps) {
			DistJson par = findObj(ps, pj.parcode);
			if(par!=null) {
				pj.setParent(par);
			}
		}
//		System.out.println(ps.get(0).toFullJson());
		System.out.println(ps.get(346).toFullJson());

//		System.out.println("[");
//		for(TypeJson pj : ps) {
//			System.out.println(pj.toJson() + ",");
//		}
//		System.out.print("]");

	}

	public static String toJson(List<DistJson> ps, String[] useColumns) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(DistJson pj : ps) {
			String pjStr = pj.toJson(useColumns);
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static String toJson(List<DistJson> ps) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(DistJson pj : ps) {
			String pjStr = pj.toJson();
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static void consColumnNames(List<String> columns) {
		consColumnNames(columns, DistJson.columnNames);
	}

	public static void consColumnNames(String dbType, String tbName) {
		consColumnNames(dbType, tbName, DistJson.columnNames);
	}

	public static ResultSet consColumnNamesBySql(String dbType, String sql) {
		return consColumnNamesBySql(dbType, sql, DistJson.columnNames);
	}

	public static DistJson findObj(List<DistJson> data, int _id) {
		for(DistJson jo : data) {
			if(jo.code == _id) {
				return jo;
			}
		}
		return null;
	}

	
}
