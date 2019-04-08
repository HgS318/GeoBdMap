package whu.eres.cartolab.geo;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by xxx on 2017/1/17.
 * <p>
 * 给定一系列坐标点，从中找出最大凸多边形
 * <p>
 * 可以判断，叉乘结果的数组中：
 * <p>
 * 1. 如果元素全部是负数，那么这个单点肯定在已知多边形的内部；这个单点应该直接抛弃；
 * 2. 如果只有一个零，其它都是负数，那么这个单点一定在对应的边上；这个单点也应该直接抛弃；
 * 3. 如果有两个零，那这个点一定和原来的某个顶点重合；应该抛弃这个单点；
 * 4. 如果有一个或者多个连续的正数或者0，那么这个单点一定在这几条连续边的外面，例如上面的EA ^ EB , EB ^EC是0 和 正数，那么对应的连续顶点A-B-C，应该保留起始点A和结束点C，中间的点B则应该删除，然后将单点E插入到A和C中间；从而形成新的凸多边形顶点列表AECD；
 * 5. 如果只有一个单独的正数叉乘结果，那就不需要删除任何原来的顶点，而仅需要将新的单点插入即可。
 * 6. 不可能出现多段分开的正数或零序列，比如[-1, -1, 0, 1, 1, 1, 0, -1] 是可能的，但是如下的[-1, -1, 0, 1, -1, 0, 1, -1]叉乘结果序列是绝不可能出现的。
 */
public class MaxConvexPolygon {

    private final double EPS = Math.pow(10, -6);

    private double[] coordinates;   //存放坐标点,e.g.[x0,y0,x1,y1,...]
    private List<Integer> ptsIdx = new LinkedList<>();

    public MaxConvexPolygon(double[] coordinates) {
        this.coordinates = coordinates;
        if (coordinates.length % 2 != 0)
            throw new IllegalArgumentException("坐标点coordinates长度必须是偶数");
        for (int i = 0; i < coordinates.length / 2; i++) {
            ptsIdx.add(i);
        }
    }

    public MaxConvexPolygon(List<Double> coordsList) {
        int len = coordsList.size();
        double[] coordinates = new double[len];
        for(int i = 0; i < coordsList.size(); i++) {
            coordinates[i] = coordsList.get(i);
        }
        this.coordinates = coordinates;
        if (coordinates.length % 2 != 0)
            throw new IllegalArgumentException("坐标点coordinates长度必须是偶数");
        for (int i = 0; i < coordinates.length / 2; i++) {
            ptsIdx.add(i);
        }
    }

    public MaxConvexPolygon(JSONArray jsonArray) {
        int len = jsonArray.length();
        double[] coordinates = new double[len * 2];
        for(int i = 0; i < len; i++) {
            JSONObject jo = jsonArray.getJSONObject(i);
            coordinates[2 * i] = jo.getDouble("x");
            coordinates[2 * i + 1] = jo.getDouble("y");
        }
        this.coordinates = coordinates;
        if (coordinates.length % 2 != 0)
            throw new IllegalArgumentException("坐标点coordinates长度必须是偶数");
        for (int i = 0; i < coordinates.length / 2; i++) ptsIdx.add(i);
    }

    public double[] run() {
        List<Integer> res = getMaxPolygon(ptsIdx);
        Point[] points = new Point[res.size()];
        for (int i = 0; i < res.size(); i++) {
            points[i] = new Point(coordinates[res.get(i) * 2], coordinates[res.get(i) * 2 + 1]);
        }
        ConvexPolygon01.ClockwiseSortPoints(points);
        double[] validPts = new double[res.size() * 2];
        for (int i = 0; i < res.size(); i++) {
            validPts[i * 2] = points[i].x;
            validPts[i * 2 + 1] = points[i].y;
        }

        return validPts;
    }

