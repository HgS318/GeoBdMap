package whu.eres.cartolab.db.office;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFComment;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.formula.functions.T;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import whu.eres.cartolab.db.DbUse;

public class ExcelDemo02 {

	//	读取excel (xls 或 xlsx)的一个工作表
	public static List<List<String>> readExcel(String excelPath, String sheetTitle)
			throws IOException {
		String suf = DbUse.getFileSuffix(excelPath);
		if(".xls".equalsIgnoreCase(suf)) {
			return readXls(excelPath, sheetTitle);
		} else if(".xlsx".equalsIgnoreCase(suf)) {
			return readXlsx(excelPath, sheetTitle);
		} else {
			return null;
		}
	}
	
	//	读取xls的一个工作表
	public static List<List<String>> readXls(String xlsPath, String sheetTitle) throws IOException {
		List<List<String>> lss=new LinkedList<List<String>>();
		InputStream is = new FileInputStream(xlsPath);  
		HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);   
		HSSFSheet hssfSheet = hssfWorkbook.getSheet(sheetTitle);  
		// 循环行Row   
		for(int rowNum = 0; rowNum <= hssfSheet.getLastRowNum(); rowNum++){  
			LinkedList<String> ls=new LinkedList<String>();
			lss.add(ls);
			HSSFRow hssfRow = hssfSheet.getRow( rowNum);  
			if(hssfRow == null){  
				continue;
			}  
  
			// 循环列Cell    
			for(int cellNum = 0; cellNum <= hssfRow.getLastCellNum(); cellNum++){  
				HSSFCell hssfCell = hssfRow.getCell( cellNum);  
				if(hssfCell == null){
					ls.add("");
					continue;  
				}
				ls.add(getValue(hssfCell));
				//System.out.print("    " + getValue( hssfCell));  
			}  
			//System.out.println();  
		}
//		hssfWorkbook.close();
		is.close();
		return lss;
	}
    
	//	读取一个xls
	public static List<List<String>> readXls(String xlsPath) throws IOException{ 
		List<List<String>> lss=new LinkedList<List<String>>();
		InputStream is = new FileInputStream(xlsPath);  
		HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);   
  
		// 循环工作表Sheet  
//		for(int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++){  
//			HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);  
//			if(hssfSheet == null){  
				HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(0);   
//			}  
			
			// 循环行Row   
			for(int rowNum = 0; rowNum <= hssfSheet.getLastRowNum(); rowNum++){  
				LinkedList<String> ls=new LinkedList<String>();
				lss.add(ls);
				HSSFRow hssfRow = hssfSheet.getRow( rowNum);  
				if(hssfRow == null){  
					continue;
				}  
      
				// 循环列Cell    
				for(int cellNum = 0; cellNum <= hssfRow.getLastCellNum(); cellNum++){  
					HSSFCell hssfCell = hssfRow.getCell( cellNum);  
					if(hssfCell == null){
						ls.add("");
						continue;  
					}
					ls.add(getValue( hssfCell));
					//System.out.print("    " + getValue( hssfCell));  
				}  
				//System.out.println();  
			}  
//		}  
//		hssfWorkbook.close();
			is.close();
		return lss;
	}  
    
	//	读取一个xlsx
	public static List<List<String>> readXlsx(String xlsxPath) throws IOException {  
		//String fileName = "D:\\Lab\\Onto\\材料\\试采集范例汇总_1222\\110301\\110301-范例采集数据元数据表.xlsx";  
		InputStream is = new FileInputStream(xlsxPath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);  
		List<List<String>> lss=new LinkedList<List<String>>();
	    // 循环工作表Sheet  
//	    for(int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++){
//	    	XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);  
//	    	if(xssfSheet == null){  
		XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);  
//	    	}  
	        
	    	// 循环行Row   
	    	for(int rowNum = 0; rowNum <= xssfSheet.getLastRowNum(); rowNum++ ){
	    		LinkedList<String> ls=new LinkedList<String>();
				lss.add(ls);
	    		XSSFRow xssfRow = xssfSheet.getRow( rowNum);  
	    		if(xssfRow == null){  
	    			continue;
	    		}  
	          
	    		// 循环列Cell     
	    		for(int cellNum = 0; cellNum <= xssfRow.getLastCellNum(); cellNum++){  
	    			XSSFCell xssfCell = xssfRow.getCell( cellNum);  
	    			if(xssfCell == null){  
	    				ls.add(""); 
	    				continue;
	    			}  
	    			//System.out.print("   "+getValue(xssfCell)); 
	    			ls.add(getValue(xssfCell));
	    		}  
	    		//System.out.println();  
	    	}  
