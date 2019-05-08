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

    public int infoId;
    public int id;
    public int geid;
    public int lowerid;
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
            infoId = rs.getInt("infoId");
            lowerid = rs.getInt("lowerid");
//            infoId = rs.getInt("infoId");
            geid = rs.getInt("geid");
            name = rs.getString("name");
            address = rs.getString("address");
            x = rs.getDouble("X");
            y = rs.getDouble("Y");
            position = rs.getString("position");
            if("".equals(position)) {
                position = null;
            }
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
        InfoAmount infoAmount = infoAmount();
        JSONArray imageJson = toJSONArray(images);
        JSONObject obj = new JSONObject();
        obj.put("id", infoId);
        obj.put("infoId", infoId);
        obj.put("geid", geid);
        obj.put("name", name);
        obj.put("address", address);
        obj.put("x", x);
        obj.put("y", y);
        obj.put("position", position);
        obj.put("line", line);
        obj.put("polygon", polygon);
        obj.put("spaType", spaType);
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
        obj.put("infoAmount", infoAmount.toJson());
        return obj;
    }

    public JSONObject toJSONObjectLikeEntity() {
        String shape = getShape();
//        String imagesStr = getImagesStr();
        InfoAmount infoAmount = infoAmount();
        JSONArray imageJson = toJSONArray(images);
        JSONObject obj = new JSONObject();
        obj.put("id", infoId);
        obj.put("infoId", infoId);
        obj.put("geid", geid);
        obj.put("name", name);
        obj.put("address", address);
        obj.put("x", x);
        obj.put("y", y);
        obj.put("position", position);
        obj.put("line", line);
        obj.put("polygon", polygon);
        obj.put("spaType", spaType);
        obj.put("shape", shape);
//        obj.put("texts", text);
        if(text != null && !"".equals(text)) {
            obj.put("texts", new String[] {text});
        } else {
            obj.put("texts", text);
        }
        obj.put("images", imageJson);
        if(vedio != null && !"".equals(vedio)) {
            obj.put("vedios", new String[] {vedio});
        } else {
            obj.put("vedios", vedio);
        }
        obj.put("vedioLength", vedioLength);
//        obj.put("audios", new String[] {audio});
        if(audio != null && !"".equals(audio)) {
            obj.put("audios", new String[] {audio});
        } else {
            obj.put("audios", audio);
        }
        obj.put("audioLength", audioLength);
//        obj.put("models", new String[] {model});
        if(model != null && !"".equals(model)) {
            obj.put("models", new String[] {model + ":" + modelimg});
        } else {
            obj.put("models", model);
        }
        obj.put("modelimg", modelimg);
//        obj.put("flashes", new String[] {flash});
        if(flash != null && !"".equals(flash)) {
            obj.put("flashes", new String[] {flash});
        } else {
            obj.put("flashes", flash);
        }
        obj.put("flashLength", flashLength);
        obj.put("time", time == null ? null : time.toString());
        obj.put("obsoleteTime", time == null ? null : time.toString());
        obj.put("infoAmount", infoAmount.toJson());
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

    public String toJsonLikeEntity() {
        JSONObject obj = toJSONObjectLikeEntity();
        String str = obj.toString();
        return str;
    }

    public static JSONArray toJSONList(List<GeoInfo> infos, boolean likeEntity) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for(GeoInfo info : infos) {
            JSONObject obj = null;
            if(likeEntity) {
                obj = info.toJSONObjectLikeEntity();
            } else {
                obj = info.toJSONObject();
            }
            jsonArray.put(i, obj);
            i++;
        }
        return jsonArray;
    }

    public static String toJson(List<GeoInfo> infos, boolean likeEntity) {
        JSONArray jsonArray = toJSONList(infos, likeEntity);
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

    public static InfoAmount infoAmount(List<GeoInfo> infos) {
        InfoAmount ia = new InfoAmount();
        for(GeoInfo info : infos) {
            ia = InfoAmount.add(ia, info.infoAmount());
        }
        return ia;
    }

    public boolean canSwallow(GeoInfo other, int spaAdd, int timeAdd,
                              Date moment, Date start, Date end) {
        if(spaAdd == 1 && this.geid != other.geid) {
            return false;
        }
        if(spaAdd == 2 && this.lowerid != other.lowerid) {
            return false;
        }
        int thisid = Math.abs(this.infoId);
        int otherid = Math.abs(other.infoId);
        if(spaAdd == 1 && thisid > otherid) {
            return false;
        }
        if(spaAdd == 2) {   //  下确共位
            if(this.spaType  == other.spaType) {
                if(thisid < otherid) {  //  下确共位中，只有大号能吞并小号
                    return false;
                }
            } else {
                if(this.spaType != 1 || other.spaType != 5) {   //  下确共位的非同类型中，只有点可以融合面
                    return false;
                }
            }
        }
        if(timeAdd == 1) {  //  串联叠加
            return true;
        } else if(timeAdd == 2) {   //  并联叠加
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

    public static List<GeoEntity> posadd(List<GeoInfo> infos, int spaAdd, int timeAdd,
                                         Date moment, Date start, Date end) {
        List<GeoEntity> entities = new ArrayList<>();
        for(GeoInfo info : infos) {
            if(timeAdd == 3) {
                if(info.time.getTime() == moment.getTime()) {
                    info.dealed = false;
                } else {
                    info.dealed = true;
                }
            } else if(timeAdd == 4) {
                long time =info.time.getTime();
                if(time >= start.getTime() && time <= end.getTime()) {
                    info.dealed = false;
                } else {
                    info.dealed = true;
                }
            }
        }
        int infoCount = infos.size();

        //  第一步：先解决infoId<0的要素
        for(int i = 0; i < infoCount; i++) {
            GeoInfo thisInfo = infos.get(i);
            if(thisInfo.infoId > 0) {
                continue;
            }
            List<GeoInfo> group = new ArrayList<>();
            group.add(thisInfo);
            for(int j = 0; j < infoCount; j++) {
                if(i == j) {
                    continue;
                }
                GeoInfo other = infos.get(j);
                if(other.dealed || other.infoId < 0) {
                    continue;
                }
                if(thisInfo.canSwallow(other, spaAdd, timeAdd, moment, start, end)) {
                    group.add(other);
                    other.dealed = true;
                }
            }
            if(group.size() > 1) {
                if(spaAdd == 1) {
                    GeoEntity entity = new GeoEntity(group);
                    entity.posUp = 1;
                    entities.add(entity);
                } else if(spaAdd == 2) {
                    List<GeoInfo> singleList = new ArrayList<>();
                    singleList.add(thisInfo);
                    GeoEntity entity = new GeoEntity(singleList);
                    entity.posUp = 0;
                    entities.add(entity);
                }
                thisInfo.dealed = true;
            }
        }
        //  第二步，解决infoId > 0的普通要素
        for(int i = 0; i < infoCount; i++) {
            GeoInfo thisInfo = infos.get(i);
            if(thisInfo.dealed || thisInfo.infoId < 0) {
                continue;
            }
            List<GeoInfo> group = new ArrayList<>();
            group.add(thisInfo);
            for(int j = i + 1; j < infoCount; j++) {
                GeoInfo other = infos.get(j);
                if(other.dealed) {
                    continue;
                }
                if(thisInfo.canSwallow(other, spaAdd, timeAdd, moment, start, end)) {
                    if(spaAdd == 1 || (spaAdd == 2 && other.spaType == 1)) {
                        group.add(other);
                    }
                    other.dealed = true;
                }
            }
            GeoEntity entity = new GeoEntity(group);
            entities.add(entity);
            thisInfo.dealed = true;
        }
        return entities;
    }

    public static List<GeoInfo> getGeoInfosByIdsString(String idsStr) {
        return null;
    }

}
