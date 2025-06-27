import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as fs from "fs";
import { CookieJar } from "tough-cookie";
import { HttpsProxyAgent } from "https-proxy-agent";

// proxy.jsonからプロキシ設定を読み込む
const proxyConfig = JSON.parse(fs.readFileSync("./proxy.json", "utf-8"));
const proxyUrl = proxyConfig.proxy_url;

// 固定のリクエスト先URL
//const fixedUrl = "http://httpbin.org/get";
const fixedUrl = "https://httpbin.org/get";

async function checkConnection(useProxy: boolean): Promise<void> {
  try {
    const jar = new CookieJar();
    // axios-cookiejar-support で cookie jar をサポート
    const axiosInstance = wrapper(
      axios.create({
        proxy: useProxy
          ? {
              protocol: proxyUrl.startsWith("https") ? "https" : "http",
              host: proxyUrl.replace(/^https?:\/\//, "").split(":")[0],
              port: Number(proxyUrl.split(":").pop()),
            }
          : false,
        withCredentials: useProxy ? true : undefined,
      })
    );
    console.log();
    const response = await axiosInstance.get(fixedUrl, { jar });

    console.log(`成功: ${response.status} - ${response.statusText}`);
    console.log("レスポンスデータ:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axiosエラー:", error.message);
      if (error.response) {
        console.error("ステータス:", error.response.status);
        console.error("レスポンスデータ:", error.response.data);
      } else if (error.request) {
        console.error(
          "リクエストは送信されましたが、レスポンスを受信できませんでした。"
        );
      }
    } else {
      console.error("予期せぬエラー:", (error as Error).message);
    }
  }
}

// コマンドライン引数を取得
const args = process.argv.slice(2);
const useProxy = args[0] === "true"; // 第一引数が true の場合はプロキシを使用

console.log("ローカルのプロキシ設定:", process.env.HTTP_PROXY);
console.log("プロキシ設定:", proxyUrl);
console.log("プロキシを使用:", useProxy ? "はい" : "いいえ");
// 現在の日付を yyyyMMdd 形式で取得する関数
// const getCurrentDateString: () => string = function () {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   return `${year}${month}${day}`;
// };
//console.log(getCurrentDateString());
// 使用例
checkConnection(useProxy);