//	    }
	    	is.close();
	    return lss;
	}
	
	//	读取xlsx的一列
	public static List<String> readXlxsColumn(String xlsxPath, int sheetId, int ColumnId) throws IOException {
		
		InputStream is = new FileInputStream(xlsxPath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		List<String> lss=new LinkedList<String>();
    	XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(sheetId);  
    	// 循环行Row   
    	for(int rowNum = 1; rowNum <= xssfSheet.getLastRowNum(); rowNum++){
    		XSSFRow xssfRow = xssfSheet.getRow(rowNum);  
    		if(xssfRow == null){  
    			continue;
    		}  
			XSSFCell xssfCell = xssfRow.getCell(ColumnId);  
			if(xssfCell == null){  
				lss.add("");
			} else {
				lss.add(getValue(xssfCell));
			}
    	}  
//	    xssfWorkbook.close();
	    is.close();
	    return lss;
	}

	//	读取xlsx的一个工作表
	public static List<List<String>> readXlsx(String xlsxPath, String sheetTitle) throws IOException {
		List<List<String>> lss=new LinkedList<List<String>>();
		InputStream is = new FileInputStream(xlsxPath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		XSSFSheet hssfSheet = xssfWorkbook.getSheet(sheetTitle);  
		// 循环行Row
		for(int rowNum = 0; rowNum <= hssfSheet.getLastRowNum(); rowNum++){  
			LinkedList<String> ls=new LinkedList<String>();
			lss.add(ls);
			XSSFRow hssfRow = hssfSheet.getRow( rowNum);  
			if(hssfRow == null){  
				continue;
			}
			// 循环列Cell
			for(int cellNum = 0; cellNum <= hssfRow.getLastCellNum(); cellNum++){  
				XSSFCell hssfCell = hssfRow.getCell( cellNum);  
				if(hssfCell == null){
					ls.add("");
					continue;
				}
				ls.add(getValue(hssfCell));
			}
		}
		is.close();
		return lss;
	}
	
	//	读取xlxs的某几列
	public static List<String[]> readXlxsColumns(String xlsxPath, int sheetId, int[] columnIds) throws IOException {
		
		InputStream is = new FileInputStream(xlsxPath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);  
		List<String[]> lss=new LinkedList<String[]>();
    	XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(sheetId);  
    	// 循环行Row   
    	for(int rowNum = 1; rowNum <= xssfSheet.getLastRowNum(); rowNum++){
    		XSSFRow xssfRow = xssfSheet.getRow(rowNum);  
    		if(xssfRow == null){  
    			continue;
    		}
    		String[] strs=new String[columnIds.length];
    		for(int i=0;i<columnIds.length;i++ ) {
    			int id=columnIds[i];
    			XSSFCell xssfCell = xssfRow.getCell(id);
    			if(xssfCell == null){  
    				strs[i]="";
    			} else {
    				strs[i]=getValue(xssfCell);
    			}
    		}
			lss.add(strs);
    	}
//	    xssfWorkbook.close();
    	is.close();
	    return lss;
	}

	
	public static void exportExcel(String title, String headerStr,
			List<String[]> dataset, OutputStream out) {
		String[] headers = headerStr.split("\t");
		exportExcel(title, headers, dataset, out);
	}
	
    public static void exportExcel(String title, List<String[]> dataset, OutputStream out) {
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet(title);
        // 产生表格标题行
        String[] headers=new String[]{"contents"};
        HSSFRow row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }

        // 遍历集合数据，产生数据行
        int index = 0;
        for (String[] strs:dataset) {
            index++;
            row = sheet.createRow(index);
            for(int j=0;j<strs.length;j++) {
            	String str = strs[j];
	            HSSFCell cell = row.createCell(j);
	            try {
	                if (str != null) {
	                    Pattern p = Pattern.compile("^//d+(//.//d+)?$");
	                    Matcher matcher = p.matcher(str);
	                    if (matcher.matches()) {
	                        cell.setCellValue(Double.parseDouble(str));
	                    } else {
	                        HSSFRichTextString richString = new HSSFRichTextString(str);
	                        cell.setCellValue(richString);
	                    }
	                } else {
	                	cell.setCellValue("");
	                }
	            } catch (Exception e) {
	                // TODO Auto-generated catch block
	                e.printStackTrace();
	            } finally {
	                // 清理资源
	            }
            }
        }
        try {
            workbook.write(out);
//            workbook.close();
            out.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }
    
    public static void exportExcel(String title, String[] headers,
    		List<String[]> dataset, OutputStream out) {
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet(title);
        // 产生表格标题行
        HSSFRow row = sheet.createRow(0);
        for (short i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }

        // 遍历集合数据，产生数据行
        int index = 0;
        for (String[] strs:dataset) {
            index++;
            row = sheet.createRow(index);
            for(int j=0;j<strs.length;j++) {
            	String str = strs[j];
	            HSSFCell cell = row.createCell(j);
	            try {
	                if (str != null) {
	                	try {
	                		double douValue = Double.parseDouble(str);
	                		cell.setCellValue(douValue);
	                	} catch (NumberFormatException nfe) {
	                		HSSFRichTextString richString = new HSSFRichTextString(str);
	                        cell.setCellValue(richString);
	                	}
//	                	Pattern p = Pattern.compile("^//d+(//.//d+)?$");
//	                    Matcher matcher = p.matcher(str);
//	                    if (matcher.matches()) {
//	                        cell.setCellValue(Double.parseDouble(str));
//	                    } else {
//	                        HSSFRichTextString richString = new HSSFRichTextString(str);
//	                        cell.setCellValue(richString);
//	                    }
	                }
	            } catch (Exception e) {
	                // TODO Auto-generated catch block
	                e.printStackTrace();
	            } finally {
	                // 清理资源
	            }
            }
        }
        try {
            workbook.write(out);
//            workbook.close();
            out.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }
    
    public static void exportExcel(String title, String[] headers,
            Collection<T> dataset, OutputStream out, String pattern) {
        // 声明一个工作薄
        HSSFWorkbook workbook = new HSSFWorkbook();
        // 生成一个表格
        HSSFSheet sheet = workbook.createSheet(title);
        // 设置表格默认列宽度为15个字节
        sheet.setDefaultColumnWidth((short) 15);
        // 生成一个样式
        HSSFCellStyle style = workbook.createCellStyle();
        // 设置这些样式
        style.setFillForegroundColor(HSSFColor.SKY_BLUE.index);
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 生成一个字体
        HSSFFont font = workbook.createFont();
        font.setColor(HSSFColor.VIOLET.index);
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 把字体应用到当前的样式
        style.setFont(font);
        // 生成并设置另一个样式
        HSSFCellStyle style2 = workbook.createCellStyle();
        style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
        style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 生成另一个字体
        HSSFFont font2 = workbook.createFont();
        font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
        // 把字体应用到当前的样式
        style2.setFont(font2);

        // 声明一个画图的顶级管理器
        HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
        // 定义注释的大小和位置,详见文档
        HSSFComment comment = patriarch.createComment(new HSSFClientAnchor(0,
                0, 0, 0, (short) 4, 2, (short) 6, 5));
        // 设置注释内容
        comment.setString(new HSSFRichTextString("可以在POI中添加注释！"));
        // 设置注释作者，当鼠标移动到单元格上是可以在状态栏中看到该内容.
        comment.setAuthor("leno");

        // 产生表格标题行
        HSSFRow row = sheet.createRow(0);
        for (short i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            cell.setCellStyle(style);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }

        // 遍历集合数据，产生数据行
        Iterator<T> it = dataset.iterator();
        int index = 0;
        while (it.hasNext()) {
            index++;
            row = sheet.createRow(index);
            T t = (T) it.next();
            // 利用反射，根据javabean属性的先后顺序，动态调用getXxx()方法得到属性值
            Field[] fields = t.getClass().getDeclaredFields();
            for (short i = 0; i < fields.length; i++) {
                HSSFCell cell = row.createCell(i);
                cell.setCellStyle(style2);
                Field field = fields[i];
                String fieldName = field.getName();
                String getMethodName = "get"
                        + fieldName.substring(0, 1).toUpperCase()
                        + fieldName.substring(1);
                try {
                    Class tCls = t.getClass();
                    Method getMethod = tCls.getMethod(getMethodName,
                            new Class[] {});
                    Object value = getMethod.invoke(t, new Object[] {});
                    // 判断值的类型后进行强制类型转换
                    String textValue = null;
                    // if (value instanceof Integer) {
                    // int intValue = (Integer) value;
                    // cell.setCellValue(intValue);
                    // } else if (value instanceof Float) {
                    // float fValue = (Float) value;
                    // textValue = new HSSFRichTextString(
                    // String.valueOf(fValue));
                    // cell.setCellValue(textValue);
                    // } else if (value instanceof Double) {
                    // double dValue = (Double) value;
                    // textValue = new HSSFRichTextString(
                    // String.valueOf(dValue));
                    // cell.setCellValue(textValue);
                    // } else if (value instanceof Long) {
                    // long longValue = (Long) value;
                    // cell.setCellValue(longValue);
                    // }
                    if (value instanceof Boolean) {
                        boolean bValue = (Boolean) value;
                        textValue = "男";
                        if (!bValue) {
                            textValue = "女";
                        }
                    } else if (value instanceof Date) {
                        Date date = (Date) value;
                        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
                        textValue = sdf.format(date);
                    } else if (value instanceof byte[]) {
                        // 有图片时，设置行高为60px;
                        row.setHeightInPoints(60);
                        // 设置图片所在列宽度为80px,注意这里单位的一个换算
                        sheet.setColumnWidth(i, (short) (35.7 * 80));
                        // sheet.autoSizeColumn(i);
                        byte[] bsValue = (byte[]) value;
                        HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0,
                                1023, 255, (short) 6, index, (short) 6, index);
                        anchor.setAnchorType(2);
                        patriarch.createPicture(anchor, workbook.addPicture(
                                bsValue, HSSFWorkbook.PICTURE_TYPE_JPEG));
                    } else {
                        // 其它数据类型都当作字符串简单处理
                        textValue = value.toString();
                    }
                    // 如果不是图片数据，就利用正则表达式判断textValue是否全部由数字组成
                    if (textValue != null) {
                        Pattern p = Pattern.compile("^//d+(//.//d+)?$");
                        Matcher matcher = p.matcher(textValue);
                        if (matcher.matches()) {
                            // 是数字当作double处理
                            cell.setCellValue(Double.parseDouble(textValue));
                        } else {
                            HSSFRichTextString richString = new HSSFRichTextString(
                                    textValue);
                            HSSFFont font3 = workbook.createFont();
                            font3.setColor(HSSFColor.BLUE.index);
                            richString.applyFont(font3);
                            cell.setCellValue(richString);
                        }
                    }
                } catch (SecurityException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (NoSuchMethodException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (IllegalArgumentException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } finally {
                    // 清理资源
                }
            }
        }
        try {
            workbook.write(out);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    
	//	获取一个 xls 单元格的文本
	@SuppressWarnings("static-access")  
	private static String getValue(HSSFCell hssfCell){  
		if(hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN){  
			return String.valueOf( hssfCell.getBooleanCellValue());  
		}else if(hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC){  
			return String.valueOf( hssfCell.getNumericCellValue());  
		}else{
			String str = String.valueOf( hssfCell.getStringCellValue());
			if(str!=null && !"".equals(str)) {
				return str.trim();
			}
			return str;  
		}  
	}

	//	获取一个 xlsx 单元格的文本
	@SuppressWarnings("static-access")  
	private static String getValue(XSSFCell xssfCell){  
		if(xssfCell.getCellType() == xssfCell.CELL_TYPE_BOOLEAN){  
			return String.valueOf( xssfCell.getBooleanCellValue());  
	    } else if(xssfCell.getCellType() == xssfCell.CELL_TYPE_NUMERIC){
	    	double dv = xssfCell.getNumericCellValue();
	    	double ddv = dv * 1.0;
	    	int inte = (int)ddv;
			double dif = ddv - inte;
			if(dif < 1e-6) {
				return String.valueOf(inte);
			} else {
				return String.valueOf(ddv);
			}
	    } else {  
	    	return String.valueOf( xssfCell.getStringCellValue());  
	    }  
	}

}
