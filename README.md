## 概要
サブゴール知識転移の強化学習のサブゴール取得用のWebシステム

## コマンド
起動
```
python manage.py runserver
```

データベースの初期化
```
python manage.py migrate
```

Modelの変更を伝える
```
python manage.py makemigrations <app name>
```

シェルで入る(Pythonコマンドを打ち込める。)
```
python manage.py shell
```

## 手順
### 軌跡の登録
"exp/tasks/fourroom/trajectory/register"へアクセス．

### Cloud SQL Proxy
[Docs](https://cloud.google.com/sql/docs/mysql/sql-proxy?hl=ja)
```
./cloud_sql_proxy -instances=quickstart-1561692856354:asia-east1:subgoal-experiment-instance=tcp:3306
```


## Google App Engineへのデプロイ
```
gcloud app deploy
```
