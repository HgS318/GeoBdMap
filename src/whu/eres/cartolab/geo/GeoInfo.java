package whu.eres.cartolab.geo;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.geotools.geometry.jts.coordinatesequence.PackedCSBuilder;
import org.geotools.resources.NIOUtilities;
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
    public String flash;
    public long flashLength;
    public Date time;
    public Date obsoleteTime;

    public boolean dealed = false;

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
            if(imageStrs != null && !"".equals(imageStrs)) {
                String[] imagesStrs = imageStrs.split(";");
                for (String imageStr : imagesStrs) {
                    if (imageStr != null && imageStr.length() > 3) {
                        String imageStrTrim = imageStr.trim();
                        String imagePath = MysqlLocalConnection.websitePath + imageStrTrim;
                        File imageFile = new File(imagePath);
                        if (imageFile.exists()) {
                            images.add(imageStrTrim);
                        }
                    }
                }
            }
            vedio = rs.getString("vedio");
            vedioLength = rs.getLong("vedioLength");
            audio = rs.getString("audio");
            audioLength = rs.getLong("audioLength");
            model = rs.getString("model");
            modelimg = rs.getString("modelimg");
            flash = rs.getString("flash");
            flashLength = rs.getLong("flashLength");
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

    public boolean canSwallow(GeoInfo other, int spaAdd, int timaAdd,
            Date moment, Date start, Date end) {
        int thisid = Math.abs(this.geid);
        int otherid = Math.abs(other.geid);
        if(thisid > otherid) {  //  后面的信息要素不能融合前面的信息要素
            return false;
        }
        if(spaAdd == 2) {   //  下确共位
            if(this.spaType  == other.spaType) {
                if(spaType == 3) {  //  线暂时不做下确共位叠加

                    return false;
                }
            } else {
                if(this.spaType != 5 || other.spaType != 1) {   //  只有面可以融合点
                    return false;
                }
            }
        }
        if(spaAdd == 1) {   //  上确共位

        }
        if(timaAdd == 1) {  //  串联叠加
            return true;
        } else if(timaAdd == 2) {   //  并联叠加
            if(this.time == null) {
                return true;
            }
            if(this.time.equals(other.time)) {
                return true;
            }
            return false;
        } else if(moment != null) { //  瞬间叠加
            if(moment.equals(this.time) && moment.equals(other.time)) {
                return true;
            }
            return false;
        } else if(start != null && end != null) {   //  指定时间叠加
            if(this.time == null || other.time == null) {
                return false;
            }
            long thisTime = this.time.getTime();
            long otherTime = other.time.getTime();
            long startTime = start.getTime();
            long endTime = end.getTime();
            if(thisTime >= startTime && thisTime <= endTime && otherTime >= startTime && otherTime <= endTime) {
                return true;
            }
            return false;
        }
        return false;
    }

    public List<GeoEntity> posadd(List<GeoInfo> infos, int spaAdd, int timaAdd,
                              Date moment, Date start, Date end) {
        List<GeoEntity> entities = new ArrayList<>();
        for(GeoInfo info : infos) {
            if(spaAdd == 1) {
                if(info.spaType == 3 && info.geid < 0) {
                    info.dealed = true;
                } else {
                    info.dealed = false;
                }
            } else if(spaAdd == 2) {
                if(info.spaType == 3 && info.geid > 0) {
                    info.dealed = true;
                } else {
                    info.dealed = false;
                }
            }
        }
        int infoCount = infos.size();

        for(int i = 0; i < infoCount; i++) {
            GeoInfo thisInfo = infos.get(i);
            if(thisInfo.dealed) {
                continue;
            }
            List<GeoInfo> group = new ArrayList<>();
            group.add(thisInfo);
            for(int j = i + 1; j < infoCount; j++) {
                GeoInfo other = infos.get(j);
                if(other.dealed) {
                    continue;
                }
                if(thisInfo.canSwallow(other, spaAdd, timaAdd, moment, start, end)) {
                    group.add(other);
                    other.dealed = true;
                }
            }
            GeoEntity entity = new GeoEntity(group);
            thisInfo.dealed = true;
        }
        return entities;
    }

    public List<GeoInfo> getGeoInfosByIdsString(String idsStr) {
        return null;
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
        obj.put("vedioLength", vedioLength);
        obj.put("audio", audio);
        obj.put("audioLength", audioLength);
        obj.put("model", model);
        obj.put("modelimg", modelimg);
        obj.put("flash", flash);
        obj.put("flashLength", flashLength);
        obj.put("time", time == null ? null : time.toString());
        obj.put("obsoleteTime", time == null ? null : time.toString());
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
        InfoAmount ia = new InfoAmount(textAmount, figureAmount, imageAmount, vedioLength, audioLength, flashLength, modelAmount);
        return ia;
    }

}
