package whu.eres.cartolab.json;

import whu.eres.cartolab.db.ms.SQLArgs.LocalConnection;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;
import java.util.Map.Entry;


/*
	对象的json处理总操作类
 */
public class ObjectJson {

	public String name;	//	名称
	public ObjectJson parent;	//	父对象
	public List<ObjectJson> subclasses = new LinkedList<ObjectJson>();	//	子对象
	public Map<String, String> attr = new HashMap<String, String>();	//	对象的 属性-值 映射表
	public boolean open = false;	//	在树状图中，是否需要展开其子类
//	public Map<Integer, String> columnNames = new HashMap<Integer, String>();

	//	值数值型的列（其他列的值默认为字符串型）
	public static String[] numKeys = new String[]{"id", "position", "X", "Y", "TSCG", "DXCG", "SJCG",
			"SJQJ", "SJHR", "SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"};

	public ObjectJson() {
		
	}

	public ObjectJson(String _name) {
		name = _name;
	}

	public ObjectJson(String _name, ObjectJson par) {
		name = _name;
		this.simpleSetParent(par);
		par.simpleSetSub(this);
	}
	
	public ObjectJson(String _name, ObjectJson par, int order) {
		name = _name;
		this.simpleSetParent(par);
		par.simpleSetSub(this, order);
	}
	
	
	public static void main(String[] args) {
		ObjectJson root = new ObjectJson("武汉");
		
		ObjectJson hongshan = new ObjectJson("洪山区", root);
		ObjectJson luonan = new ObjectJson("珞南街道", hongshan);
		
		ObjectJson wuchang = new ObjectJson("武昌区", root);
		ObjectJson ziyang = new ObjectJson("紫阳街道", wuchang);
		
		String fulljson = root.toFullJson();
		String json = root.toJson();
		
		System.out.println(fulljson);
		System.out.println(json);
		
	}
	
	
	public String getName() {
		return name;
	}
	
	public void setName(String _name) {
		name = _name;
	}

	public boolean containsAttr(String attrName) {
		return this.attr.containsKey(attrName);
	}

	public String getAttr(String attrName) {
		return this.attr.get(attrName);
	}
	
	public void setAttr(String attrName, String attrValue) {
		this.attr.put(attrName, attrValue);
	}

	public void setAttr(String attrName, int intValue) {
		this.attr.put(attrName, String.valueOf(intValue));
	}
	
	public ObjectJson getParent() {
		return parent;
	}

	public String getParentName() {
		if(parent != null) {
			return parent.getName();
		}
		return getAttr("parent");
	}

	public void setParent(ObjectJson par) {
		this.simpleSetParent(par);
		par.simpleSetSub(this);
	}
	
	public void setSub(ObjectJson sub) {
		sub.simpleSetParent(this);
		this.simpleSetSub(sub);
	}

	public void setSub(ObjectJson sub, int order) {
		sub.simpleSetParent(this);
		this.simpleSetSub(sub, order);
	}
	
	
	public void simpleSetParent(ObjectJson par) {
		this.parent = par;
	}
	
	public void simpleSetSub(ObjectJson sub, int order) {
		int idx = this.subclasses.indexOf(sub);
		if(idx > -1) {
			this.subclasses.add(order, sub);
		} else {
			this.subclasses.add(order, sub);
		}
	}

	public void simpleSetSub(ObjectJson sub) {
		int idx = this.subclasses.indexOf(sub);
		if(idx > -1) {
			this.subclasses.remove(idx);
			this.subclasses.add(idx, sub);
		} else {
			this.subclasses.add(sub);
		}
	}

