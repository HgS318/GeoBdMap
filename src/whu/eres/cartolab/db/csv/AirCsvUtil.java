package whu.eres.cartolab.db.csv;

import com.csvreader.CsvReader;
import net.sf.json.*;
//import org.json.simple.*;
import whu.eres.cartolab.db.mysql.connections.*;
import java.nio.charset.*;

import java.text.SimpleDateFormat;
import java.util.*;

public class AirCsvUtil {

    public static String relativePath = "data/air/cites_20180101-20181231/";
    public static String[] targets = new String[] {"AQI", "PM2.5", "PM10", "SO2", "NO2", "O3", "CO"};

    public static void main(String[] args) {
        String testDataStr = getRealtimeAir0("1010A");
        System.out.print(testDataStr);
    }

    public static boolean isTargetLine(String type) {
        boolean flag = false;
        for(String target : targets) {
//            if(target.indexOf(type) > -1 || type.indexOf(target) > -1) {
            if(target.indexOf(type) > -1) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    public static String getValue(CsvReader csvReader, String columnName, int defaultColumnIndex) {
        String val = null;
        String readVal = null;
        try {
            readVal = csvReader.get(columnName);
            val = readVal.trim();
            if(val.length() < 1) {
                readVal = csvReader.get(defaultColumnIndex);
                val = readVal.trim();
            }
        } catch (Exception exp1){
            try {
                readVal = csvReader.get(defaultColumnIndex);
                val = readVal.trim();
            } catch (Exception exp2) {

            }
        } finally {
            if(val.length() < 1) {
                return null;
            }
            return val;
        }
    }

    public static String getRealtimeAir0(String citeId) {
        MysqlLocalConnection.getInstance();
        Date date = new Date();
        int month = date.getMonth() + 1;
        int day = date.getDate();
        int thisHour = date.getHours();
        String strDateFormat = "MMdd";
        SimpleDateFormat sdf1 = new SimpleDateFormat("MMdd");
//        SimpleDateFormat sdf2 = new SimpleDateFormat("MM月dd日HH时");
        String formatedDate = sdf1.format(date);
//        String fileName = "china_sites_2018" + Integer.toString(month) + Integer.toString(day) + ".csv";
        String fileName = "china_sites_2018" + formatedDate + ".csv";
        String path = MysqlLocalConnection.websitePath +  relativePath + fileName;
        String[] targets = new String[] {"AQI", "PM2.5", "PM10", "SO2", "NO2", "O3", "CO"};
        Map<String, Map> dealedData = new HashMap<>();
        try {
            CsvReader csvReader = new CsvReader(path, ',', Charset.forName("UTF-8"));
            csvReader.readHeaders(); // 跳过表头   如果需要表头的话，不要写这句。
            String[] headers = csvReader.getHeaders(); //获取表头
            int numColumns = headers.length;
            int citeColumn = -1;
            for(int j = 0; j < numColumns; j++) {
                if(headers[j].indexOf(citeId) > -1 || citeId.indexOf(headers[j]) > -1) {
                    citeColumn = j;
                    break;
                }
            }
            if(citeColumn >= numColumns) {
                return null;
            }
            int i = 0;
            while (csvReader.readRecord()) {
//                for (int i = 0; i < headers.length; i++) {
//                    System.out.println(headers[i] + ":" + csvReader.get(headers[i]));
//                }
                String type = getValue(csvReader, "type", 2);
                if(isTargetLine(type)) {
//                    String dateStr = getValue(csvReader, "date", 0);
                    String hourStr = getValue(csvReader, "hour", 1);
                    try {
                        int dataHour = Integer.parseInt(hourStr);
                        if(dataHour >= thisHour) {
                            continue;
                        }
                    } catch (Exception hourExp) {
                        continue;
                    }
                    if(hourStr.length() < 2) {
                        hourStr = "0" + hourStr;
                    }
                    String targetVal = csvReader.get(citeColumn);
                    String timeStr = Integer.toString(month) + "月" + Integer.toString(day) + "日" + hourStr + "时";
                    if(dealedData.containsKey(timeStr)) {
                        dealedData.get(timeStr).put(type, targetVal);
                    } else {
                        HashMap<String, String> newMap = new HashMap<>();
                        newMap.put(type, targetVal);
                        dealedData.put(timeStr, newMap);
                    }
                }
                i++;
            }
            csvReader.close();
        } catch (Exception exp) {
            exp.printStackTrace();
        } finally {
            JSONArray ja = new JSONArray();
            int i = 0;
            Set keySet = dealedData.keySet();
            List<String> list = new ArrayList<String>(keySet);
            Collections.sort(list);
            for(String _key : list) {
                Map<String, String> map = dealedData.get(_key);
                JSONObject jo = new JSONObject();
                jo.put("time", _key);
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    jo.put(entry.getKey(), entry.getValue());
                }
                ja.put(i, jo);
                i++;
            }
            return ja.toString();
        }
    }


}