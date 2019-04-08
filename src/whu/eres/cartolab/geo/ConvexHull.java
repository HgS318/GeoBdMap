package whu.eres.cartolab.geo;

public class ConvexHull {

    //蛮力法解决凸包问题，返回点集合中凸多边形的点集合
    public static Point[] getConvexPoints(Point[] A) {
        Point[] result = new Point[A.length];
        int len = 0;  //用于计算最终返回结果中是凸包中点的个数
        for (int i = 0; i < A.length; i++) {
            for (int j = 0; j < A.length; j++) {
                if (j == i)     //除去选中作为确定直线的第一个点
                    continue;

                double[] judge = new double[A.length];   //存放点到直线距离所使用判断公式的结果

                for (int k = 0; k < A.length; k++) {
                    double a = A[j].getY() - A[i].getY();
                    double b = A[i].getX() - A[j].getX();
                    double c = (A[i].getX()) * (A[j].getY()) - (A[i].getY()) * (A[j].getX());

                    judge[k] = a * (A[k].getX()) + b * (A[k].getY()) - c;  //根据公式计算具体判断结果
                }

                if (JudgeArray(judge)) {  // 如果点均在直线的一边,则相应的A[i]是凸包中的点
                    result[len++] = A[i];
                    break;
                }
            }
        }
        Point[] result1 = new Point[len];
        for (int m = 0; m < len; m++)
            result1[m] = result[m];
        return result1;
    }

    public static double[] getConvexPolygon(double[] coords) {
        int doulen = coords.length;
        int len = doulen / 2;
        Point[] points = new Point[len];
        for(int i = 0; i < len; i++) {
            points[i] = new Point(coords[2 * i], coords[2 * i + 1]);
        }
        Point[] convexPoints = getConvexPoints(points);
        ClockwiseSortPoints(convexPoints);
        double[] polygon = new double[convexPoints.length * 2];
        for (int i = 0; i < convexPoints.length; i++) {
            polygon[2 * i] = convexPoints[i].x;
            polygon[2 * i + 1] = convexPoints[i].y;
        }
        return polygon;
    }

    //判断数组中元素是否全部大于等于0或者小于等于0，如果是则返回true，否则返回false
    public static boolean JudgeArray(double[] Array) {
        boolean judge = false;
        int len1 = 0, len2 = 0;

        for (int i = 0; i < Array.length; i++) {
            if (Array[i] >= 0)
                len1++;
        }
        for (int j = 0; j < Array.length; j++) {
            if (Array[j] <= 0)
                len2++;
        }

        if (len1 == Array.length || len2 == Array.length)
            judge = true;
        return judge;
    }

    public double[] ClockwiseSortPoints(double[] coords) {
        int coordLen = coords.length;
        int len = coordLen / 2;
        Point[] points = new Point[len];
        for (int i = 0; i < len; i++) {
            points[i] = new Point(coords[2 * i], coords[2 * i + 1]);
        }
        ClockwiseSortPoints(points);
        double[] newCoords = new double[coordLen];
        for (int i = 0; i < len; i++) {
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


    public static double[] test() {

        double[] testInput = new double[]{
                114.30714975012594, 30.55828398086774,
                114.30897030458097, 30.548247963710264,
                114.32541676841711, 30.549449385907725,
                114.3223583588507, 30.552442051057476,
                114.32426703348303, 30.55385215969005,
                114.31669379342348, 30.550881817015252,
                114.31349099292433, 30.555069967907944,
                114.3075340892401, 30.553069019500008,
                114.31699709010945, 30.557553847743783,
                114.30294013420104, 30.534546337193998,
                114.3124816209211, 30.558566505646578,
                114.31049958886422, 30.545483703159586,
                114.31451581308741, 30.548883096489547,
                114.31579517979472, 30.542130034821746,
                114.30488219345933, 30.554675916764136
        };
        int doulen = testInput.length;
        int len = doulen / 2;
        Point[] points = new Point[len];
        for (int i = 0; i < len; i++) {
            points[i] = new Point(testInput[2 * i], testInput[2 * i + 1]);
        }
        Point[] result = getConvexPoints(points);
        ClockwiseSortPoints(result);
        System.out.println("集合A中满足凸包的点集为：");
        double[] polygon = new double[result.length * 2];
        for (int i = 0; i < result.length; i++) {
            polygon[2 * i] = result[i].x;
            polygon[2 * i + 1] = result[i].y;
            System.out.println("(" + result[i].getX() + "," + result[i].getY() + ")");
        }
        return polygon;
    }

    public static void orgTest() {

        Point[] A = new Point[8];
        A[0] = new Point(1, 0);
        A[1] = new Point(0, 1);
        A[2] = new Point(0, -1);
        A[3] = new Point(-1, 0);
        A[4] = new Point(2, 0);
        A[5] = new Point(0, 2);
        A[6] = new Point(0, -2);
        A[7] = new Point(-2, 0);

        Point[] result = getConvexPoints(A);
        System.out.println("集合A中满足凸包的点集为：");
        for (int i = 0; i < result.length; i++) {
            System.out.println("(" + result[i].getX() + "," + result[i].getY() + ")");
        }
    }

    public static void main(String[] args) {
        orgTest();
    }
}

