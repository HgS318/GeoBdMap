package whu.eres.cartolab.db.office;

import java.io.*;
import java.util.*;

import whu.eres.cartolab.db.DbUse;

import org.apache.poi.hwpf.*;
import org.apache.poi.hwpf.usermodel.*;
import org.apache.poi.xwpf.usermodel.*;

/**
 * Created by Administrator on 2017/9/4 0004.
 */
public class WordDemo01 {



    public static String docPath = "D:\\Lab\\Toponym\\temp\\test1.doc";
    public static String outPath = "D:\\Lab\\Toponym\\temp\\testout.doc";
    public static String docxPath = "D:\\Lab\\Toponym\\temp\\test1.docx";
    public static String outxPath = "D:\\Lab\\Toponym\\temp\\testout.docx";


    public static void main(String[] args) throws Exception {
        // TODO Auto-generated method stub
//        readDocTable(docPath);
//        readDocTable(docxPath);


    }


    public static void readDocTable(String wordPath) throws Exception {
        String suf = DbUse.getFileSuffix(wordPath);
        if(".doc".equalsIgnoreCase(suf)) {
            testReadDocTables(wordPath);
        } else if(".docx".equalsIgnoreCase(suf)) {
            testReadDocxTables(wordPath);
        } else {
            System.out.println("Not a word file!!!");
        }
    }

    public static void testReadDocTables(String docPath) throws Exception {
        InputStream is = new FileInputStream(docPath);
        HWPFDocument doc = new HWPFDocument(is);
        //输出书签信息
//	      this.printInfo(doc.getBookmarks());
        Range range = doc.getRange();
//	      this.printInfo(range);
        //读表格
        readTable(range);
        System.out.println();
        //读列表
//	      this.readList(range);
        closeStream(is);
    }

    public static Map<String, String> readZiguiDocsTable(String docxPath) throws Exception {
        InputStream is = new FileInputStream(docxPath);
        XWPFDocument doc = new XWPFDocument(is);
//		List<XWPFParagraph> paras = doc.getParagraphs();
//		for (XWPFParagraph para : paras) {
//			//	当前段落的属性
//			//	CTPPr pr = para.getCTP().getPPr();
//			System.out.println(para.getText());
//		}
        //获取文档中所有的表格
        List<XWPFTable> tables = doc.getTables();
        List<XWPFTableRow> rows;
        List<XWPFTableCell> cells;
        XWPFTable table = tables.get(1);
        rows = table.getRows();
        Map<String, String> map = new HashMap<String, String>();
        for(int i = 0; i < rows.size(); i++) {
            XWPFTableRow row = rows.get(i);
            switch(i) {
                case 0:
                    putKeyValue(row, 0, map);
                    putKeyValue(row, 2, map);
                    break;
                case 1:case 3:case 4:
                    putKeyValue(row, 1, map);
                    break;
                case 2:case 6:case 7:
                    putKeyValue(row, 1, map);
                    putKeyValue(row, 3, map);
                    break;
                case 5:case 8:case 15:
                    putKeyValue(row, 0, map);
                    putKeyValue(row, 2, map);
                    putKeyValue(row, 4, map);
                    break;
                default:
                    putKeyValue(row, 0, map);
                    break;
            }
        }
        closeStream(is);
        return map;
    }

    public static void putKeyValue(XWPFTableRow row, int index, Map map) {
        String str1 = row.getCell(index).getText();
        String keyStr  = str1.replace(" ", "");
        XWPFTableCell valcell = row.getCell(index + 1);
        List<XWPFParagraph> phs = valcell.getParagraphs();
        if(phs.size() == 1) {
            map.put(keyStr, phs.get(0).getText());
        } else {
            StringBuffer sb = new StringBuffer();
            for (XWPFParagraph ph : phs) {
                sb.append(ph.getText() + "<br/>");
            }
            String valStr = sb.toString();
            map.put(keyStr, valStr);
        }
    }

    /**
     * 通过XWPFDocument对内容进行访问。对于XWPF文档而言，用这种方式进行读操作更佳。
     * @throws Exception
     */
    public static void testReadDocxTables(String docxPath) throws Exception {
        InputStream is = new FileInputStream(docxPath);
        XWPFDocument doc = new XWPFDocument(is);
//		List<XWPFParagraph> paras = doc.getParagraphs();
//		for (XWPFParagraph para : paras) {
//			//	当前段落的属性
//			//	CTPPr pr = para.getCTP().getPPr();
//			System.out.println(para.getText());
//		}
        //获取文档中所有的表格
        List<XWPFTable> tables = doc.getTables();
        List<XWPFTableRow> rows;
        List<XWPFTableCell> cells;
        for (XWPFTable table : tables) {
            //	表格属性
            //	CTTblPr pr = table.getCTTbl().getTblPr();
            //	获取表格对应的行
            rows = table.getRows();
            for (XWPFTableRow row : rows) {
                //获取行对应的单元格
                cells = row.getTableCells();
                for (XWPFTableCell cell : cells) {
                    String str = cell.getText();
                    List<XWPFParagraph> phs = cell.getParagraphs();
                    for(XWPFParagraph ph : phs) {

                        System.out.print(ph.getText() + "\t");
                    }
                    System.out.println();
                }
            }
        }
        System.out.println();
        closeStream(is);
    }