	//	对象的完整信息的json字符串（其子类的信息递归地在出现在json中）
	public String toFullJson() {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
//		json.append("\"title\":\"").append(this.name).append("\"");
		json.append(",\"g1m\":\"").append("g1m").append("\"");
//		json.append(",\"state\":\"closed\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name).append("\"");
		}
		if(this.open) {
			json.append(",\"state\":\"open\"");
		} else {
			if(this.subclasses.size() < 1) {
				json.append(",\"state\":\"open\"");
			} else {
				json.append(",\"state\":\"closed\"");
			}
		}
		for (Entry<String, String> entry: attr.entrySet()) {
		    String key = entry.getKey();
			if( "name".equalsIgnoreCase(key)) {
				continue;
			}
		    String value = entry.getValue();
		    if(value != null && !"".equals(value)) {
		    	json.append(",").append(jsonKeyValue(key, value));
		    }
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
//			json.append(",\"subclasses\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append(sub.toFullJson()).append(",");
			}
			json.deleteCharAt(json.length() - 1);
			json.append("]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	//	对象的完整信息的json字符串，只输出部分列的信息（其子类的信息递归地在出现在json中）
	public String toFullJson(Collection<String> columns) {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		json.append(",\"g1m\":\"").append("g1m").append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name).append("\"");
		}
		if(this.open) {
			json.append(",\"state\":\"open\"");
		} else {
			if(this.subclasses.size() < 1) {
				json.append(",\"state\":\"open\"");
			} else {
				json.append(",\"state\":\"closed\"");
			}
		}
		for(String column : columns) {
			if( "name".equalsIgnoreCase(column)) {
				continue;
			}
			String tmpVal = this.attr.get(column);
			String val = tmpVal != null ? tmpVal : "";
			json.append(",").append(jsonKeyValue(column, val));
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append(sub.toFullJson()).append(",");
			}
			json.deleteCharAt(json.length() - 1);
			json.append("]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	//	对象的自身信息的json字符串，只输出部分列的信息（只包括子类的名称，子类不递归）
	public String toJson() {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		json.append(",\"g1m\":\"").append("g1m").append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name);
		}
		for (Entry<String, String> entry: attr.entrySet()) {
		    String key = entry.getKey();
			if( "name".equalsIgnoreCase(key)) {
				continue;
			}
		    String value = entry.getValue();
		    if(value!=null && !"".equals(value)) {
		    	json.append(",").append(jsonKeyValue(key, value));
		    }
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append("\"").append(sub.name).append("\",");
			}
			json.deleteCharAt(json.length()-1);
			json.append("}]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	//	对象的自身信息的json字符串，只输出部分列的信息（只包括子类的名称，子类不递归）
	public String toJson(String[] useColumns) {
		List<String> cos = new LinkedList<String>();
		for(String col : useColumns) {
			cos.add(col);
		}
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		json.append(",\"g1m\":\"").append("g1m").append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name);
		}
		for (Entry<String, String> entry: attr.entrySet()) {
			String key = entry.getKey();
			if(!cos.contains(key) || "name".equalsIgnoreCase(key)) {
				continue;
			}
			String value = entry.getValue();
			if(value!=null && !"".equals(value)) {
				json.append(",").append(jsonKeyValue(key, value));
			}
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append("\"").append(sub.name).append("\",");
			}
			json.deleteCharAt(json.length()-1);
			json.append("}]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	//	对象数组输出成json数组
	public static String toJson(ObjectJson[] ojs) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for(ObjectJson oj : ojs) {
			String str = oj.toJson();
			sb.append(str).append(",");
		}
		sb.deleteCharAt(sb.length() - 1);
		sb.append("]");
		return sb.toString();
	}

	//	数值型在json中无引号，字符串型在json中有引号
	public String jsonKeyValue(String key, String value) {
		boolean flag = false;
		for(String numkey : numKeys) {
			if(numkey.equals(key)) {
				flag = true;
				break;
			}
		}
		if(flag) {
			if("".equals(value)) {
				value = "0";
			}
			return "\"" + key + "\":" + value;
		} else {
			return "\"" + key + "\":\"" + value +"\"";
		}
	}

	public boolean equals(Object obj) {
		if(obj == this) {
			return true;
		}
		if(!(obj instanceof ObjectJson)) {
			return false;
		}
		ObjectJson jo = (ObjectJson)obj;
		if(!strEquals(name,jo.name)) {
			return false;
		}
		return this.parent == jo.parent;
		
	}

	//	为子对象设置默认的 ChildID
	public void setChildIds() {
		if(subclasses.size() < 1) {
			return;
		}
		boolean hasZero = false;
		for(int i = 0; i < this.subclasses.size(); i++) {
			ObjectJson child = subclasses.get(i);
			if(child.containsAttr("childid")) {
				String cidStr = child.getAttr("childid");
				if("0".equals(cidStr)) {
					hasZero = true;
				}
			} else {
				child.setAttr("childid", i + 1);
			}
			child.setAttr("parentId", this.getAttr("id"));
			if(this.containsAttr("childid")) {
				child.setAttr("pchildid", this.getAttr("childid"));
			}
			if(this.containsAttr("pchildid")) {
				child.setAttr("gpchildid", this.getAttr("pchildid"));
			}
			child.setChildIds();
		}
		if(!hasZero) {
			addZeroChild();
		}
	}

