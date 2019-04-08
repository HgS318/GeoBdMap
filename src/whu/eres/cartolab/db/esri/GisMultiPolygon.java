package whu.eres.cartolab.db.esri;

import org.opengis.feature.simple.SimpleFeature;
import com.vividsolutions.jts.geom.MultiPolygon;
import java.util.List;

/**
 * 多边形模型。
 *
 * @author elon
 * @version 2018年6月26日
 */
public class GisMultiPolygon extends GISObjectBase {

    private static final long serialVersionUID = -5705724544971923893L;

    /**
     * 多边形的geomtry模型。
     */
    private MultiPolygon polygon = null;;

    public GisMultiPolygon(MultiPolygon polygon, SimpleFeature simpleFeature, List<ShapeFieldInfo> attrFieldList) {
        super(EnumGISObjectType.POLYGON, simpleFeature, attrFieldList);
        this.polygon = polygon;
    }

    public MultiPolygon getPolygon() {
        return polygon;
    }

    public void setPolygon(MultiPolygon polygon) {
        this.polygon = polygon;
    }
}