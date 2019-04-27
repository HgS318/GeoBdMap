package whu.eres.cartolab.db.esri;

import com.vividsolutions.jts.geom.Coordinate;
import org.opengis.feature.simple.SimpleFeature;

import com.vividsolutions.jts.geom.MultiLineString;
import whu.eres.cartolab.geo.PositionUtil;

import java.util.List;

/**
 * 线对象模型。
 *
 * @author elon
 * @version 2018年6月26日
 */
public class GisLine extends GISObjectBase {

    private static final long serialVersionUID = 495559767188836052L;

    /**
     * 多线geometry对象
     */
    private MultiLineString line = null;

    public GisLine(MultiLineString line, SimpleFeature simpleFeature, List<ShapeFieldInfo> attrFieldList) {
        super(EnumGISObjectType.LINE, simpleFeature, attrFieldList);
        this.line = line;
    }

    public MultiLineString getLine() {
        return line;
    }

    public void setLine(MultiLineString line) {
        this.line = line;
    }

    public String getSpatalString() {
        Coordinate[] coords = line.getCoordinates();
        StringBuffer buf = new StringBuffer();
        buf.append("[");
        for (Coordinate coord : coords) {
//            double[] xy = PositionUtil.gps84ToBd09Array(coord.x, coord.y);
//            buf.append(" [ ").append(xy[0]).append(", ").append(xy[1]).append(" ],");
            buf.append(" [ ").append(coord.x).append(", ").append(coord.y).append(" ],");
        }
        buf.deleteCharAt(buf.length() - 1);
        buf.append(" ]");
        return buf.toString();
    }

}