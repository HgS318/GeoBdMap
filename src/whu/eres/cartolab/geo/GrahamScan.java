package whu.eres.cartolab.geo;

import java.util.*;


public class GrahamScan {

    protected static enum Turn { CLOCKWISE, COUNTER_CLOCKWISE, COLLINEAR }

    protected static boolean areAllCollinear(List<Point> points) {
        if(points.size() < 2) {
            return true;
        }
        final Point a = points.get(0);
        final Point b = points.get(1);
        for(int i = 2; i < points.size(); i++) {
            Point c = points.get(i);
            if(getTurn(a, b, c) != Turn.COLLINEAR) {
                return false;
            }
        }
        return true;
    }

    public static List<Point> getConvexHull(int[] xs, int[] ys) throws IllegalArgumentException {

        if(xs.length != ys.length) {
            throw new IllegalArgumentException("xs and ys don't have the same size");
        }

        List<Point> points = new ArrayList<Point>();

        for(int i = 0; i < xs.length; i++) {
            points.add(new Point(xs[i], ys[i]));
        }

        return getConvexHull(points);
    }

    public static List<Point> getConvexHull(List<Point> points) throws IllegalArgumentException {

        List<Point> sorted = new ArrayList<Point>(getSortedPointSet(points));

        if(sorted.size() < 3) {
            throw new IllegalArgumentException("can only create a convex hull of 3 or more unique points");
        }

        if(areAllCollinear(sorted)) {
            throw new IllegalArgumentException("cannot create a convex hull from collinear points");
        }

        Stack<Point> stack = new Stack<Point>();
        stack.push(sorted.get(0));
        stack.push(sorted.get(1));

        for (int i = 2; i < sorted.size(); i++) {

            Point head = sorted.get(i);
            Point middle = stack.pop();
            Point tail = stack.peek();

            Turn turn = getTurn(tail, middle, head);

            switch(turn) {
                case COUNTER_CLOCKWISE:
                    stack.push(middle);
                    stack.push(head);
                    break;
                case CLOCKWISE:
                    i--;
                    break;
                case COLLINEAR:
                    stack.push(head);
                    break;
            }
        }

        // close the hull
        stack.push(sorted.get(0));

        return new ArrayList<Point>(stack);
    }

    protected static Point getLowestPoint(List<Point> points) {
        Point lowest = points.get(0);
        for(int i = 1; i < points.size(); i++) {
            Point temp = points.get(i);
            if(temp.y < lowest.y || (temp.y == lowest.y && temp.x < lowest.x)) {
                lowest = temp;
            }
        }
        return lowest;
    }

    protected static Set<Point> getSortedPointSet(List<Point> points) {
        final Point lowest = getLowestPoint(points);
        TreeSet<Point> set = new TreeSet<Point>(new Comparator<Point>() {
            @Override
            public int compare(Point a, Point b) {
                if(a == b || a.equals(b)) {
                    return 0;
                }
                // use longs to guard against int-underflow
                double thetaA = Math.atan2((long)a.y - lowest.y, (long)a.x - lowest.x);
                double thetaB = Math.atan2((long)b.y - lowest.y, (long)b.x - lowest.x);
                if(thetaA < thetaB) {
                    return -1;
                }
                else if(thetaA > thetaB) {
                    return 1;
                }
                else {
                    // collinear with the 'lowest' point, let the point closest to it come first
                    // use longs to guard against int-over/underflow
                    double distanceA = Math.sqrt((((long)lowest.x - a.x) * ((long)lowest.x - a.x)) +
                            (((long)lowest.y - a.y) * ((long)lowest.y - a.y)));
                    double distanceB = Math.sqrt((((long)lowest.x - b.x) * ((long)lowest.x - b.x)) +
                            (((long)lowest.y - b.y) * ((long)lowest.y - b.y)));
                    if(distanceA < distanceB) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
            }
        });
        set.addAll(points);
        return set;
    }

    protected static Turn getTurn(Point a, Point b, Point c) {
        // use longs to guard against int-over/underflow
        Double crossProduct = ((b.x - a.x) * (c.y - a.y))-
                ((b.y - a.y) * (c.x - a.x));
        if(crossProduct > 0) {
            return Turn.COUNTER_CLOCKWISE;
        }
        else if(crossProduct < 0) {
            return Turn.CLOCKWISE;
        }
        else {
            return Turn.COLLINEAR;
        }
    }

    public static double[] calculate(double[] testInput) {

        int doulen = testInput.length;
        int len = doulen / 2;
        Point[] points = new Point[len];
        for (int i = 0; i < len; i++) {
            points[i] = new Point(testInput[2 * i], testInput[2 * i + 1]);
        }
        List<Point> result1 = getConvexHull(Arrays.asList(points));
        Set<Point> result2 = getSortedPointSet(result1);
        System.out.println("集合A中满足凸包的点集为：");
        Point[] result=result2.toArray(new Point[0]);
        double[] polygon = new double[result.length* 2];
        for (int i = 0; i < result.length; i++) {
            polygon[2 * i] = result[i].x;
            polygon[2 * i + 1] = result[i].y;
            System.out.println(+ result[i].getX() + "\t" + result[i].getY());
        }
        return polygon;
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
                114.30488219345933, 30.554675916764136,
                114.35362228468497, 30.56486029278519,
                114.31424765362149, 30.559238266877724,
                114.31536297986132, 30.55497944537274,
                114.31072874031167, 30.556701731156465,
                114.31318674133963, 30.555234237599745,
                114.3433508477371, 30.5996596944394,
                114.32229851912746, 30.550474697347,
                114.31877734118946, 30.566571156356094,
                114.30184450510613, 30.54956667959817,
                114.35279751831057, 30.568501691990193,
                114.31637138888105, 30.554238104824535,
                114.31147009478126, 30.55421543122177,
                114.30739427337731, 30.542637818133656,
                114.3165501786267, 30.57423766914222,
                114.30572878441941, 30.533777308333534,
                114.31332582957496, 30.556014915314005,
                114.31282649477927, 30.556402431184413,
                114.3054068919111, 30.549806449650244,
                114.30701032861928, 30.557223946826653,
                114.3156956924595, 30.551303042209593,
                114.3215062370236, 30.55471443576423,
                114.32362594517956, 30.56037862800519,
                114.31332980008531, 30.56465390794279,
                114.30403956133165, 30.547929471258026,
                114.31244628427724, 30.557683198123257,
                114.30999014902983, 30.555869411985398


        };
        int doulen = testInput.length;
        int len = doulen / 2;
        Point[] points = new Point[len];
        for (int i = 0; i < len; i++) {
            points[i] = new Point(testInput[2 * i], testInput[2 * i + 1]);
        }
        List<Point> result1 = getConvexHull(Arrays.asList(points));
        Set<Point> result2 = getSortedPointSet(result1);
        System.out.println("集合A中满足凸包的点集为：");
        Point[] result=result2.toArray(new Point[0]);
        double[] polygon = new double[result.length* 2];
        for (int i = 0; i < result.length; i++) {
            polygon[2 * i] = result[i].x;
            polygon[2 * i + 1] = result[i].y;
            System.out.println(+ result[i].getX() + "\t" + result[i].getY());
        }
        return polygon;
    }

    public static void main(String[] args){
        test();
    }

}