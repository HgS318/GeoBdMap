package whu.eres.cartolab.geo;

//import java.awt.Point;
import java.util.*;

public class ConvexPolygon01 {

    public static Map<Integer, ArrayList<Point>> readData(){
        Scanner s = new Scanner(System.in);
        String input = null;
        Map<Double, ArrayList<Point>> pts = new HashMap<Double, ArrayList<Point>>();

        if(s.hasNext()){
            input = s.nextLine();
        }

        StringTokenizer st = new StringTokenizer(input, ",;");
        st.nextToken();
        while(st.hasMoreTokens()){
            Double x = Double.parseDouble(st.nextToken());
            Double y = Double.parseDouble(st.nextToken());
            ArrayList<Point> v = pts.get(x) == null ? new ArrayList<Point>() : pts.get(x);
            v.add(new Point(x, y));
            pts.put(x, v);
        }

        int key = 0;
        Map<Integer, ArrayList<Point>> indexPts = new HashMap<Integer, ArrayList<Point>>();
        for(java.util.Map.Entry entry : pts.entrySet()){
            indexPts.put(key, (ArrayList<Point>)entry.getValue());
            key++;
        }

        return indexPts;
    }

    public static Map<Integer, ArrayList<Point>> createDataset(double[] inputs){

        Map<Double, ArrayList<Point>> pts = new HashMap<Double, ArrayList<Point>>();
        for(int i = 0; i < inputs.length; i += 2) {
            double x = inputs[i];
            double y = inputs[i + 1];
            ArrayList<Point> v = pts.get(x) == null ? new ArrayList<Point>() : pts.get(x);
            v.add(new Point(x, y));
            pts.put(x, v);
        }

        int key = 0;
        Map<Integer, ArrayList<Point>> indexPts = new HashMap<Integer, ArrayList<Point>>();
        for(java.util.Map.Entry entry : pts.entrySet()){
            indexPts.put(key, (ArrayList<Point>)entry.getValue());
            key++;
        }

        return indexPts;
    }

    public static double[] createPolygon(double[] inputs) {
        ArrayList<Point> ptOkList = new ArrayList<Point>();
        Map<Integer, ArrayList<Point>> pts = createDataset(inputs);
        int i = 0;
        Point startUp = pts.get(0).get(0);
        Point startBottom = pts.get(0).get(0);
        Point endUp = pts.get(pts.size() - 1).get(0);
        Point endBottom = pts.get(pts.size() - 1).get(0);
        for(i = 0; i < pts.get(0).size(); i++){
            if(pts.get(0).get(i).y > startUp.y){
                startUp = pts.get(0).get(i);
            }
            if(pts.get(0).get(i).y < startBottom.y){
                startBottom = pts.get(0).get(i);
            }
        }
        for(i = 0; i < pts.get(pts.size() - 1).size(); i++){
            if(pts.get(pts.size() - 1).get(i).y > startUp.y){
                endUp = pts.get(pts.size() - 1).get(i);
            }
            if(pts.get(pts.size() - 1).get(i).y < startBottom.y){
                endBottom = pts.get(pts.size() - 1).get(i);
            }
        }

        Point startPt = startUp;
        int index = 0;
        Point p = startUp;
        while(true){
            double k = -Double.MAX_VALUE;
            for(i = index + 1; i < pts.size(); i++){
                //int index_ = index;
                for(int j = 0; j < pts.get(i).size(); j++){
                    Point temp = pts.get(i).get(j);
                    double kk = (temp.y - startPt.y) / (temp.x - startPt.x);
                    if(kk > k){
                        p = temp;
                        k = kk;
                        index = i;
                    }
                }
            }
            startPt = p;
            if(startPt == endUp){
                break;
            }
            ptOkList.add(startPt);
        }

        startPt = endBottom;
        index = pts.size() - 1;
        p = endBottom;
        while(true){
            double k = -Double.MAX_VALUE;
            for(i = index - 1; i >= 0; i--){
                //int index_ = index;
                for(int j = 0; j < pts.get(i).size(); j++){
                    Point temp = pts.get(i).get(j);
                    double kk = (temp.y - startPt.y) / (temp.x - startPt.x);
                    if(kk > k){
                        p = temp;
                        k = kk;
                        index = i;
                    }
                }
            }

            startPt = p;
            if(startPt == startBottom){
                break;
            }
            ptOkList.add(startPt);
        }

        for(i = 0; i < pts.get(0).size(); i++){
            ptOkList.add(pts.get(0).get(i));
        }
        for(i = 0; i < pts.get(pts.size() - 1).size(); i++){
            ptOkList.add(pts.get(pts.size() - 1).get(i));
        }

        System.out.print(ptOkList.size());
        for(i = 0; i < ptOkList.size(); i++){
            System.out.print(";" + ptOkList.get(i).x + "," + ptOkList.get(i).y);
        }
        int len = ptOkList.size();
        Point[] ptOkPoints = new Point[len];
        for(i = 0; i < len; i++) {
            ptOkPoints[i] = ptOkList.get(i);
        }
        ClockwiseSortPoints(ptOkPoints);
        double[] polygon = new double[len * 2];
        for(i = 0; i < len; i++) {
            polygon[2 * i] = ptOkPoints[i].x;
            polygon[2 * i + 1] = ptOkPoints[i].y;
        }
        return polygon;
    }

