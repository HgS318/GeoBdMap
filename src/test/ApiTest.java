package test;

import java.io.DataInputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import net.sf.json.*;

/**
 * @fileName com.bxm.advertisercmsaaa.java
 * @CopyRright (c) 2017-bxm：杭州微财科技有限公司
 * @date 2018年3月9日 上午10:40:36
 * @author chzq
 */
public class ApiTest {

    /**
     * @date 2018年3月9日 上午10:40:40
     * @param args
     * @author chzq
     */
    public static void main(String[] args) throws Exception {
        StringBuilder sb = new StringBuilder(
                "http://v.juhe.cn/postcode/query");
        Map<String, String> params = new HashMap<String, String>();
        params.put("postcode", "215001");
        params.put("key","9ab4f8036190fc2d63661391b5e7528e");//固定值
//        params.put("modeltype", "7");//固定值
        String result1 = GetPostUrl(sb.toString(), params, "GET",null, 0, 0);
        System.out.println(result1);

    }

    public static String GetPostUrl(String sendUrl, Map<String, String> params, String sendType, String charset,
                                    int repeat_request_count, int repeat_request_max_count) {
        URL url = null;
        HttpURLConnection httpurlconnection = null;

        try {
            // 构建请求参数
            StringBuffer paramSb = new StringBuffer();
            if (params != null) {
                for (java.util.Map.Entry<String, String> e : params.entrySet()) {
                    paramSb.append(e.getKey());
                    paramSb.append("=");
                    // 将参数值urlEncode编码,防止传递中乱码
                    paramSb.append(URLEncoder.encode(e.getValue(), "UTF-8"));
                    paramSb.append("&");
                }
                paramSb.substring(0, paramSb.length() - 1);
            }
            url = new URL(sendUrl + "?" + paramSb.toString());
            httpurlconnection = (HttpURLConnection) url.openConnection();
            httpurlconnection.setRequestMethod("GET");
            httpurlconnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            httpurlconnection.setDoInput(true);
            httpurlconnection.setDoOutput(true);

            // 设置http请求超时时间30000毫秒（30秒）
            httpurlconnection.setConnectTimeout(30000);
            httpurlconnection.setReadTimeout(30000);
            httpurlconnection.setUseCaches(true);
            /*
             * if (submitMethod.equalsIgnoreCase("POST")) {
             * httpurlconnection.getOutputStream().write(postData.getBytes("GBK"
             * )); httpurlconnection.getOutputStream().flush();
             * httpurlconnection.getOutputStream().close(); }
             */

            int code = httpurlconnection.getResponseCode();
            if (code == 200) {
                DataInputStream in = new DataInputStream(httpurlconnection.getInputStream());
                int len = in.available();
                byte[] by = new byte[len];
                in.readFully(by);
                String rev = new String(by, "UTF-8");

                in.close();

                return rev;
            } else {
                // http 请求返回非 200状态时处理
                return "<?xml version=\"1.0\" encoding=\"utf-8\" ?><error>发送第三方请求失败</error>";
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (httpurlconnection != null) {
                httpurlconnection.disconnect();
            }
        }
        return null;
    }

}