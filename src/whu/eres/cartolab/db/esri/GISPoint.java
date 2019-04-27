package whu.eres.cartolab.db.esri;

import com.vividsolutions.jts.geom.Coordinate;
import org.json.simple.JSONObject;
import org.opengis.feature.simple.SimpleFeature;
import com.vividsolutions.jts.geom.Point;
import whu.eres.cartolab.geo.PositionUtil;

import java.util.*;

/**
 * 点对象模型
 * @author elon
 * @version 2018年6月26日
 */
public class GISPoint extends GISObjectBase {

    private static final long serialVersionUID = 851468237977190995L;

    /**
     * 点geometry对象
     */
    private Point point = null;

    public GISPoint(Point point, SimpleFeature simpleFeature, List<ShapeFieldInfo> attrFieldList) {
        super(EnumGISObjectType.POINT, simpleFeature, attrFieldList);
        this.point = point;
    }

    public Point getPoint() {
        return point;
    }

    public void setPoint(Point point) {
        this.point = point;
    }

    public String getSpatalString() {
//        double[] xy = PositionUtil.gps84ToBd09Array(point.getX(), point.getY());
//        String jsonStr = "[" + xy[0] + ", " + xy[1] + "]";
        String jsonStr = "[" + point.getX() + ", " + point.getY() + "]";
        return jsonStr;
    }

}