    public static double[] test() {

        double[] testInput = new double[] {
                114.30714975012594,30.55828398086774,
                114.30897030458097, 30.548247963710264,
                114.32541676841711, 30.549449385907725,
                114.3223583588507,30.552442051057476,
                114.32426703348303, 30.55385215969005,
                114.31669379342348, 30.550881817015252,
                114.31349099292433, 30.555069967907944,
                114.3075340892401, 30.553069019500008,
                114.31699709010945, 30.557553847743783,
                114.30294013420104, 30.534546337193998,
                114.3124816209211,30.558566505646578,
                114.31049958886422,30.545483703159586,
                114.31451581308741, 30.548883096489547,
                114.31579517979472, 30.542130034821746,
                114.30488219345933, 30.554675916764136
        };
        return createPolygon(testInput);
    }

    public static void orgTest() {

        ArrayList<Point> ptOkList = new ArrayList<Point>();
        Map<Integer, ArrayList<Point>> pts = readData();//读取数据并存储到map中

        int i = 0;
        Point startUp = pts.get(0).get(0);
        Point startBottom = pts.get(0).get(0);
        Point endUp = pts.get(pts.size() - 1).get(0);
        Point endBottom = pts.get(pts.size() - 1).get(0);
        for(i = 0; i < pts.get(0).size(); i++){
            if(pts.get(0).get(i).y > startUp.y){
                startUp = pts.get(0).get(i);
            }
            if(pts.get(0).get(i).y < startBottom.y){
                startBottom = pts.get(0).get(i);
            }
        }
        for(i = 0; i < pts.get(pts.size() - 1).size(); i++){
            if(pts.get(pts.size() - 1).get(i).y > startUp.y){
                endUp = pts.get(pts.size() - 1).get(i);
            }
            if(pts.get(pts.size() - 1).get(i).y < startBottom.y){
                endBottom = pts.get(pts.size() - 1).get(i);
            }
        }

        Point startPt = startUp;
        int index = 0;
        Point p = startUp;
        while(true){
            double k = -Double.MAX_VALUE;
            for(i = index + 1; i < pts.size(); i++){
                //int index_ = index;
                for(int j = 0; j < pts.get(i).size(); j++){
                    Point temp = pts.get(i).get(j);
                    double kk = (temp.y - startPt.y) / (temp.x - startPt.x);
                    if(kk > k){
                        p = temp;
                        k = kk;
                        index = i;
                    }
                }
            }

            startPt = p;
            if(startPt == endUp){
                break;
            }
            ptOkList.add(startPt);
        }

        startPt = endBottom;
        index = pts.size() - 1;
        p = endBottom;
        while(true){
            double k = -Double.MAX_VALUE;
            for(i = index - 1; i >= 0; i--){
                //int index_ = index;
                for(int j = 0; j < pts.get(i).size(); j++){
                    Point temp = pts.get(i).get(j);
                    double kk = (temp.y - startPt.y) / (temp.x - startPt.x);
                    if(kk > k){
                        p = temp;
                        k = kk;
                        index = i;
                    }
                }
            }

            startPt = p;
            if(startPt == startBottom){
                break;
            }
            ptOkList.add(startPt);
        }

        for(i = 0; i < pts.get(0).size(); i++){
            ptOkList.add(pts.get(0).get(i));
        }
        for(i = 0; i < pts.get(pts.size() - 1).size(); i++){
            ptOkList.add(pts.get(pts.size() - 1).get(i));
        }

        System.out.print(ptOkList.size());
        for(i = 0; i < ptOkList.size(); i++){
            System.out.print(";" + ptOkList.get(i).x + "," + ptOkList.get(i).y);
        }
    }

    public double[] ClockwiseSortPoints(double[] coords) {
        int coordLen = coords.length;
        int len = coordLen / 2;
        Point[] points = new Point[len];
        for(int i = 0; i < len; i++) {
            points[i] = new Point(coords[2 * i], coords[2 * i + 1]);
        }
        ClockwiseSortPoints(points);
        double[] newCoords = new double[coordLen];
        for(int i = 0; i < len; i++) {
            newCoords[2 * i] = points[i].x;
            newCoords[2 * i + 1] = points[i].y;
        }
        return newCoords;
    }

    public static void ClockwiseSortPoints(Point[] vPoints) {
        //计算重心
        Point center = new Point();
        double X = 0, Y = 0;
        for (int i = 0; i < vPoints.length; i++) {
            X += vPoints[i].x;
            Y += vPoints[i].y;
        }
        center.x = X / vPoints.length;
        center.y = Y / vPoints.length;
        for (int i = 0; i < vPoints.length - 1; i++) {
            for (int j = 0; j < vPoints.length - i - 1; j++) {
                if (PointCmp(vPoints[j], vPoints[j + 1], center)) {
                    Point tmp = vPoints[j];
                    vPoints[j] = vPoints[j + 1];
                    vPoints[j + 1] = tmp;
                }
            }
        }
    }

    //若点a大于点b,即点a在点b顺时针方向,返回true,否则返回false
    static boolean PointCmp(Point a, Point b, Point center) {
        if (a.x >= 0 && b.x < 0)
            return true;
        if (a.x == 0 && b.x == 0)
            return a.y > b.y;
        //向量OA和向量OB的叉积
        double det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
        if (det < 0)
            return true;
        if (det > 0)
            return false;
        //向量OA和向量OB共线，以距离判断大小
        double d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
        double d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
        return d1 > d2;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    public static void main(String[] args) {
//        orgTest();
        test();
    }

}

class Point {
    public double x, y;

    public Point() {
        this.x = 0.0;
        this.y = 0.0;
    }

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public String toString() {
        return x + ", " + y;
    }

}