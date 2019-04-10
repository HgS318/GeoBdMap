package whu.eres.cartolab.controllers;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.apache.struts2.ServletActionContext;
import whu.eres.cartolab.db.esri.ShapeFile;
import whu.eres.cartolab.geo.MaxConvexPolygon;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;
import java.text.SimpleDateFormat;

public class JsonAction02 {

    public static void sortTracks() {
        List<SimpleTrack> tracks = new ArrayList<>();
        Collections.sort(tracks, new Comparator<SimpleTrack>() {
            public int compare(SimpleTrack o1, SimpleTrack o2) {
                long sn_diff =  o1.time - o2.time;
                if(sn_diff < 0) {
                    return -1;
                }
                if(sn_diff > 0) {
                    return 1;
                }
                return o1.userid.compareTo(o2.userid);
            }
        });
    }

    public String outputCoordsJson02() {
        int len = 30000;
        int i = 0;
        String csvFile ="E:/Data/11.csv";
        StringBuffer jsonStr = new StringBuffer();
        jsonStr.append("[");
        StringBuilder result = new StringBuilder();
        try{

            BufferedReader br = new BufferedReader(new FileReader(csvFile));//构造一个BufferedReader类来读取文件

            String s = null;
            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
                if (i > len) {
                    break;
                }
                i++;
                String[] infoStr = s.split(",");
                try {
                    double x = Double.parseDouble(infoStr[1]);
                    double y = Double.parseDouble(infoStr[2]);
                    String ID=infoStr[4];
                    String timestr=infoStr[5];
                    Long time = Long.parseLong(timestr)*1000;
                    Date d = new Date(time);
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String Time=sdf.format(d);

                    String infoJson = "{\"lng\": " + x + ", \"lat\": " + y +", \"id\": " +"\""+ ID+"\""+", \"time\": " +"\""+ Time+"\""+"}," ;
                    jsonStr.append(infoJson);
                    //{"lng": "120.85631249942352", "lat": "30.662593566467432"}
                } catch (Exception e2) {

                }
            }
            br.close();
            jsonStr.deleteCharAt(jsonStr.length() - 1);
            jsonStr.append("]");
            toBeJson(jsonStr.toString());

        } catch(Exception e){
            e.printStackTrace();
        }