    public void testReadByDoc() throws Exception {
        InputStream is = new FileInputStream(docPath);
        HWPFDocument doc = new HWPFDocument(is);
        //输出书签信息
//      printInfo(doc.getBookmarks());
        //输出文本
//      System.out.println(doc.getDocumentText());
        Range range = doc.getRange();
//    insertInfo(range);
//      this.printInfo(range);
        //读表格
        readTable(range);
        //读列表
//      this.readList(range);
        //删除range
//      Range r = new Range(2, 5, doc);
//      r.delete();//在内存中进行删除，如果需要保存到文件中需要再把它写回文件
        //把当前HWPFDocument写到输出流中
//      doc.write(new FileOutputStream(outPath));
        closeStream(is);
    }

    /**
     * 通过XWPFDocument对内容进行访问。对于XWPF文档而言，用这种方式进行读操作更佳。
     * @throws Exception
     */
    public void testReadByDocx() throws Exception {
        InputStream is = new FileInputStream(docxPath);
        XWPFDocument doc = new XWPFDocument(is);
        List<XWPFParagraph> paras = doc.getParagraphs();
        for (XWPFParagraph para : paras) {
            //	当前段落的属性
            //	CTPPr pr = para.getCTP().getPPr();
            System.out.println(para.getText());
        }
        //获取文档中所有的表格
        List<XWPFTable> tables = doc.getTables();
        List<XWPFTableRow> rows;
        List<XWPFTableCell> cells;
        for (XWPFTable table : tables) {
            //	表格属性
            //	CTTblPr pr = table.getCTTbl().getTblPr();
            //	获取表格对应的行
            rows = table.getRows();
            for (XWPFTableRow row : rows) {
                //获取行对应的单元格
                cells = row.getTableCells();
                for (XWPFTableCell cell : cells) {
                    System.out.println(cell.getText());;
                }
            }
        }
        closeStream(is);
    }

    /**
     * 关闭输入流
     * @param is
     */
    private static void closeStream(InputStream is) {
        if (is != null) {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 输出书签信息
     * @param bookmarks
     */
    private static void printInfo(Bookmarks bookmarks) {
        int count = bookmarks.getBookmarksCount();
        System.out.println("书签数量：" + count);
        Bookmark bookmark;
        for (int i=0; i<count; i++) {
            bookmark = bookmarks.getBookmark(i);
            System.out.println("书签" + (i+1) + "的名称是：" + bookmark.getName());
            System.out.println("开始位置：" + bookmark.getStart());
            System.out.println("结束位置：" + bookmark.getEnd());
        }
    }

    /**
     * 读表格
     * 每一个回车符代表一个段落，所以对于表格而言，每一个单元格至少包含一个段落，每行结束都是一个段落。
     * @param range
     */
    private static void readTable(Range range) {
        //遍历range范围内的table。
        TableIterator tableIter = new TableIterator(range);
        Table table;
        TableRow row;
        TableCell cell;
        while (tableIter.hasNext()) {
            table = tableIter.next();
            int rowNum = table.numRows();
            for (int j=0; j<rowNum; j++) {
                row = table.getRow(j);
                int cellNum = row.numCells();
                for (int k=0; k<cellNum; k++) {
                    cell = row.getCell(k);
                    //输出单元格的文本
                    System.out.println(cell.text().trim());
                }
            }
        }
    }

    /**
     * 读列表
     * @param range
     */
    private void readList(Range range) {
        int num = range.numParagraphs();
        Paragraph para;
        for (int i=0; i<num; i++) {
            para = range.getParagraph(i);
            if (para.isInList()) {
                System.out.println("list: " + para.text());
            }
        }
    }

    /**
     * 输出Range
     * @param range
     */
    private void printInfo(Range range) {
        //获取段落数
        int paraNum = range.numParagraphs();
        System.out.println(paraNum);
        for (int i=0; i<paraNum; i++) {
//       this.insertInfo(range.getParagraph(i));
            System.out.println("段落" + (i+1) + "：" + range.getParagraph(i).text());
            if (i == (paraNum-1)) {
                this.insertInfo(range.getParagraph(i));
            }
        }
        int secNum = range.numSections();
        System.out.println(secNum);
        Section section;
        for (int i=0; i<secNum; i++) {
            section = range.getSection(i);
            System.out.println(section.getMarginLeft());
            System.out.println(section.getMarginRight());
            System.out.println(section.getMarginTop());
            System.out.println(section.getMarginBottom());
            System.out.println(section.getPageHeight());
            System.out.println(section.text());
        }
    }

    /**
     * 插入内容到Range，这里只会写到内存中
     * @param range
     */
    private static void insertInfo(Range range) {
        range.insertAfter("Hello");
    }

}
