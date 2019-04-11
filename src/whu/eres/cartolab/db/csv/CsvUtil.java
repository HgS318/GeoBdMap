package whu.eres.cartolab.db.csv;

import java.util.*;
import java.io.*;
import net.sf.json.*;

public class CsvUtil {
    private String fileName = null;
    private BufferedReader br = null;
    private List<String> list = new ArrayList<String>();

    public static void main(String[] args) {

        JSONArray jsonArray = readcsv("D:\\MyData\\Webs\\IDEA\\GeoBdMap\\web\\data\\air\\collocation_overlay\\beijing_20180101_00.csv");
        System.out.println(jsonArray.toString());
    }

    public CsvUtil() {
    }

    public CsvUtil(String fileName) throws Exception {
        this.fileName = fileName;
        br = new BufferedReader(new FileReader(fileName));
        String stemp;
        while ((stemp = br.readLine()) != null) {
            list.add(stemp);
        }
    }

    public List getList() {
        return list;
    }

    /**
     * 获取行数
     *
     * @return
     */
    public int getRowNum() {
        return list.size();
    }

    /**
     * 获取列数
     *
     * @return
     */
    public int getColNum() {
        if (!list.toString().equals("[]")) {
            if (list.get(0).toString().contains(",")) {// csv为逗号分隔文件
                return list.get(0).toString().split(",").length;
            } else if (list.get(0).toString().trim().length() != 0) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    /**
     * 获取制定行
     *
     * @param index
     * @return
     */
    public String getRow(int index) {
        if (this.list.size() != 0) {
            return (String) list.get(index);
        } else {
            return null;
        }
    }

    /**
     * 获取指定列
     *
     * @param index
     * @return
     */
    public String getCol(int index) {
        if (this.getColNum() == 0) {
            return null;
        }
        StringBuffer sb = new StringBuffer();
        String tmp = null;
        int colnum = this.getColNum();
        if (colnum > 1) {
            for (Iterator it = list.iterator(); it.hasNext(); ) {
                tmp = it.next().toString();
                sb = sb.append(tmp.split(",")[index] + ",");
            }
        } else {
            for (Iterator it = list.iterator(); it.hasNext(); ) {
                tmp = it.next().toString();
                sb = sb.append(tmp + ",");
            }
        }
        String str = new String(sb.toString());
        str = str.substring(0, str.length() - 1);
        return str;
    }

    /**
     * 获取某个单元格
     *
     * @param row
     * @param col
     * @return
     */
    public String getString(int row, int col) {
        String temp = null;
        int colnum = this.getColNum();
        if (colnum > 1) {
            temp = list.get(row).toString().split(",")[col];
        } else if (colnum == 1) {
            temp = list.get(row).toString();
        } else {
            temp = null;
        }
        return temp;
    }

    public void CsvClose() throws Exception {
        this.br.close();
    }

    /**
     * 去表头
     **/
    public String removehead(String str) {
        String[] str_1 = str.split(",");
        String sb = new String();
        for (int i = 1; i < str_1.length; i++) {
            sb = sb + str_1[i] + ",";
        }
        return sb;
    }


    public static JSONArray readcsv(String path) {
        JSONArray array = new JSONArray();
        CsvUtil util;
        try {
            util = new CsvUtil(path);
            int row = util.getRowNum();
            int col = util.getColNum();
            for (int i = 0; i < col; i++) {
                JSONObject jsonobject = new JSONObject();
                String value = util.getCol(i);
                jsonobject.put(util.getString(0, i), util.removehead(value));
                array.put(i, jsonobject);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return array;
    }
}