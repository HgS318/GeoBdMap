package whu.eres.cartolab.geo;

import java.util.*;
import java.util.Map.*;
import net.sf.json.*;

import whu.eres.cartolab.db.esri.ShapeFile;
import whu.eres.cartolab.db.mysql.connections.*;

public class GeoEntity {
    public int geid;
    public  String name;
    public String address;
    public double x;
    public double y;
    public String position;
    public String line;
    public String polygon;
    public Map<String, Integer> shps = new HashMap<>();
    public List<String> texts = new ArrayList<>();
    public List<String> images = new ArrayList<>();
    public Map<String, Long> vedios = new HashMap<>();
    public Map<String, Long> audios = new HashMap<>();
    public Map<String, Long> flashes = new HashMap<>();
    public Map<String, String> models = new HashMap<>();
    public Date time;
    public Date obsoleteTime;
    public List<Integer> infoIds = new ArrayList<>();

    public GeoEntity() {

    }

    public GeoEntity(List<GeoInfo> infos) {
        for(GeoInfo info : infos) {
            geid = info.geid;
            infoIds.add(info.id);
            if(name == null || "".equals(name)) {
                name = info.name;
            }
            if(address == null || "".equals(address)) {
                address = info.address;
            }
            if(x == 0.0) {
                x = info.x;
            }
            if(y == 0.0) {
                y = info.y;
            }
            if(position == null || "".equals(position)) {
                position = info.position;
            }
            if(line == null || "".equals(line)) {
                line = info.line;
            }
            if(polygon == null || "".equals(polygon)) {
                polygon = info.polygon;
            }
            if(info.shp != null && !"".equals(info.shp) && info.fid > -1) {
                shps.put(info.shp, info.fid);
            }
            if(info.text != null && !"".equals(info.text)) {
                texts.add(info.text);
            }
            if(info.images.size() > 0) {
                images.addAll(info.images);
            }
            if(info.vedio != null && !"".equals(info.vedio)) {
                vedios.put(info.vedio, info.vedioLength);
            }
            if(info.audio != null && !"".equals(info.audio)) {
                audios.put(info.audio, info.audioLength);
            }
            if(info.flash != null && !"".equals(info.flash)) {
                flashes.put(info.flash, info.flashLength);
            }
            if(info.model != null && !"".equals(info.model)) {
                models.put(info.model, info.modelimg);
            }
            if(time == null) {
                time = info.time;
            }
            if(obsoleteTime == null) {
                obsoleteTime = info.obsoleteTime;
            }
        }
    }

    public JSONObject toJSONObject() {
        JSONArray shapes = getShapes();
        JSONArray textsArr = toJSONArray(texts);
//        String imagesStr = getImagesStr();

        JSONArray imagesArr = toJSONArray(images);
        JSONArray vediosArr = toJSONArray(vedios);
        JSONArray audiosArr = toJSONArray(audios);
        JSONArray flashArr = toJSONArray(flashes);
        JSONArray modelsArr = toPairJSONArray(models);
        InfoAmount infoAmount = infoAmount();

        JSONObject obj = new JSONObject();
        obj.put("geid", geid);
        obj.put("name", name);
        obj.put("address", address);
        obj.put("x", x);
        obj.put("y", y);
        obj.put("position", position);
        obj.put("polygon", polygon);
        obj.put("line", line);
        obj.put("shapes", shapes);
        obj.put("text", textsArr);
        obj.put("images", imagesArr);
        obj.put("vedios", vediosArr);
        obj.put("audios", audiosArr);
        obj.put("flashes", flashArr);
        obj.put("models", modelsArr);
        obj.put("time", time == null ? null : time.toString());
        obj.put("obsoleteTime", obsoleteTime == null ? null : obsoleteTime.toString());
        obj.put("infoAmount", infoAmount.toJson());
        return obj;
    }

    public String toJson() {
        JSONObject obj = toJSONObject();
        String str = obj.toString();
        return str;
    }

    public static JSONArray toJSONList(List<GeoEntity> entities) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for(GeoEntity entity : entities) {
            JSONObject obj = entity.toJSONObject();
            jsonArray.put(i, obj);
            i++;
        }
        return jsonArray;
    }

    public static String toJson(List<GeoEntity> entities) {
        JSONArray jsonArray = toJSONList(entities);
        String str = jsonArray.toString();
        return str;
    }

    public JSONArray getShapes() {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for (Entry<String, Integer> entry : shps.entrySet()) {
            String shp = entry.getKey();
            int fid = entry.getValue();
            String shape = ShapeFile.getShapeByFid(shp, fid);
            if(shape != null && !"".equals(shape)) {
                jsonArray.put(i, shape);
                i++;
            }
        }
        return jsonArray;
    }

    public String getImagesStr() {
        StringBuffer buf = new StringBuffer();
        for(String img : images) {
            buf.append(img).append(",");
        }
        return buf.toString();
    }

    public static JSONArray toJSONArray(Map properties) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for (Object _key : properties.keySet()) {
            String key = _key.toString();
            if(key != null && !"".equals(key)) {
                jsonArray.put(i, key);
                i++;
            }
        }
        return jsonArray;
    }

    public static JSONArray toPairJSONArray(Map properties) {
        JSONArray jsonArray = new JSONArray();
        int i = 0;
        for (Object _key : properties.keySet()) {
            String key = _key.toString();
            String _val = properties.get(_key).toString();
            if(key != null && !"".equals(key)) {
                jsonArray.put(i, _key + ":" + _val);
                i++;
            }
        }
        return jsonArray;
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

    public long textInfoAmount() {
        long length = 0L;
        long textsAcount =  InfoAmount.countTextsLength(texts);
        length += textsAcount;
        if(name != null) {
            length += name.length();
        }
        if(address != null) {
            length += address.length();
        }
        return length;
    }

    public long figureInfoAmount() {
        long length = 0L;
        for (Entry<String, Integer> entry : shps.entrySet()) {
            String shp = entry.getKey();
            int fid = entry.getValue();
            long shpGeoLength = InfoAmount.countFiureLength(shp, fid);
            length += shpGeoLength;
        }
        if(polygon != null && !"".equals(polygon)) {
            length += polygon.length();
        }
        if(line != null && !"".equals(line)) {
            length += line.length();
        }
        if(x != 0.0 || y != 0.0) {
            length += 16L;
        } else if(position != null && !"".equals(position)) {
            length += position.length();
        }
        return length;
    }

    public long imageInfoAmount() {
        return InfoAmount.countImagesLength(images, MysqlLocalConnection.websitePath);
    }

    public long vedioInfoAmount() {
        return InfoAmount.countVedioLength(vedios);
    }

    public long audioInfoAmount() {
        return InfoAmount.countAudioLength(audios);
    }

    public long flashInfoAmount() {
        return InfoAmount.countFlashLength(flashes);
    }

    public long modelInfoAmount() {
        return InfoAmount.countModelsLength(models, MysqlLocalConnection.websitePath);
    }

    public InfoAmount infoAmount() {
        long textAmount = textInfoAmount();
        long figureAmount = figureInfoAmount();
        long imageAmout = imageInfoAmount();
        long vedioAmount = vedioInfoAmount();
        long audioAmount = audioInfoAmount();
        long flashAmount = flashInfoAmount();
        long modelAmount = modelInfoAmount();
        InfoAmount ia = new InfoAmount(textAmount, figureAmount, imageAmout, vedioAmount, audioAmount, flashAmount, modelAmount);
        return ia;

    }



}