    private List<Integer> getMaxPolygon(List<Integer> ptsIdx) {
        if (ptsIdx.size() == 3) {
            int[] idx = new int[]{ptsIdx.remove(0), ptsIdx.remove(0), ptsIdx.remove(0)};
            //生成两个向量
            double[] vectors = makeVector(idx[0], new Integer[]{idx[1], idx[2]}); // 0 -> 1, 0 -> 2
            //求交叉积
            int res = cross_mul_sign(vectors[0], vectors[1], vectors[2], vectors[3]);
            switch (res) {
                case -1: //保证点是顺时针顺序
                    ptsIdx.add(idx[0]);
                    ptsIdx.add(idx[1]);
                    ptsIdx.add(idx[2]);
                    break;
                case 1:
                    ptsIdx.add(idx[0]);
                    ptsIdx.add(idx[2]);
                    ptsIdx.add(idx[1]);
                    break;
                case 0: //在同一条直线上，去掉中间的点
                    int minIdx = 0, maxIdx = 0;
                    if (coordinates[idx[0] * 2] == coordinates[idx[1] * 2]) { //x 相同
                        for (int i = 1; i < idx.length; i++) {
                            if (coordinates[idx[minIdx] * 2 + 1] > coordinates[idx[i] * 2 + 1]) minIdx = i;
                            if (coordinates[idx[maxIdx] * 2 + 1] < coordinates[idx[i] * 2 + 1]) maxIdx = i;
                        }
                    } else {
                        for (int i = 1; i < idx.length; i++) {
                            if (coordinates[idx[minIdx] * 2] > coordinates[idx[i] * 2]) minIdx = i;
                            if (coordinates[idx[maxIdx] * 2] < coordinates[idx[i] * 2]) maxIdx = i;
                        }
                    }
                    ptsIdx.add(idx[minIdx]);
                    ptsIdx.add(idx[maxIdx]);
                    break;
            }
            return ptsIdx;
        } else {
            int firstIdx = ptsIdx.remove(0);
            List<Integer> poly_point_idx = getMaxPolygon(ptsIdx);
            double[] vectors = makeVector(firstIdx, poly_point_idx.toArray(new Integer[poly_point_idx.size()]));
            int[] cm_results = cross_mul_sign(vectors);

            int first_01 = -1, last_01 = -1; //寻找连续0或者1序列的起点和终点
            for (int i = 0; i < cm_results.length; i++) { //把数组看成一个环?0:
                if (first_01 == -1 && cm_results[i] >= 0 && cm_results[i == 0 ? cm_results.length - 1 : i - 1] < 0)
                    first_01 = i;
                if (last_01 == -1 && cm_results[i] >= 0 && (cm_results[0] < 0 || cm_results[i + 1 == cm_results.length ? 0 : i + 1] < 0))
                    last_01 = i;
                if (last_01 > -1 && first_01 > -1) break;
            }

            //元素全部是负数，那么这个单点肯定在已知多边形的内部；这个单点应该直接抛弃；
            if (first_01 == -1 || last_01 == -1)
                return poly_point_idx;
            //如果只有一个零，其它都是负数，那么这个单点一定在对应的边上；这个单点也应该直接抛弃；
            if (first_01 == last_01 && cm_results[first_01] == 0)
                return poly_point_idx;

            // 如果有一个或者多个连续的正数或者0，那么这个单点一定在这几条连续边的外面
            // 如果只有一个单独的正数叉乘结果，那就不需要删除任何原来的顶点，而仅需要将新的单点插入即可。
            int cnt_should_delete = last_01 - first_01;
            if (cnt_should_delete < 0)
                cnt_should_delete = poly_point_idx.size() - first_01 + last_01;
            //将firstIdx插入到poly_point_idx的first_01后面
            poly_point_idx.add(first_01 + 1, firstIdx);

            for (int i = 0; i < cnt_should_delete; i++) {
                int idx2del = first_01 + 2; //remove the points between first01 and last01
                if (idx2del >= poly_point_idx.size()) idx2del = 0;
                poly_point_idx.remove(idx2del);
            }

            return poly_point_idx;
        }
    }

    public static void main(String[] args) {

        double[] test = new double[]{3, 0, 0, 0, 3, 3, 0, 3, 3, 4};
        double[] myTest = new double[] {
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
        MaxConvexPolygon mcp = new MaxConvexPolygon(myTest);

        double[] res = mcp.run();
        System.out.println();
        for (double v : res) System.out.print(v + " ");
    }

    public static double[] myTest() {
        double[] test = new double[] {
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
        MaxConvexPolygon mcp = new MaxConvexPolygon(test);
        double[] res = mcp.run();
        return  res;
    }

    private double[] makeVector(int idx_fromPoint, Integer[] idx_toPoints) {
        double[] vectors = new double[idx_toPoints.length * 2];
        for (int i = 0; i < idx_toPoints.length; i++) {
            vectors[i * 2] = coordinates[idx_toPoints[i] * 2] - coordinates[idx_fromPoint * 2];
            vectors[i * 2 + 1] = coordinates[idx_toPoints[i] * 2 + 1] - coordinates[idx_fromPoint * 2 + 1];
        }
        return vectors;
    }

    public double[] makeVector(int idx_fromX, int idx_formY, int idx_toX, int idx_toY) {
        return new double[]{coordinates[idx_toX] - coordinates[idx_fromX],
                coordinates[idx_toY] - coordinates[idx_formY]};
    }

    private int[] cross_mul_sign(double[] vectors) {
        int[] res = new int[vectors.length / 2];
        for (int i = 0; i < res.length - 1; i++) {
            int idx = i * 2;
            res[i] = cross_mul_sign(vectors[idx], vectors[idx + 1], vectors[idx + 2], vectors[idx + 3]);
        }
        res[res.length - 1] = cross_mul_sign(vectors[vectors.length - 2], vectors[vectors.length - 1], vectors[0], vectors[1]);
        return res;
    }

    private int cross_mul_sign(double x0, double y0, double x1, double y1) {
        double res = x0 * y1 - y0 * x1;
        return res < 0 ? -1 : res > EPS ? 1 : 0;
    }
}
