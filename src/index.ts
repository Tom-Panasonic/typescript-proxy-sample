import axios from "axios";
import * as fs from "fs";

// proxy.jsonからプロキシ設定を読み込む
const proxyConfig = JSON.parse(fs.readFileSync("./proxy.json", "utf-8"));
const proxyUrl = proxyConfig.proxy_url;

// 固定のリクエスト先URL
const fixedUrl = "http://httpbin.org/get";

async function checkConnection(useProxy: boolean): Promise<void> {
  try {
    const config = useProxy
      ? {
          proxy: {
            host: new URL(proxyUrl).hostname,
            port: Number(new URL(proxyUrl).port),
          },
        }
      : {};

    const response = await axios.get(fixedUrl, config);

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

// 使用例
checkConnection(useProxy);
