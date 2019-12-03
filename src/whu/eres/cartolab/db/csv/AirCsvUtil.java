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

    public static JSONArray getRealTimeAirQuality(String citeId) {

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
            return ja;
        }
    }

    public static String getRealtimeAir0(String citeId) {
        JSONArray ja = getRealTimeAirQuality(citeId);
        return ja.toString();
    }

    public static int[] createDayTempArray(int temp, int this_hour, int this_max, int this_min) {
        int[] ref_arr = new int[]{-3,-3,-4,-5,-5,-5,-6,-5,-3,-1,-2,0,1,2,3,4,4,3,2,1,0,0,-1,-2};
        double ref_max = 4.0, ref_min = -6.0;
        double max = this_max + 0.1, min = this_min - 0.1;
        if(temp > this_max) {
            if(this_hour != 15 && this_hour != 16) {
                max = this_max + 2.0;
            }
        }
        if(temp < this_min) {
            if(this_hour != 6) {
                min = this_min - 2.0;
            }
        }
        int ref_this = ref_arr[this_hour];
        double ref_this_max = ref_max - ref_this, ref_this_min = ref_this - ref_min;
        double[] ref_to_max = new double[24];
        double[] ref_to_min = new double[24];
        double[] ref_to_this = new double[24];
        for(int i = 0; i < 24; i++) {
            ref_to_max[i] = (ref_max - ref_arr[i]);
            ref_to_min[i] = (ref_arr[i] - ref_min);
            ref_to_this[i] = (ref_arr[i] - ref_this);
        }
        double[] ref_pros = new double[24];
        for(int i = 0; i < 24; i++) {
            double ref_diff = ref_to_this[i];
            if(Math.abs(ref_diff) < 0.0001) {
                ref_pros[i] = 0.0;
            } else if (ref_diff > 0){
                ref_pros[i] = 1.0 - ref_to_max[i] / ref_this_max;
            } else if(ref_diff < 0) {
                ref_pros[i] = ref_to_min[i] / ref_this_min - 1.0;
            }
        }
        double to_max = max - temp, to_min = temp - min;
        double[] farr = new double[24];
        int[] iarr = new int[24];
        for(int i = 0; i < 24; i++) {
            double simu_temp = 0.0, ref_pro = ref_pros[i];
            if(Math.abs(ref_pro) < 0.0001) {
                simu_temp = temp;
            } else if (ref_pro > 0){
                simu_temp = temp + to_max * ref_pro;
            } else if(ref_pro < 0) {
                simu_temp = temp + to_min * ref_pro;
            }
            farr[i] = simu_temp;
            iarr[i] = (int)simu_temp;
        }
        return iarr;
    }


}