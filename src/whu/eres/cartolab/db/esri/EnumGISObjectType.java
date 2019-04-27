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

    public int getSpaType() {
        int spaType = 1;
        switch (type) {
            case 1: spaType = 1; break;
            case 2: spaType = 3; break;
            case 4: spaType = 5; break;
            default: spaType = 1;
        }
        return spaType;
    }

}
