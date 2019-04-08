package whu.eres.cartolab.json;

import whu.eres.cartolab.db.office.ExcelDemo02;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class TypeJson extends ObjectJson {


	protected static Map<Integer, String> columnNames = new HashMap<Integer, String>();

	public TypeJson() {
		
	}

	public TypeJson(List<String> data) {
		for(int i = 0; i < columnNames.size(); i++) {
			String key = columnNames.get(i);
			String tmpValue = data.get(i);
			tmpValue = tmpValue.replace('\"', '\'');
			String value = null;
			value = tmpValue.replace("\n", "<br/>");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			if(key.equals("name")) {
				this.name = value;
			} else if(!"".equals(key)){
				this.attr.put(key, value);
			}
		}

	}
	
	
	
	
	public static void main(String[] args) {

		List<TypeJson> ps = new LinkedList<TypeJson>();
		List<List<String>> data = null;
		try {
			data = ExcelDemo02.readExcel("web/data/typedemouse.xlsx","Sheet1");
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		List<String> columns = data.get(0);
		consVolumnNames(columns);
		for(int i = 1; i < data.size(); i++) {
			List<String> pdata = data.get(i);
			TypeJson pj = new TypeJson(pdata);
			ps.add(pj);
		}

		Object[] array = ps.toArray();
		for(TypeJson pj : ps) {
			String parname = pj.getAttr("par");
			if(!"".equals(parname)) {
				TypeJson par = (TypeJson)findObj(array, parname);
				pj.setParent(par);
			}
		}
//		for(TypeJson pj : ps) {
//			pj.setAttr("title", pj.name);
//			if (pj.subclasses.size() < 1) {
//				pj.setAttr("type", "item");
//			} else {
//				pj.setAttr("type", "folder");
//			}
//		}
		System.out.println(ps.get(0).toFullJson());

//		System.out.println("[");
//		for(TypeJson pj : ps) {
//			System.out.println(pj.toJson() + ",");
//		}
//		System.out.print("]");

	}

	public static void consVolumnNames(List<String> columns) {
		ObjectJson.consColumnNames(columns, TypeJson.columnNames);
	}

	public static void consVolumnNames(String dbType, String tbName) {
		ObjectJson.consColumnNames(dbType, tbName, TypeJson.columnNames);
	}

}
