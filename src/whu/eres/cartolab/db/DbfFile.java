package whu.eres.cartolab.db;

import com.linuxense.javadbf.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;

public class DbfFile {

    int num_fields;
    int num_records;
    LinkedList<DBFField> fields = new LinkedList<DBFField>();
    LinkedList<LinkedList<Object>> records = new LinkedList<LinkedList<Object>>();

    public DbfFile() {

    }

    public DbfFile(String path) {
        // 开始读
        DBFReader reader = null;
        FileInputStream fis = null;
        File f = new File(path);
        try {
            fis = new FileInputStream(f);
            reader = new DBFReader(fis);
            reader.setCharactersetName("GBK");
            num_fields = reader.getFieldCount();
            num_records = reader.getRecordCount();
            Object[] objects = null;
//            for (; (objects = reader.nextRecord()) != null; ) {
//
//                System.out.println(Arrays.toString(objects));
//            }
            for (int i = 0; i < num_fields; i++) {
                DBFField field = reader.getField(i);
                this.fields.add(field);
            }
            for(int i = 0; i < num_records; i++) {
                Object[] record_objs = reader.nextRecord();
//                System.out.println(Arrays.toString(record_objs));
                LinkedList<Object> record_list = new LinkedList<Object>();
                for(Object obj : record_objs) {
                    record_list.add(obj);
                }
                this.records.add(record_list);
            }
            DBFUtils.close(reader);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getFIDbyName(String _name) {
        int name_field = -1;
        for(int j = 0; j < num_fields; j++) {
            String field_name = fields.get(j).getName().toLowerCase();
            if("name".equals(field_name)) {
                name_field = j;
                break;
            }
        }
        if (name_field < 0) {
            return -1;
        }
        for(int i = 0; i < num_records; i++) {
            try {
                String val = records.get(i).get(name_field).toString();
                if(_name.equals(val)) {
                    return i;
                }
            } catch (Exception e) {

            }
        }
        return -1;
    }

    public static void main(String[] args) {
        String dbf_path = "D:\\try\\World\\china\\chinaWGS84\\A_市行政区.dbf";
        DbfFile dbf = new DbfFile(dbf_path);
        int fid = dbf.getFIDbyName("上海市");
        System.out.println(fid);
//        try {
//            DbfFile.testWriteAndReadAgain();
//        } catch (DBFException | IOException e) {
//            e.printStackTrace();
//        }
    }

    public static void testWriteAndReadAgain() throws DBFException, IOException {
        // let us create field definitions first
        // we will go for 3 fields
        //
        String filePath = "D:\\MyData\\JavaProjects\\IDEA\\geotools-test\\data\\test_dbf.dbf";
        DBFField fields[] = new DBFField[3];

        fields[0] = new DBFField();
        fields[0].setName("emp_code");
        fields[0].setType(DBFDataType.CHARACTER);
        fields[0].setLength(10);

        fields[1] = new DBFField();
        fields[1].setName("emp_name");
        fields[1].setType(DBFDataType.CHARACTER);
        fields[1].setLength(20);

        fields[2] = new DBFField();
        fields[2].setName("salary");
        fields[2].setType(DBFDataType.NUMERIC);
        fields[2].setLength(12);
        fields[2].setDecimalCount(2);
        DBFWriter writer = null;
        DBFReader reader = null;
        FileInputStream fis = null;
        FileOutputStream fos = null;
        File f = new File(filePath);
        f.createNewFile();
        try {
            // 开始写
            fos = new FileOutputStream(f);
            writer = new DBFWriter(fos);
            writer.setFields(fields);

            // now populate DBFWriter
            //

            Object rowData[] = new Object[3];
            rowData[0] = "1000";
            rowData[1] = "John";
            rowData[2] = new Double(5000.00);

            writer.addRecord(rowData);

            rowData = new Object[3];
            rowData[0] = "1001";
            rowData[1] = "Lalit";
            rowData[2] = new Double(3400.00);

            writer.addRecord(rowData);

            rowData = new Object[3];
            rowData[0] = "1002";
            rowData[1] = "Rohit";
            rowData[2] = new Double(7350.00);

            writer.addRecord(rowData);

            DBFUtils.close(writer);
            System.out.println("The dbf file product success!");

            // 开始读
            fis = new FileInputStream(f);
            reader = new DBFReader(fis);
            Object[] objects = null;
            for (; (objects = reader.nextRecord()) != null;) {
                System.out.println(Arrays.toString(objects));
            }
            DBFUtils.close(reader);

        } finally {
            DBFUtils.close(reader);
            DBFUtils.close(writer);
        }
    }

}