	public void addZeroChild() {
		ObjectJson zeroChild = new ObjectJson();
		zeroChild.setAttr("name", "");
		zeroChild.setName("");
		zeroChild.setParent(this);
		this.subclasses.add(0, zeroChild);
	}

	public boolean needsZeroChild() {
		if(subclasses.size() < 1) {
			return false;
		}
		boolean hasZero = false;
		for(int i = 0; i < this.subclasses.size(); i++) {
			ObjectJson child = subclasses.get(i);
			if (child.containsAttr("childid")) {
				String cidStr = child.getAttr("childid");
				if ("0".equals(cidStr)) {
					hasZero = true;
				}
			}
		}
		return !hasZero;
	}

	//	为某一类Json操作类（地名、行政区域、行政界线或界桩）产生公共列名，通过一系列已知的列名字符串
	public static void consColumnNames(List<String> columns, Map<Integer, String> columnNames) {
		if(columnNames == null || columnNames.size() > 0) {
			return;
		}
		for(int i = 0; i < columns.size(); i++) {
			String column = columns.get(i);
			if(!"".equals(column)) {
				columnNames.put(i, column);
			}
		}
	}

	//	为某一类Json操作类（地名、行政区域、行政界线或界桩）产生公共列名，通过查询操作类相对应的数据表
	public static void consColumnNames(String dbType, String tbName, Map<Integer, String> columnNames) {
		if(columnNames == null || columnNames.size() > 0) {
			return;
		}
		String sql = null;
		ResultSet rs = null;
		if("mysql".equalsIgnoreCase(dbType)) {
			sql = "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name='" + tbName + "'";
			rs = MysqlLocalConnection.executeQuery(sql);
		} else {
			sql = "Select Name FROM SysColumns Where id=Object_Id('" + tbName + "')";
			rs = LocalConnection.executeQuery(sql);
		}
		int i = 0;
		try {
			while (rs.next()) {
				String columnName = rs.getString(1);
				columnNames.put(i, columnName);
				i++;
			}
			rs.close();
		} catch (Exception se) {
			se.printStackTrace();
			System.err.println("产生列名失败！！！");
		}
	}

	//	为某一类Json操作类（地名、行政区域、行政界线或界桩）产生公共列名，通过查询操作类相对应的数据表
	public static ResultSet consColumnNamesBySql(String dbType, String sql, Map<Integer, String> columnNames) {
		ResultSet rs = null;
		if("mysql".equalsIgnoreCase(dbType)) {
			rs = MysqlLocalConnection.executeQuery(sql);
		} else {
			rs = LocalConnection.executeQuery(sql);
		}
		try {
			ResultSetMetaData rsmd = rs.getMetaData();
			int count = rsmd.getColumnCount();
			if(columnNames != null && count == columnNames.size()) {
				return null;
			}
			for (int i = 0; i < count; i++) {
				String columnName = rsmd.getColumnName(i + 1);
				if(columnNames != null && columnNames.containsValue(columnName)) {
					continue;
				} else {
					int num = columnNames.size();
					columnNames.put(num, columnName);
				}
			}
		} catch (SQLException se) {
			se.printStackTrace();
			System.err.println("产生列名失败！！！");
		} finally {
			return rs;
		}
	}

	public static boolean strEquals(String str1, String str2) {
		if(str1 == null) {
			return str2 == null;
		}
		return str1.equals(str2);
	}

	public static ObjectJson findObj(List<ObjectJson> data, String name) {
		for(ObjectJson jo : data) {
			if(name.equals(jo.name)) {
				return jo;
			}
		}
		return null;
	}

	public static ObjectJson findObj(Object[] data, String name) {
		for(Object obj : data) {
			if(obj instanceof ObjectJson) {
				ObjectJson jo = (ObjectJson)obj;
				if(name.equals(jo.name)) {
					return jo;
				}
			}
		}
		return null;
	}

}
