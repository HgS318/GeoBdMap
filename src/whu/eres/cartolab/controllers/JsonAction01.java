package whu.eres.cartolab.controllers;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import java.net.*;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.struts2.*;
import net.sf.json.*;

import org.json.simple.*;
import whu.eres.cartolab.db.csv.*;
import whu.eres.cartolab.db.esri.*;
import whu.eres.cartolab.geo.*;
import whu.eres.cartolab.db.mysql.queries.*;

public class JsonAction01 {

    public String getRealtimeTempByCityCode() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String cityCode = request.getParameter("city");
        Date date = new Date();
        int thisHour = date.getHours();
        int month = date.getMonth() + 1;
        int day = date.getDate();
        String[] temps = getTodayTemperature(cityCode, thisHour);
        if(temps == null || temps.length < 1) {
            toBeJson("get temperature error...");
            return null;
        }
        JSONArray ja = new JSONArray();
        for(int i = 0; i < thisHour; i++) {
            String temp = temps[i];
            String _time = month + "月" + day + "日" + i + "时";
            JSONObject tempObj = new JSONObject();
            tempObj.put("time", _time);
            if(temp != null && !"".equals(temp) && !"null".equals(temp)) {
                String _temp = temp + "℃";
                tempObj.put("temp", _temp);
                ja.put(i, tempObj);
            } else {
                tempObj.put("temp", "");
                ja.put(i, tempObj);
            }
        }
        String reStr = ja.toString();
        toBeJson(reStr);
        return null;
    }

    //  获取实时的空气质量数据（暂以2018年代替）
    public String getRealtimeAir0() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String citeId = request.getParameter("citeId");
            String str = AirCsvUtil.getRealtimeAir0(citeId);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  获取实时的空气质量数据（暂以2018年代替）以及气温
    public String getRealtimeAir1() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String citeId = request.getParameter("citeId");
            String cityCode = request.getParameter("city");
            Date date = new Date();
            int thisHour = date.getHours();
            JSONArray ja = AirCsvUtil.getRealTimeAirQuality(citeId);
            String[] temps = getTodayTemperature(cityCode, thisHour);
            for(int i = 0; i < ja.length(); i++) {
                if(i < temps.length) {
                    String temp = temps[i];
                    if(temp != null && !"".equals(temp) && !"null".equals(temp)) {
                        String _temp = temp + "℃";
                        ja.getJSONObject(i).put("temp", _temp);
                    }
                }
            }
            String reStr = ja.toString();
            toBeJson(reStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  位置叠加
    public String posadd() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String spaMethod = request.getParameter("spaMethod");
            String timeMethod = request.getParameter("timeMethod");
            String time1 = request.getParameter("time1");
            String time2 = request.getParameter("time2");
            String ids = request.getParameter("ids");
            String str = GeoInfoQuery.posadd(spaMethod, timeMethod, time1, time2, ids);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  获取所有的简单地点信息
    public String getAllGeoInfo() {
        try {
            String str = GeoInfoQuery.getAllGeoInfo();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  获取所有的简单地点实体（合并的简单地点信息）
    public String getAllGeoEntities() {
        try {
            String str = GeoInfoQuery.getAllGeoEntities();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getPointGeoEntities() {
        try {
            String str = GeoInfoQuery.getPointGeoEntities();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //  获取所有综合信息(旧版syn_data)
    public String getAllSynData() {
        try {
            String str = GeoInfoQuery.getAllSynData();
            JsonAction00.toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String extractContentSimple() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String url = request.getParameter("url");
            String str = BaiduSearchQuery.extractContentSimple(url);
            toBeText(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            toBeText("");
            return ex.getMessage();
        }
        return null;
    }

    public String getFireTraffics() {
        try {
            String str = BaiduSearchQuery.getFireTraffics();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getAllFireLocalSites() {
        try {
            String str = BaiduSearchQuery.getAllFireLocalSites();
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String queryAPI() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String url_origin = request.getParameter("url");
        String url = decodeMyUrl(url_origin);
        String result = queryUrl(url, null, null, null, 0, 0);
        toBeJson(result);
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
                String geocodingReturnStr = queryAPI(geocodingUrl, geoParams, "GET");
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
                String geocodingReturnStr = queryAPI(geocodingUrl, geoParams, "GET");
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

            double[] metrics = lonlat2metrics(ucoords);
//            MaxConvexPolygon mcp = new MaxConvexPolygon(ucoords);
            for(int i = 0; i < ucoords.length; i += 2) {
                System.out.println(ucoords[i] + ", " + ucoords[i + 1]);
            }
            for(int i = 0; i < metrics.length; i += 2) {
                System.out.println(metrics[i] + ", " + metrics[i + 1]);
            }
//            System.out.println(ucoords);
//            double[] polygon = mcp.run();
//            double[] polygon = metrics2lonlat(polygonMerics);
//            double[] polygon = MaxConvexPolygon.myTest();
//            double[] polygon = ConvexPolygon01.test();
//            double[] polygonMerics = ConvexPolygon01.createPolygon(metrics);
//            double[] polygon = metrics2lonlat(polygonMerics);
//            double[] polygon = ConvexPolygon01.createPolygon(ucoords);
//            double[] polygon = ConvexHull.test();
//            double[] polygon = ConvexHull.getConvexPolygon(ucoords);
//            double[] polygonMetrics = ConvexHull.getConvexPolygon(metrics);
            double[] polygonMetrics = GrahamScan.calculate(metrics);
            double[] polygon = metrics2lonlat(polygonMetrics);
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
            reJson.put("data", pageResult);
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
            // http://api.k780.com/?app=life.areacode&areacode=0760&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json
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
            String postResultStr = queryAPI(postcodeApi, postParams, "GET");
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
            String areaReturnStr = queryAPI(areacodeApi, areaParams, "GET");
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
            String geoReturnStr = queryAPI(geocodingApi, geocodingParams, "GET");
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
            String ipReturnStr = queryAPI(ipApi, ipParams, "GET");
//            JSONObject ipReturn = JSONObject.fromString(ipReturnStr);
            JsonAction00.toBeJson(ipReturnStr);

        } catch (Exception e) {
            e.printStackTrace();
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

    //  根据省市地区空间多边形
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
        postParams.put("pagesize", "48");
        postParams.put("page", Integer.toString(page));
        postParams.put("key", "9ab4f8036190fc2d63661391b5e7528e");
        try {
//            String postResultStr = queryUrl(postcodeApi, postParams, "GET", null, 0, 0);
            String postResultStr = queryAPI(postcodeApi, postParams, "GET");
            System.out.println(postResultStr);
            JSONObject postReturn = JSONObject.fromObject(postResultStr);
            JSONObject postResult = postReturn.getJSONObject("result");
            return postResult;
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    public String searchGoogleMapQuery() {
        HttpServletRequest request = ServletActionContext.getRequest();
        // https://api.map.baidu.com/location/ip?ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7&coor=bd09ll&ip=117.154.10.99
        try{
            String word = new String(request.getParameter("word").getBytes("iso-8859-1"));
            String srhApi = "https://www.google.com/search?tbm=map&authuser=0&hl=en&gl=kh&pb=!4m12!1m3!1d171703.1889068656!2d114.13498723504287!3d30.441862537500636!2m3!1f0!2f0!3f0!3m2!1i1366!2i599!4f13.1!7i20!10b1!12m6!2m3!5m1!6e2!20e3!10b1!16b1!19m4!2m3!1i360!2i120!4i8!20m57!2m2!1i203!2i100!3m2!2i4!5b1!6m6!1m2!1i86!2i86!1m2!1i408!2i240!7m42!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e3!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e3!2b1!3e2!1m3!1e9!2b1!3e2!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!2b1!4b1!9b0!22m6!1seuHEXcS5DdD7wAOEv4fQBA%3A1!2zMWk6Mix0OjExODg3LGU6MSxwOmV1SEVYY1M1RGREN3dBT0V2NGZRQkE6MQ!7e81!12e3!17seuHEXcS5DdD7wAOEv4fQBA%3A685!18e15!24m40!1m12!13m6!2b1!3b1!4b1!6i1!8b1!9b1!18m4!3b1!4b1!5b1!6b1!2b1!5m5!2b1!3b1!5b1!6b1!7b1!10m1!8e3!14m1!3b1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!30m1!2b1!36b1!43b1!52b1!55b1!56m2!1b1!3b1!26m4!2m3!1i80!2i92!4i8!30m28!1m6!1m2!1i0!2i0!2m2!1i458!2i599!1m6!1m2!1i1316!2i0!2m2!1i1366!2i599!1m6!1m2!1i0!2i0!2m2!1i1366!2i20!1m6!1m2!1i0!2i579!2m2!1i1366!2i599!34m8!3b1!4b1!6b1!8m1!1b1!9b1!12b1!14b1!37m1!1e81!42b1!47m0!49m1!3b1!50m3!2e2!3m1!1b1&oq=eberswalde%20schule&gs_l=maps.12..38i39i129k1l2j38l3.378367.378367.4.383556.3.2.0.1.0.0.117.228.0j2.2.0....0...1ac.1.64.maps..0.1.111....0.&tch=1&ech=21&psi=euHEXcS5DdD7wAOEv4fQBA.1573183871126.1&q="
                    + word;
            //key-value
            Map<String, String> ipParams = new HashMap<>();
            String ipReturnStr = queryAPI(srhApi, ipParams, "GET");
//            JSONObject ipReturn = JSONObject.fromString(ipReturnStr);
            JsonAction00.toBeText(ipReturnStr);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

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
            String returnStr = queryAPI(api, params, "GET");
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

    public String[] getTodayTemperature(String cityCode, int thisHour) {
        try {
            String site_url = "http://www.weather.com.cn/weather1d/" + cityCode + ".shtml";
            String siteContent = queryAPI(site_url, null, "GET");
            String flag = "observe24h_data";
            int dataIndex = siteContent.indexOf(flag);
            if(dataIndex > -1) {
                int endId = siteContent.indexOf("</script>", dataIndex);
                if(endId > dataIndex) {
                    String contentCut = siteContent.substring(dataIndex, endId - 1);
                    String dataStr = contentCut.replace(flag, "").replace("=", "").replace(";", "").trim();
                    JSONObject jo = JSONObject.fromString(dataStr);
                    JSONObject od = (JSONObject)jo.get("od");
                    JSONArray od2 = (JSONArray)od.get("od2");
                    String[] temps = new String[thisHour + 1];
                    for(int i = 0; i < od2.length(); i++) {
                        JSONObject obj = (JSONObject)od2.get(i);
                        String hourStr = obj.get("od21").toString();
                        int hour = Integer.parseInt(hourStr);
                        if(hour > thisHour) {
                            break;
                        }
                        String temp = obj.get("od22").toString();
                        temps[hour] = temp;
                    }
                    return temps;

                } else {
                    throw new Exception();
                }
            } else {
                throw new Exception();
            }
        } catch (Exception ex1) {
            try {
                String nowapi_url = "http://api.k780.com/?app=weather.today&appkey=40713&sign=b3afd3d892135334df45dd0db8655e3a&format=json&weaid=" + cityCode;
                String resStr = queryAPI(nowapi_url, null, "GET");
                JSONObject jo = JSONObject.fromString(resStr);
                JSONObject dataObj = (JSONObject)jo.get("result");
                String temperature_curr = dataObj.getString("temperature_curr");
                String temp_cur_str = temperature_curr.replace("℃", "").trim();
                String temp_high = dataObj.getString("temp_high");
                String temp_low = dataObj.getString("temp_low");
                int temp_cur = Integer.parseInt(temp_cur_str);
                int max_temp = Integer.parseInt(temp_high);
                int min_temp = Integer.parseInt(temp_low);
                int[] tempArr = AirCsvUtil.createDayTempArray(temp_cur, thisHour, max_temp, min_temp);
                String[] temps = new String[thisHour + 1];
                for(int i = 0; i < thisHour + 1; i++) {
                    temps[i] = String.valueOf(tempArr[i]);
                }
                return temps;
            } catch (Exception ex2) {
                ex2.printStackTrace();
                return null;
            }
        }
    }

    public static String queryAPI(String requestUrl, Map params, String reqMethod) {
        //buffer用于接受返回的字符
        StringBuffer buffer = new StringBuffer();
        try {
            //建立URL，把请求地址给补全，其中urlencode（）方法用于把params里的参数给取出来
            URL url = new URL(requestUrl);
            if(params != null) {
                url = new URL(requestUrl + "?" + urlencode(params));
            }
            //打开http连接
            HttpURLConnection httpUrlConn = (HttpURLConnection) url.openConnection();
            httpUrlConn.setDoInput(true);
            if(reqMethod == null || "GET".equalsIgnoreCase(reqMethod)) {
                httpUrlConn.setRequestMethod("GET");
            } else {
                httpUrlConn.setRequestMethod("POST");
            }
            httpUrlConn.connect();

            //获得输入
            InputStream inputStream = httpUrlConn.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            //将bufferReader的值给放到buffer里
            String str = null;
            while ((str = bufferedReader.readLine()) != null) {
                buffer.append(str);
            }
            //关闭bufferReader和输入流
            bufferedReader.close();
            inputStreamReader.close();
            inputStream.close();
            //断开连接
            httpUrlConn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
        //返回字符串
        return buffer.toString();
    }

    public static String urlencode(Map<String,Object>data) {
        //将map里的参数变成像 showapi_appid=###&showapi_sign=###&的样子
        StringBuilder sb = new StringBuilder();
        for (Map.Entry i : data.entrySet()) {
            try {
                sb.append(i.getKey()).append("=").append(URLEncoder.encode(i.getValue()+"","UTF-8")).append("&");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    public static String queryUrl(String sendUrl, Map<String, String> params,
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
            String paramsStr = paramSb.toString();
            if("".equals(paramsStr) || paramsStr.length() < 1) {
                url = new URL(sendUrl);
            } else {
                url = new URL(sendUrl + "?" + paramsStr);
            }
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

    public static String decodeMyUrl(String myUrl) {
        return myUrl.replace("|", "&").replace("-", "?");
    }

    public static String encodeMyUrl(String myUrl) {
        return myUrl.replace("&", "|").replace("?", "-");
    }

    private static String BD_AK = "SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7";

}
