package whu.eres.cartolab.db.esri;

import java.io.Serializable;

/**
 * Shape文件字段信息模型。
 *
 * @author elon
 * @version 2018年6月24日
 */
public class ShapeFieldInfo implements Serializable {

    private static final long serialVersionUID = 6947403344262247581L;

    /**
     * 字段名称
     */
    private String fieldName = "";

    /**
     * 字段类型
     */
    private Class<?> fieldType = null;

    @Override
    public String toString() {
        return "fieldName:" + fieldName + "|fieldType:" + fieldType.getName();
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Class<?> getFieldType() {
        return fieldType;
    }

    public void setFieldType(Class<?> fieldType) {
        this.fieldType = fieldType;
    }
}