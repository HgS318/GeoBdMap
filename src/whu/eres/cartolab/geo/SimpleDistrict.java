package whu.eres.cartolab.geo;

import net.sf.json.*;
import java.util.*;

public class SimpleDistrict {

    public String province;
    public String city;
    public String dist;

    public SimpleDistrict() {

    }

    public SimpleDistrict(String province, String city, String dist) {
        this.province = province;
        this.city = city;
        this.dist = dist;
    }

    public SimpleDistrict(JSONObject json) {
        try {
            province = json.getString("Province");
            city = json.getString("City");
            dist = json.getString("District");
        } catch (Exception exp) {

        }
    }

    public boolean equals(SimpleDistrict sd) {
        return (province.equals(sd.province) && city.equals(sd.city) && dist.equals(sd.dist));
    }

    public JSONObject toJSONObject() {
        JSONObject obj = new JSONObject();
        obj.put("province", province);
        obj.put("city", city);
        obj.put("dist", dist);
        return obj;
    }

    public static boolean addDistrict(SimpleDistrict sd, List<SimpleDistrict> list) {
        boolean flag = false;
        for(SimpleDistrict dis : list) {
            if(sd.equals(dis)) {
                flag = true;
            }
        }
        if(!flag) {
            list.add(sd);
        }
        return !flag;
    }

}
