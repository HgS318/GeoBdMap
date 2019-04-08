package whu.eres.cartolab.json;

import whu.eres.cartolab.db.office.ExcelDemo02;

import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/*
	������ json ������
 */
public class PlaceJson extends ObjectJson {


	//	��������������
	protected static Map<Integer, String> columnNames = new HashMap<Integer, String>();

	public static String[] fuzzyInfoCol = new String[] {
			"name", "ChnSpell"
	};
	public static String[] exactInfoCol = new String[] {
			"id", "��׼����", "dist",
	};


	public PlaceJson() {
		
	}

	//	����һЩ�ַ����������
	public PlaceJson(List<String> data) {
		for(int i = 0; i < data.size(); i++) {
			String key = columnNames.get(i);
			if(key == null || "".equals(key)) {
				continue;
			}
			String tmpValue = data.get(i);
			tmpValue = tmpValue.replace('\"', '\'');
			String value = null;
			value = tmpValue.replace("\n", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			this.attr.put(key, value);
		}
		if(columnNames.containsValue("name")) {
			this.name = this.getAttr("name");
		}
		if(columnNames.containsValue("��������")) {
			String str = this.getAttr("��������");
			if(str != null && str.length() > 23) {
				str = str.substring(0, 23) + "...";
			}
			this.attr.put("desc", str);
		}
	}

	//	����һ�����ݿ��ѯ���(ResultSet)����һ������
	public PlaceJson(ResultSet rs) {
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
			tmpValue = tmpValue.replace('\"', '\'');
			String value = tmpValue;
			if (tmpValue.contains("\n")) {
				value = tmpValue.replace("\n", "<br/>");
			}
//			if(tmpValue.contains("<br/>")) {
//				value = tmpValue.replace("<br/>", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
//			}
//			String value = tmpValue.replace("\n", "<br/>");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			if(key.equalsIgnoreCase("name")) {
				this.name = value;
			}
			this.attr.put(key, value);
		}
	}

	//	����һ�����ݿ��ѯ���(ResultSet)����һ��������Ĭ����Ҫ�滻���š����еȸ�ʽ��easy�Ͳ����滻
	public PlaceJson(ResultSet rs, boolean easy) {
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
			String value = tmpValue;
			if(!easy) {
				if (tmpValue == null || "".equals(tmpValue)) {
					continue;
				}
				tmpValue = tmpValue.replace('\"', '\'');
				value = tmpValue;
//				if (tmpValue.contains("\n")) {
//					value = tmpValue.replace("\n", "<br/>");
//				}
				if(tmpValue.contains("<br/>")) {
					value = tmpValue.replace("<br/>", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
				}
			}
//			String value = tmpValue.replace("\n", "<br/>");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			if(key.equalsIgnoreCase("name")) {
				this.name = value;
			}
			this.attr.put(key, value);
		}
	}

	public static String toJson(List<PlaceJson> ps) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toJson();
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static String toJson(List<PlaceJson> ps, String[] useColumns) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toJson(useColumns);
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static String toFullJson(List<PlaceJson> ps) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toFullJson(PlaceJson.columnNames.values());
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static void main(String[] args) {


//		String drg = "110��58��28.72��";
//		double drgval = drg2num(drg);
//		System.out.println(drgval);


		List<PlaceJson> ps = new LinkedList<PlaceJson>();
		List<List<String>> data = null;
		try {
			data = ExcelDemo02.readExcel("web/data/placeszg01.xlsx","Sheet1");
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		List<String> columns = data.get(0);
		consColumnNames(columns);
		for(int i = 1; i < data.size(); i++) {
			List<String> pdata = data.get(i);
			PlaceJson pj = new PlaceJson(pdata);
			if(pj.getAttr("name")!=null && !"".equals(pj.getAttr("name"))) {
				ps.add(pj);
			}
		}
//		System.out.print("{\'total\':" + ps.size() +", ");
//		System.out.print("\'places\':");
		System.out.println("[");
		for(PlaceJson pj : ps) {
			System.out.println(pj.toJson() + ",");
		}
		System.out.println("]");
//		System.out.println("}");
	}

	public static void consColumnNames(List<String> columns) {
		ObjectJson.consColumnNames(columns, PlaceJson.columnNames);
	}

	public static void consColumnNames(String dbType, String tbName) {
		ObjectJson.consColumnNames(dbType, tbName, PlaceJson.columnNames);
	}

	//	"�ȷ���"��ʽ�ַ�������С������
	public static double drg2num(String drg) {
		if(drg == null || "".equals(drg)) {
			return -200.00;
		}
		int did = drg.indexOf("��");
		int rid = drg.indexOf("��");
		int gid = drg.indexOf("��");
		if(gid < 0) {
			gid = drg.indexOf("��");
		}
		if(gid < 0) {
			gid = drg.indexOf("\"");
		}
		if(gid < 0) {
			gid = drg.length();
		}
		String dstr = drg.substring(0, did);
		String rstr = drg.substring(did + 1, rid);
		String gstr = drg.substring(rid + 1, gid);
		double d = Double.parseDouble(dstr);
		double r = Double.parseDouble(rstr);
		double g = Double.parseDouble(gstr);
		double val = d + r / 60.0 + g / 3600.0;
		return val;
	}

	//	����ƴ�� - Ӣ��ƴд
	public static String pinyin2spell(String py) {
		String tmp = py;
		tmp = tmp.replace(" ", "");

		tmp = tmp.replace("��", "a");
		tmp = tmp.replace("��", "a");
		tmp = tmp.replace("��", "a");
		tmp = tmp.replace("��", "a");

		tmp = tmp.replace("��", "e");
		tmp = tmp.replace("��", "e");
		tmp = tmp.replace("��", "e");
		tmp = tmp.replace("��", "e");

		tmp = tmp.replace("��", "i");
		tmp = tmp.replace("��", "i");
		tmp = tmp.replace("��", "i");
		tmp = tmp.replace("��", "i");

		tmp = tmp.replace("��", "o");
		tmp = tmp.replace("��", "o");
		tmp = tmp.replace("��", "o");
		tmp = tmp.replace("��", "o");

		tmp = tmp.replace("��", "u");
		tmp = tmp.replace("��", "u");
		tmp = tmp.replace("��", "u");
		tmp = tmp.replace("��", "u");

		tmp = tmp.toLowerCase();

		return tmp;
	}

}
