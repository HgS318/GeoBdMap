package whu.eres.cartolab.db.esri;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.geotools.data.FeatureSource;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;

import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.MultiPolygon;
import com.vividsolutions.jts.geom.Point;

/**
 * Shape文件操作公共类。
 * @author elon
 * @version 2018年6月24日
 */
public class ShapeUtils {

    /**
     * 提取shape文件包含的属性字段名称和类型信息。
     *
     * @param shpFilePath shape文件路径
     * @return 属性信息
     */
    public static List<ShapeFieldInfo> distillShapeFieldInfo(String shpFilePath) {
        List<ShapeFieldInfo> fieldList = new ArrayList<>();
        ShapefileDataStore dataStroe = buildDataStore(shpFilePath);

        try {
            List<AttributeDescriptor> attrList = dataStroe.getFeatureSource().getSchema()
                    .getAttributeDescriptors();
            for (AttributeDescriptor attr : attrList) {
                ShapeFieldInfo field = new ShapeFieldInfo();
                field.setFieldName(attr.getLocalName());
                field.setFieldType(attr.getType().getBinding());
                fieldList.add(field);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            dataStroe.dispose();
        }

        return fieldList;
    }

    /**
     * 读取GIS图层对象。
     * @param shpFilePath shp文件路径
     * @return 对象列表
     */
    @SuppressWarnings("unchecked")
    public static <T extends GISObjectBase> List<T> readGisObject(String shpFilePath) {
        if (!shpFilePath.endsWith(".shp") && !shpFilePath.endsWith(".SHP")) {
            shpFilePath = shpFilePath + ".shp";
        }
        List<T> gisObjectList = new ArrayList<>();
        List<ShapeFieldInfo> attrFieldList = distillShapeFieldInfo(shpFilePath);
        ShapefileDataStore dataStore = buildDataStore(shpFilePath);
        try {
            String typeName = dataStore.getTypeNames()[0];
            FeatureSource<SimpleFeatureType, SimpleFeature> fs = dataStore.getFeatureSource(typeName);
            FeatureCollection<SimpleFeatureType, SimpleFeature> fcResult = fs.getFeatures();
            System.out.println("fcResult size:" + fcResult.size());

            FeatureIterator<SimpleFeature> iter = fcResult.features();
            while (iter.hasNext()) {
                SimpleFeature sf = iter.next();
                Collection<Property> property = sf.getProperties();
                Iterator<Property> iterP = property.iterator();
                while (iterP.hasNext()) {
                    Property pro = iterP.next();
                    if (pro.getValue() instanceof MultiPolygon) {
                        gisObjectList.add((T) new GisMultiPolygon((MultiPolygon) pro.getValue(), sf, attrFieldList));
                    } else if (pro.getValue() instanceof Point) {
                        gisObjectList.add((T) new GISPoint((Point) pro.getValue(), sf, attrFieldList));
                    } else if (pro.getValue() instanceof MultiLineString) {
                        gisObjectList.add((T) new GisLine((MultiLineString) pro.getValue(), sf, attrFieldList));
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            dataStore.dispose();
        }

        fillGisObjectAttr(gisObjectList);
        return gisObjectList;
    }

    /**
     * 填充GIS对象的属性信息。
     *
     * @param gisObjectList gis对象列表
     */
    private static <T extends GISObjectBase> void fillGisObjectAttr(List<T> gisObjectList) {
        for(T gisObject : gisObjectList) {
            for(ShapeFieldInfo field : gisObject.getAttrFieldList()) {
                Object value = gisObject.getSimpleFeature().getAttribute(field.getFieldName());
                gisObject.addAttribute(field.getFieldName(), value);
            }

            System.out.println(gisObject.getAttributeMap());
        }
    }

    /**
     * 构建ShapeDataStore对象。
     * @param shpFilePath shape文件路径。
     * @return
     */
    public static ShapefileDataStore buildDataStore(String shpFilePath) {
        ShapefileDataStoreFactory factory = new ShapefileDataStoreFactory();
        try {
            ShapefileDataStore dataStore = (ShapefileDataStore) factory
                    .createDataStore(new File(shpFilePath).toURI().toURL());
            if (dataStore != null) {
                dataStore.setCharset(Charset.forName("UTF-8"));
            }
            return dataStore;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}
