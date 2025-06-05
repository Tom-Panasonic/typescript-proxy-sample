## プロジェクト構成

```
/src
    ├── index.ts         # エントリーポイント。proxy.jsonの情報をもとにaxiosで疎通確認を実施
    └── ...              # その他の実装ファイル
/proxy.json              # 認証無しプロキシ情報を記載した設定ファイル
```

## 使い方

1. リポジトリをクローンし、依存パッケージをインストールします。

```bash
npm install typescript ts-node @types/node jest ts-jest @types/jest --save-dev
```

```bash
npm install
```

2. `proxy.json` に認証無しプロキシの情報を記載します。

   例:

   ```json
   {
     "host": "プロキシのホスト名",
     "port": 8080
   }
   ```

3. TypeScript コードを実行して、axios 経由でプロキシ疎通を確認します。

```bash
npm run dev-proxy
```

4. プロキシ経由で疎通を行わない場合は次のコマンドを実行します

```bash
npm run dev
```

## 概要

このプロジェクトは、`proxy.json` に記載された認証無しプロキシ情報をもとに、axios を利用して外部通信が可能かどうかを確認するサンプルです。`src/index.ts` で設定ファイルを読み込み、axios のプロキシ設定として利用します。
