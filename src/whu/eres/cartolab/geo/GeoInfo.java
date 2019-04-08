package whu.eres.cartolab.geo;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.geotools.geometry.jts.coordinatesequence.PackedCSBuilder;
import org.omg.CORBA.OBJ_ADAPTER;
import whu.eres.cartolab.db.esri.ShapeFile;
import whu.eres.cartolab.db.mysql.connections.MysqlLocalConnection;

import java.sql.ResultSet;
import java.util.*;
import java.io.*;

public class GeoInfo {

//    int infoId;
    public int id;
    public int geid;
    public String name;
    public String address;
    public double x;
    public double y;
    public String position;
    public String line;
    public String polygon;
    public int spaType;
    public String shp;
    public int fid = -1;
    public String text;
    public String imageStrs;
    public List<String> images = new ArrayList<>();
    public String vedio;
    public long vedioLength;
    public String audio;
    public long audioLength;
    public String model;
    public String modelimg;
    public Date time;
    public Date obsoleteTime;

    public GeoInfo() {

    }

    public GeoInfo(ResultSet rs) {
        try{
            id = rs.getInt("id");
//            infoId = rs.getInt("infoId");
            geid = rs.getInt("geid");
            name = rs.getString("name");
            address = rs.getString("address");
            x = rs.getDouble("X");
            y = rs.getDouble("Y");
            position = rs.getString("position");
            if(x == 0.0 & y == 0.0 && position != null && position.length() > 2) {
                String[] xyStr = position.split(",");
                if(xyStr.length == 2) {
                    try {
                        x = Double.parseDouble(xyStr[0].trim());
                        y = Double.parseDouble(xyStr[1].trim());
                    } catch (Exception e1) {

                    }
                }
            }
            spaType = rs.getInt("spaType");
            if(spaType == 0) {
                spaType = 1;
            }
            line = rs.getString("line");
            polygon = rs.getString("polygon");
            shp = rs.getString("shp");
            fid = rs.getInt("fid");
            text = rs.getString("text");
            if(text != null) {
                text = text.replace("\"", "\'");
            }
            imageStrs = rs.getString("images");
            String[] imagesStrs = imageStrs.split(";");
            for(String imageStr : imagesStrs) {
                if(imageStr != null && imageStr.length() > 3) {
                    String imageStrTrim = imageStr.trim();
                    String imagePath = MysqlLocalConnection.websitePath + imageStrTrim;
                    File imageFile = new File(imagePath);
                    if(imageFile.exists()) {
                        images.add(imageStrTrim);
                    }
                }
            }
            vedio = rs.getString("vedio");
            vedioLength = rs.getLong("vedioLength");
            audio = rs.getString("audio");
            audioLength = rs.getLong("audioLength");
            model = rs.getString("model");
            modelimg = rs.getString("modelimg");
            time = rs.getDate("time");
            obsoleteTime = rs.getDate("obsoleteTime");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getShape() {
        if(shp != null && !"".equals(shp) && fid > -1) {
            return ShapeFile.getShapeByFid(shp, fid);
        }
        return "";
    }

//    public String getImagesStr() {
//        StringBuffer buf = new StringBuffer();
//        for(String img : images) {
//            buf.append(img).append(",");
//        }
//        return buf.toString();
//    }

    public JSONObject toJSONObject() {
        String shape = getShape();
//        String imagesStr = getImagesStr();
        JSONArray imageJson = toJSONArray(images);
        JSONObject obj = new JSONObject();
        obj.put("id", id);
        obj.put("name", name);
        obj.put("address", address);
        obj.put("x", x);
        obj.put("y", y);
        obj.put("position", position);
        obj.put("spaType", spaType);
        obj.put("polygon", polygon);
        obj.put("shape", shape);
        obj.put("text", text);
        obj.put("images", imageJson);
        obj.put("vedio", vedio);
        obj.put("audio", audio);
        obj.put("model", model);
        obj.put("modelimg", modelimg);
        obj.put("time", time);
        obj.put("obsoleteTime", obsoleteTime);
        return obj;
    }

    public static JSONArray toJSONArray(List<String> strs) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for (String str : strs) {
            if(str != null && !"".equals(str)) {
                jsonArray.put(i, str);
                i++;
            }
        }
        return jsonArray;
    }

    public String toJson() {
        JSONObject obj = toJSONObject();
        String str = obj.toString();
        return str;
    }

    public static JSONArray toJSONList(List<GeoInfo> infos) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for(GeoInfo info : infos) {
            JSONObject obj = info.toJSONObject();
            jsonArray.put(i, obj);
            i++;
        }
        return jsonArray;
    }

    public static String toJson(List<GeoInfo> infos) {
        JSONArray jsonArray = toJSONList(infos);
        String str = jsonArray.toString();
        return str;
    }

    public long textInfoAmount() {
        if(text != null && !"".equals(text)) {
            return text.length();
        }
        return 0L;
    }

    public long figureInfoAmount() {
        if(shp != null && !"".equals(shp) && fid > -1) {
            long shpGeoLength = InfoAmount.countFiureLength(shp, fid);
            if (shpGeoLength > 0) {
                return shpGeoLength;
            }
        }
        if(polygon != null && !"".equals(polygon)) {
            return polygon.length();
        }
        if(line != null && !"".equals(line)) {
            return line.length();
        }
        if(x != 0.0 || y != 0.0) {
            return 16L;
        }
        if(position != null && !"".equals(position)) {
            return position.length();
        }
        return 0L;
    }

    public long imagesInfoAmount() {
        return InfoAmount.countImagesLength(images, MysqlLocalConnection.websitePath);
    }

    public long modelInfoAmount() {
        long modelAmount = InfoAmount.countModelLength(MysqlLocalConnection.websitePath + model);
        return modelAmount;
    }

    public InfoAmount infoAmount() {
        long textAmount = textInfoAmount();
        long figureAmount = figureInfoAmount();
        long imageAmount = imagesInfoAmount();
        long modelAmount = modelInfoAmount();
        InfoAmount ia = new InfoAmount(textAmount, figureAmount, imageAmount, vedioLength, audioLength, modelAmount);
        return ia;
    }

}