        return null;
    }
    public String getAllGeoEntities() {
        try {
            String str = test.test.getAllGeoEntities();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  获取邮编的坐标
    public String getCoordsByPostcode() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            // http://v.juhe.cn/postcode/query?postcode=430079&key=9ab4f8036190fc2d63661391b5e7528e
            String codeStr = request.getParameter("postcode");
            String all = request.getParameter("all");
            int page = 1;
            JSONObject pageResult = searchPostcode(codeStr, page);
            if(!pageResult.has("totalpage")) {
                return null;
            }
            JSONArray postResultList = pageResult.getJSONArray("list");
            if("1".equals(all)) {
                int totalpage = pageResult.getInt("totalpage");
                while (page < totalpage) {
                    page++;
                    pageResult = searchPostcode(codeStr, page);
                    if (!pageResult.has("totalpage")) {
                        continue;
                    }
                    JSONArray pageResultList = pageResult.getJSONArray("list");
                    postResultList = joinJSONArray(postResultList, pageResultList);
                    totalpage = pageResult.getInt("totalpage");
                }
            }
            // http://api.map.baidu.com/geocoder/v2/?address=雄楚大道省检察院宿舍&output=json&ak=6wpuO5hwG9I1n2VRKzGeN1GLiUGRenf9
            String geocodingUrl = "http://api.map.baidu.com/geocoder/v2/";
            JSONArray coordArray = new JSONArray();
            int k = 0;
            for (int i = 0; i < postResultList.length(); i++) {
                Map<String, String> geoParams = new HashMap<>();
                JSONObject place = postResultList.getJSONObject(i);
                String prov = place.getString("Province");
                String city = place.getString("City");
                String dist = place.getString("District");
                String address = place.getString("Address");
                String addr = prov + city + dist + address;
                geoParams.put("address", addr);
                geoParams.put("output", "json");
                geoParams.put("ak", "SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7");
                String geocodingReturnStr = GetPostUrl(geocodingUrl, geoParams, "GET", null, 0, 0);
                JSONObject geocodingReturn = JSONObject.fromObject(geocodingReturnStr);
                if (geocodingReturn.has("result")) {
                    coordArray.put(k, geocodingReturn.getJSONObject("result"));
                    k++;
                }
            }
            JsonAction00.toBeJson(coordArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //  获取邮编的范围多边形
    public String getPolygonByPostcode() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            // http://v.juhe.cn/postcode/query?postcode=430079&key=9ab4f8036190fc2d63661391b5e7528e
            String codeStr = request.getParameter("postcode");
            String all = request.getParameter("all");
            int page = 1;
            JSONObject pageResult = searchPostcode(codeStr, page);
            if(!pageResult.has("totalpage")) {
                return null;
            }
            JSONArray postResultList = pageResult.getJSONArray("list");
            if("1".equals(all)) {
                int totalpage = pageResult.getInt("totalpage");
                while (page < totalpage) {
                    page++;
                    pageResult = searchPostcode(codeStr, page);
                    if (!pageResult.has("totalpage")) {
                        continue;
                    }
                    JSONArray pageResultList = pageResult.getJSONArray("list");
                    postResultList = joinJSONArray(postResultList, pageResultList);
                    totalpage = pageResult.getInt("totalpage");
                }
            }
            // http://api.map.baidu.com/geocoder/v2/?address=雄楚大道省检察院宿舍&output=json&ak=6wpuO5hwG9I1n2VRKzGeN1GLiUGRenf9
            String geocodingUrl = "http://api.map.baidu.com/geocoder/v2/";
            JSONArray coordArray = new JSONArray();
            int k = 0;
            for (int i = 0; i < postResultList.length(); i++) {
                Map<String, String> geoParams = new HashMap<>();
                JSONObject place = postResultList.getJSONObject(i);
                String prov = place.getString("Province");
                String city = place.getString("City");
                String dist = place.getString("District");
                String address = place.getString("Address");
                String addr = prov + city + dist + address;
                geoParams.put("address", addr);
                geoParams.put("output", "json");
                geoParams.put("ak", "SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7");
                String geocodingReturnStr = GetPostUrl(geocodingUrl, geoParams, "GET", null, 0, 0);
                JSONObject geocodingReturn = JSONObject.fromObject(geocodingReturnStr);
                if (geocodingReturn.has("result")) {
                    coordArray.put(k, geocodingReturn.getJSONObject("result"));
                    k++;
                }
            }
            int count = coordArray.length(), dcount = count * 2;
            List<Double> coords = new ArrayList<>();
            List<Double> lngs = new ArrayList<>();
            List<Double> lats = new ArrayList<>();
            for(int i = 0; i < count; i++) {
                JSONObject locObj = coordArray.getJSONObject(i).getJSONObject("location");
                double lng = locObj.getDouble("lng");
                double lat = locObj.getDouble("lat");
                if(lngs.contains(lng) && lats.contains(lat)) {
                    continue;
                }
                coords.add(lng);
                coords.add(lat);
                lngs.add(lng);
                lats.add(lat);
            }
            int len = coords.size();
            double[] ucoords = new double[len];
            for(int i = 0; i < coords.size(); i++) {
                ucoords[i] = coords.get(i);
            }

//            double[] metrics = lonlat2metrics(coords);
            MaxConvexPolygon mcp = new MaxConvexPolygon(ucoords);
            double[] polygon = mcp.run();
//            double[] polygon = metrics2lonlat(polygonMerics);
//            double[] polygon = MaxConvexPolygon.myTest();
//            double[] polygon = ConvexPolygon01.test();
//            double[] polygonMerics = ConvexPolygon01.createPolygon(metrics);
//            double[] polygon = metrics2lonlat(polygonMerics);
//            double[] polygon = ConvexPolygon01.createPolygon(ucoords);
//            double[] polygon = ConvexHull.test();
//            double[] polygon = ConvexHull.getConvexPolygon(ucoords);
            int dpSize = polygon.length;
            StringBuffer buf = new StringBuffer();
            buf.append("[");
            for(int i = 0; i < dpSize; i += 2) {
                buf.append(" [").append(polygon[i]).append(", ").append(polygon[i + 1]).append("],");
            }
            buf.deleteCharAt(buf.length() - 1);
            buf.append("]");
            JSONObject reJson = new JSONObject();
//            reJson.put("points", "");
            reJson.put("points", coordArray);
            reJson.put("polygon", buf.toString());
            JsonAction00.toBeJson(reJson.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //  获取邮编的地区
    public String getDistrictsByPostcode() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            // http://v.juhe.cn/postcode/query?postcode=430079&key=9ab4f8036190fc2d63661391b5e7528e
            String codeStr = request.getParameter("postcode");
            int code = Integer.parseInt(codeStr);
            int codeThousand = code / 1000;
            String codeThouStr = Integer.toString(codeThousand * 1000);
            String postcodeApi = "http://api.k780.com/";
            Map<String, String> postParams = new HashMap<>();
            postParams.put("postcode", codeThouStr);
            postParams.put("app", "life.postcode");
            postParams.put("appkey", "40713");
            postParams.put("sign", "b3afd3d892135334df45dd0db8655e3a");
            postParams.put("format", "json");
            String postResultStr = GetPostUrl(postcodeApi, postParams, "GET", null, 0, 0);
            System.out.println(postResultStr);
            JSONObject postReturn = JSONObject.fromObject(postResultStr);
            if(postReturn.has("result")) {
                JSONObject postResult = postReturn.getJSONObject("result");
                JSONArray postResultList = postResult.getJSONArray("lists");
                JsonAction00.toBeJson(postResultList.toString());
            }
//            List<SimpleDistrict> dists = new ArrayList<>();
//            for(int i = 0; i < postResultList.length(); i++) {
//                JSONObject place = postResultList.getJSONObject(i);
//                SimpleDistrict sd = new SimpleDistrict(place);
//                SimpleDistrict.addDistrict(sd, dists);
//            }
//            JSONArray distArr = new JSONArray();
//            int i = 0;
//            for(SimpleDistrict sd : dists) {
//                distArr.put(i, sd.toJSONObject());
//                i++;
//            }
//            JsonAction00.toBeJson(distArr.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //  获取区号的坐标
    public String getCoordsByAreacode() {
        HttpServletRequest request = ServletActionContext.getRequest();
        // http://api.k780.com/?app=life.areacode&areacode=0760&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json
        try{
            String areacode = new String(request.getParameter("areacode").getBytes("iso-8859-1"));
            String areacodeApi = "http://api.k780.com/";
            //key-value
            Map<String, String> areaParams = new HashMap<String, String>();
            areaParams.put("app", "life.areacode");
            areaParams.put("areacode",areacode);
            areaParams.put("appkey", "40713");
            areaParams.put("sign", "b3afd3d892135334df45dd0db8655e3a");
            areaParams.put("format", "json");
            String areaReturnStr = GetPostUrl(areacodeApi, areaParams, "GET",null, 0, 0);
            JSONObject areaReturn = JSONObject.fromString(areaReturnStr);
            JSONObject areaResult = areaReturn.getJSONObject("result");
            JSONArray areaResultList = areaResult.getJSONArray("lists");
            JSONObject areaResult0 = areaResultList.getJSONObject(0);
            String cityName = areaResult0.getString("simcall");

            // http://api.map.baidu.com/geocoder/v2/?address=中国,安徽,马鞍山&output=json&ak=6wpuO5hwG9I1n2VRKzGeN1GLiUGRenf9
            String geocodingApi = "http://api.map.baidu.com/geocoder/v2/";
            Map<String, String> geocodingParams = new HashMap<>();
            //将区号获得的地址传入address
            geocodingParams.put("address", cityName);
            geocodingParams.put("output", "json");
            geocodingParams.put("ak", "6wpuO5hwG9I1n2VRKzGeN1GLiUGRenf9");
            String geoReturnStr = GetPostUrl(geocodingApi, geocodingParams, "GET", null, 0, 0);
            JSONObject geoReturn = JSONObject.fromString(geoReturnStr);
            JSONObject geoResult = geoReturn.getJSONObject("result");
            JSONObject resultJson = combineJson(geoResult, areaResult0);
            JsonAction00.toBeJson(resultJson.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //  获取IP的坐标
    public String getCoordsByIP() {
        HttpServletRequest request = ServletActionContext.getRequest();
        // https://api.map.baidu.com/location/ip?ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7&coor=bd09ll&ip=117.154.10.99
        try{
            String ip = new String(request.getParameter("ip").getBytes("iso-8859-1"));
            String ipApi = "https://api.map.baidu.com/location/ip";
            //key-value
            Map<String, String> ipParams = new HashMap<>();
            ipParams.put("ak", BD_AK);
            ipParams.put("ip", ip);
            ipParams.put("coor", "bd09ll");
            String ipReturnStr = GetPostUrl(ipApi, ipParams, "GET", null, 0, 0);
//            JSONObject ipReturn = JSONObject.fromString(ipReturnStr);
            JsonAction00.toBeJson(ipReturnStr);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //  获取所有综合信息
    public String getAllSynData() {
        try {
            String str = test.test.getAllSynData();
            JsonAction00.toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  测试读取shp输出上海市
    public String testShpService() {
        try {
            String city_name = "上海市";
            String outStr = ShapeFile.getCityShapeByName(city_name);
            JsonAction00.toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  测试读取shp输出上海市
    public String getShape() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String outStr = "";
        try {
            String province = request.getParameter("province");
            String city = request.getParameter("city");
            String district = request.getParameter("district");
            if(district == null || "".equals(district)) {
                if(city == null || "".equals(city)) {
                    outStr = ShapeFile.getCityShapeByName(province);
                } else {
                    outStr = ShapeFile.getCityShapeByName(city);
                }
            } else {
                outStr = ShapeFile.getDistrictShapeByName(district);
            }
            JsonAction00.toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  根据页数调用APU获得邮编的坐标
    public JSONObject searchPostcode(String postcode, int page) {
        // http://v.juhe.cn/postcode/query?postcode=430079&key=9ab4f8036190fc2d63661391b5e7528e&pagesize=50&page=2
        String postcodeApi = "http://v.juhe.cn/postcode/query";
        Map<String, String> postParams = new HashMap<>();
        postParams.put("postcode", postcode);
        postParams.put("pagesize", "15");
        postParams.put("page", Integer.toString(page));
        postParams.put("key", "9ab4f8036190fc2d63661391b5e7528e");
        try {
            String postResultStr = GetPostUrl(postcodeApi, postParams, "GET", null, 0, 0);
            System.out.println(postResultStr);
            JSONObject postReturn = JSONObject.fromObject(postResultStr);
            JSONObject postResult = postReturn.getJSONObject("result");
            return postResult;
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    public double[] lonlat2metrics(double[] lonlats) {
        return lonlatWithMetrics(lonlats, 1, 6);
    }

    public double[] metrics2lonlat(double[] metrics) {
        return lonlatWithMetrics(metrics, 6, 5);
    }

    public double[] lonlatWithMetrics(double[] coords, int from, int to) {
        // http://api.map.baidu.com/geoconv/v1/?coords=114.21892734521,29.575429778924&from=1&to=6&ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7
        try{
            String api = "http://api.map.baidu.com/geoconv/v1/";
            StringBuffer buf = new StringBuffer();
            for(int i = 0; i < coords.length; i += 2) {
                buf.append(coords[i]).append(",").append(coords[i + 1]).append(";");
            }
            buf.deleteCharAt(buf.length() - 1);
            Map<String, String> params = new HashMap<>();
            params.put("ak", BD_AK);
            params.put("coords", buf.toString());
            params.put("from", Integer.toString(from));
            params.put("to", Integer.toString(to));
            String returnStr = GetPostUrl(api, params, "GET", null, 0, 0);
            JSONObject resultJson = JSONObject.fromString(returnStr);
            if(resultJson.has("result")) {
                JSONArray jsonArray = resultJson.getJSONArray("result");
                int len = jsonArray.length();
                double[] coordinates = new double[len * 2];
                for(int i = 0; i < len; i++) {
                    JSONObject jo = jsonArray.getJSONObject(i);
                    coordinates[2 * i] = jo.getDouble("x");
                    coordinates[2 * i + 1] = jo.getDouble("y");
                }
                return coordinates;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String GetPostUrl(String sendUrl, Map<String, String> params,
            String sendType, String charset, int repeat_request_count, int repeat_request_max_count) {
        URL url = null;
        HttpURLConnection httpurlconnection = null;
        try {
            StringBuilder paramSb = new StringBuilder();
            if (params != null) {
                for (Map.Entry<String, String> e : params.entrySet()) {
                    paramSb.append(e.getKey());
                    paramSb.append("=");
                    paramSb.append(URLEncoder.encode(e.getValue(), "UTF-8"));
                    paramSb.append("&");
                }
                paramSb.substring(0, paramSb.length() - 1);
            }
            url = new URL(sendUrl + "?" + paramSb.toString());
            httpurlconnection = (HttpURLConnection) url.openConnection();
            httpurlconnection.setRequestMethod("GET");
            httpurlconnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            httpurlconnection.setDoInput(true);
            httpurlconnection.setDoOutput(true);

            httpurlconnection.setConnectTimeout(30000);
            httpurlconnection.setReadTimeout(30000);
            httpurlconnection.setUseCaches(true);

            int code = httpurlconnection.getResponseCode();
            if (code == 200) {
                DataInputStream in = new DataInputStream(httpurlconnection.getInputStream());
                int len = in.available();
//                int len = 5000;
                byte[] by = new byte[len];
                in.readFully(by);
                String rev = new String(by, "UTF-8");
                in.close();
                return rev;
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (httpurlconnection != null) {
                httpurlconnection.disconnect();
            }
        }
        return null;

    }

    /**
     * 将srcJObjStr和addJObjStr合并，如果有重复字段，以addJObjStr为准
     * @param srcJObjStr 原jsonObject字符串
     * @param addJObjStr 需要加入的jsonObject字符串
     * @return srcJObjStr
     */
    public static String combineJson(String srcJObjStr, String addJObjStr) throws JSONException {
        if(addJObjStr == null || addJObjStr.isEmpty()) {
            return srcJObjStr;
        }
        if(srcJObjStr == null || srcJObjStr.isEmpty()) {
            return addJObjStr;
        }

        JSONObject srcJObj = new JSONObject(srcJObjStr);
        JSONObject addJObj = new JSONObject(addJObjStr);

        combineJson(srcJObj, addJObj);

        return srcJObj.toString();
    }

    @SuppressWarnings("unchecked")
    public static JSONObject combineJson(JSONObject srcObj, JSONObject addObj) throws JSONException {
        Iterator<String> itKeys1 = addObj.keys();
        String key, value;
        while(itKeys1.hasNext()){
            key = itKeys1.next();
            value = addObj.optString(key);
            srcObj.put(key, value);
        }
        return srcObj;
    }

    //合并两个JSONArray
    public static JSONArray joinJSONArray(JSONArray mData, JSONArray array) {
        StringBuffer buffer = new StringBuffer();
        try {
            int len = mData.length();
            for (int i = 0; i < len; i++) {
                JSONObject obj1 = (JSONObject) mData.get(i);
                if (i == len - 1)
                    buffer.append(obj1.toString());
                else
                    buffer.append(obj1.toString()).append(",");
            }
            len = array.length();
            if (len > 0)
                buffer.append(",");
            for (int i = 0; i < len; i++) {
                JSONObject obj1 = (JSONObject) array.get(i);
                if (i == len - 1)
                    buffer.append(obj1.toString());
                else
                    buffer.append(obj1.toString()).append(",");
            }
            buffer.insert(0, "[").append("]");
            return new JSONArray(buffer.toString());
        } catch (Exception e) {
        }
        return null;
    }

    public static void toBeJson(String jsonStr){
        HttpServletResponse response = ServletActionContext.getResponse();
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("text/javascript");
        response.setCharacterEncoding("utf-8");
        try {
            PrintWriter out=response.getWriter();
            out.write(jsonStr);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void toBeText(String str){
        HttpServletResponse response = ServletActionContext.getResponse();
        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
        try {
            PrintWriter out=response.getWriter();
            out.write(str);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String BD_AK = "SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7";

}
class SimpleTrack {
    public long time;

    public String userid;
    public double x, y;
}