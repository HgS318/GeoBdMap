package whu.eres.cartolab.db.esri;


/**
 * GIS图层对象枚举定义
 * @author elon
 * @version 2018年6月26日
 */
public enum EnumGISObjectType {
    POINT(1),
    LINE(2),
    POLYGON(4);
    private int type;

    private EnumGISObjectType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }
}
