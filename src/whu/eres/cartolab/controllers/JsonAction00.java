package whu.eres.cartolab.controllers;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import java.net.*;
import org.apache.struts2.ServletActionContext;
import net.sf.json.*;

import whu.eres.cartolab.db.esri.ShapeFile;
import whu.eres.cartolab.db.mysql.queries.*;

public class JsonAction00 {

    public String tempHighSearch() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String geonameword = request.getParameter("geonameword");
//        String str = PlaceQuery.getGeonameInfoByNickname(geonameword, false);
//        toBeJson("[" + str + "]");
        String str = PlaceQuery.getGeonameFullByAttr("name",geonameword , false);
        toBeJson(str);
        return "";
    }

    public String randomResults() {
        String placeRandomResults = PlaceQuery.getRandomResults(false);
        String distRandomResults = DistQuery.getRandomResults(false);
        String boundRandomResults = BoundQuery.getRandomResults(false);
        String bmRandomResults = BoundMarkerQuery.getRandomResults(false);
        String whole = "{" +
                "geonames: " + placeRandomResults + ", " +
                "dists: " + distRandomResults + ", " +
                "bounds: " + boundRandomResults + ", " +
                "boundmarkers: " + bmRandomResults +
                "}";
        toBeJson(whole);
        return null;
    }

    public String searchPrepare() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String info = request.getParameter("searchinfo");
            if(info == null || "".equals(info)) {
                toBeText("error");
                return null;
            }
            HttpSession session = request.getSession();
            session.setAttribute("searchinfo", info);
            session.setAttribute("placeresult", "{}");
            session.setAttribute("distresult", "{}");
            session.setAttribute("boundresult", "{}");
            session.setAttribute("boundmarkerresult", "{}");
            toBeText("ok");
        } catch (Exception ex) {
            toBeText("error");
        }
        return null;
    }

    public String getSessionAttribute() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String type = request.getParameter("type");
            HttpSession session = request.getSession();
            Object obj = session.getAttribute(type);
            String str = obj.toString();
            toBeJson(str);
        } catch (Exception ex) {
            return null;
        }
        return null;
    }

    public String randomPlacesResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = "{}";
            if(requestContainsAttr(request, "need")) {
                str = PlaceQuery.getRandomResults(requestContainsAttr(request, "admin"));
            }
            toBeJson(str);
            request.getSession().setAttribute("placeresult", str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomDistsResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = "{}";
            if(requestContainsAttr(request, "need")) {
                str = DistQuery.getRandomResults(requestContainsAttr(request, "admin"));
            }
            toBeJson(str);
            request.getSession().setAttribute("distresult", str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomBoundsResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = "{}";
            if(requestContainsAttr(request, "need")) {
                str = BoundQuery.getRandomResults(requestContainsAttr(request, "admin"));
            }
            toBeJson(str);
            request.getSession().setAttribute("boundresult", str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomBoundMarkersResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = "{}";
            if(requestContainsAttr(request, "need")) {
                str = BoundMarkerQuery.getRandomResults(requestContainsAttr(request, "admin"));
            }
            toBeJson(str);
            request.getSession().setAttribute("boundmarkerresult", str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }


    public String wholeGeonames() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = null;
            if(requestContainsAttr(request, "admin")) {
                str = PlaceQuery.getTotalTempGeonameInfo();
            } else {
                str = PlaceQuery.getTotalGeonameInfo();
            }
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String easyGeonames() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = null;
            if(requestContainsAttr(request, "zg")) {
                str = ZPlaceQuery.getEasyGeonameInfo();

            } else if(requestContainsAttr(request, "admin")) {
                str = PlaceQuery.getEasyTempGeonameInfo();
            } else {
                str = PlaceQuery.getEasyGeonameInfo();
            }
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getEasyGeonamesByBigType() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String typeStr = request.getParameter("bigtype"), str = null;
            str = PlaceQuery.getEasyGeonamesByBigType(typeStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getEasyGeonamesByType() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String typeStr = request.getParameter("type"), str = null;
            str = PlaceQuery.getEasyGeonamesByType(typeStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getEasyGeonamesByInitial() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String i_str = request.getParameter("initial"), str = null;
            str = PlaceQuery.getEasyGeonamesByInitial(i_str);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

//    public String getEasyGeonamesByWords() {
//        HttpServletRequest request = ServletActionContext.getRequest();
//        try {
//            String words_str = request.getParameter("initial"), str = null;
//            str = PlaceQuery.getEasyGeonamesByWords(words_str);
//            toBeJson(str);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return ex.getMessage();
//        }
//        return null;
//    }

    public String getGeonameByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String nameStr = request.getParameter("name"), str = null;
            if(requestContainsAttr(request, "zg")) {
                str = ZPlaceQuery.getGeonameInfoByNickname(nameStr, false);
            } else {
                str = PlaceQuery.getGeonameInfoByNickname(nameStr, requestContainsAttr(request, "admin"));
            }
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameInfoByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            //  String adminStr = request.getParameter("name");
            String str = PlaceQuery.getGeonameInfoByAttr("nickname" ,name, requestContainsAttr(request, "admin"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameFullByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameFullByAttr("nickname" ,name, requestContainsAttr(request, "admin"));
            String outStr = str.substring(1, str.length() - 1);
            toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameFullById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameInfoByNum("id" ,idStr, requestContainsAttr(request, "admin"));
            String outStr = str.substring(1, str.length() - 1);
            toBeText(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameSpecificInfo() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("dmid").getBytes("iso-8859-1"));
            String tb_name = new String(request.getParameter("tb").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameSpecificInfo(idStr, tb_name);
            String outStr = str.substring(1, str.length() - 1);
            toBeText(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }



    public String wholeDists() {
        HttpServletRequest request = ServletActionContext.getRequest();
        String str;
        if(requestContainsAttr(request, "zg")) {
            str = DistQuery.getTotalDistInfo();
        } else {
            str = DistQuery.getTotalDistInfo();
        }
        toBeJson("[" + str + "]");
        return null;
    }

    public String wholeEasyDists() {
        String str = DistQuery.getEasyDistInfo();
        toBeJson("[" + str + "]");
        return null;
    }

    public String getEasyDistInfoWithZeroChilds() {
        String str = DistQuery.getEasyDistInfoWithZeroChilds();
        toBeJson("[" + str + "]");
        return null;
    }

    public String getDistInfoByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            String str = DistQuery.getDistInfoByAttr("nickname" ,name);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getDistInfoByNum() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = DistQuery.getDistInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String wholeTypes() {

        HttpServletRequest request = ServletActionContext.getRequest();
        String webPath = ServletActionContext.getServletContext().getRealPath("/");
        String jsPath =  webPath + "data/placetypes_treedata.json";
        StringBuffer jsonBuf = new StringBuffer();
        File jFile=new File(jsPath);
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(jFile.getAbsolutePath()),"UTF-8"));
            String str=br.readLine();
            while(str!=null) {
                jsonBuf.append(str);
                str=br.readLine();
            }
            String json=jsonBuf.toString();
            br.close();
            this.toBeJson(json);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    public String wholeEasyBounds() {
        String str = BoundQuery.getEasyBoundsInfo();
        toBeJson(str);
        return null;
    }

    public String wholeBoundPaths() {
        String str = BoundQuery.getBoundPathsInfo();
        toBeJson(str);
        return null;
    }

    public String getBoundInfoById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
//            int id = Integer.parseInt(idStr);
            String str = BoundQuery.getBoundInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String wholeEasyBoundMarkers() {
        String str = BoundMarkerQuery.getEasyBoundMarkersInfo();
        toBeJson(str);
        return null;
    }

    public String getBoundMarkerInfoById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = BoundMarkerQuery.getBoundMarkerInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getBoundMarkerRelateDistsById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = BoundMarkerQuery.getBoundMarkerRelatedDists(idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
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

    public static void toBeJson(List list, int total) throws Exception{
        HttpServletResponse response = ServletActionContext.getResponse();
        JSONObject jobj = new JSONObject();
        jobj.accumulate("total",total );
        jobj.accumulate("rows", list);
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(jobj.toString());
    }

    public static String subJson(String org, int startpage, int pagerows) {
        JSONObject data = JSONObject.fromString(org);
        String total = data.getString("total");
        JSONArray rows = data.getJSONArray("rows");
        int len = rows.length();
        int startId = (startpage - 1) * pagerows, eId = startId + pagerows;
        int endId = eId < len ? eId :len;
        StringBuffer json=new StringBuffer();
        json.append("{\"total\":");
        json.append(total);
        json.append(",\"rows\":[");
        for(int i = startId; i < endId; i++) {
            JSONObject ins = rows.getJSONObject(i);
            String jstr = ins.toString();
            json.append(jstr).append(",");
        }
        if(endId > startId) {
            json.deleteCharAt(json.length()-1);
        }
        json.append("]}");
        String str=json.toString();
        return str;
    }

    public static boolean requestContainsAttr(HttpServletRequest request, String attrName) {
        try {
            String adminStr = request.getParameter(attrName);
            boolean admin = (adminStr != null && !"".equals(adminStr));
            return admin;
        } catch (Exception ex) {
            return false;
        }
    }

}
