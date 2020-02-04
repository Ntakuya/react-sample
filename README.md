# NextJS(Typescript)を now にデプロイする

#### Table of Contents

0. now、Nextjs とは
1. now の初期設定をする
1. nextjs を now に手動デプロイする
1. nextjs を CircleCI を使って Auto Deploy する

## 0. now、Nextjs とは

[next.js](https://nextjs.org/)とは、

[now](https://zeit.co/dashboard)とは、

## 1. now の初期設定をする

[now](https://zeit.co/dashboard)にアクセスをし、ユーザー登録をおこなっていきます。
下の画面の Deploy Free ボタンをクリックしてアカウント作成に移動します。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-top.png?raw=true">

今回は Contenue With GitHub を使って GitHub でアカウントを作成していきます。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-signup.png?raw=true">

アカウントの作成が完了するとダッシュボードに行くことができます。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-dashboard.png?raw=true">

これで web 上の設定は完了です。
次に、now コマンドを install していきます。

```terminal
$ npm install -g now

# インストールが完了したら一応バージョンを確認いたします。

$ now --version
16.7.3
```

コマンドが完了したら、*now*コマンドを利用してログインしていきます。
メールアドレスを求められるので、ログインしたアカウントの Email アドレスを利用してログインをしていきます。

```terminal
$ now login
We sent an email to YOUR_EMAIL_ADDRESS Please follow the steps provided
  inside it and make sure the security code matches Happy Magellanic Penguin.
✔ Email confirmed
> Congratulations! You are now logged in. In order to deploy something, run `now`.
```

## 2. nextjs を now に手動デプロイする

```terminal
$ pwd
/your/project/directory
```

現状のディレクトリにいることを確認します。
nowでconfigで扱う、now.jsonファイルを作成していきます。

```now.json
{
  "name": "next-sample"
}
```

これで、プロジェクト名を固定してdeployすることができます。

```
ちなみにプロジェクト名を指定しない場合は、root directoryの名前が優先されるっぽいです。
```

```terminal
$ now --prod

Deploying ~/your/project/directory under YOUR_PC
> Using project PROJECT_NAME
> NOTE: To deploy to production (YOUR_PRJECT_NAME.now.sh), run `now --prod`
> Synced 1 file [4s]
> https://XXX.now.sh [4s]
> Ready! Deployed to https:/XXX.now.sh [in clipboard] [24s]

```

コマンドを入力すると build されてデプロイされます。
表示された URL を確認すると、作成した URL が表記されてるかと思います。

## 4. nextjs を CircleCI を使って Auto Deploy する

```
これ書いてから築いたのですが、PRなどの作成タイミングでauto deployがはしります。www
circleCIをdeployのみにしている場合は必要ありません。
```

circleCI での now の設定は３段階。
1.now の token を発行して、circleCI の env に記載。最後に、circleCI の config から参照して deploy する形となります。

### 4-1. now token を発行する

nowのtokenが作られるタイミングは、loginの際に発行するものと、自分で作成するものがあります。
自分でtokenをの発行する方法は、ダッシュボード画面にいき Settings から token を発行することができます。

[dashboard](https://zeit.co/)にいき右上のユーザーアイコンから、Settings リンクをクリック。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-dashboard-setting.png?raw=true">

setting画面にあるTokenリンクから、とtokenの設定画面に遷移します。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-setting-token.png?raw=true">

現状tokenを利用している一覧表示のCreateをクリック

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-create-token.png?raw=true">

tokenを利用する名前を設定し、create tokenをクリックするとtokenが表示されます。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeit-create-token-form.png">

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-zeito-token.png">

## 4-2. CircleCIに Environmentを設定する

nowのtokenの発行がおわったら、CircleCIのEnvironmentに記載していきます。
(Projectがある前提で話をしていきます。)

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-circleci-project-page.png">

設定画面にいったらEnvironment VariablesからAdd Variablesを選択

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-circleci-setting-environement.png">

先ほどCopyしたnow Tokenを入力して、Environmentの設定をします。

<img src="https://github.com/Ntakuya/react-sample/blob/contents/deploy/public/img/c2-circleci-setting-variable-modal.png">

これで、.circleci/config.ymlで $NOW_TOKENで登録したtokenを利用できるようになりました。
最後にCIの設定をしていきます。

## 4-3. CircleCIの設定

設定が完了したら、circleciでデプロイできるよに、.circleci/config.ymlの編集をしていきます。

```.circleci/config.yml
version: 2.1
executors:
  node:
    working_directory: ~/project
    docker:
      - image: circleci/node:10.12-browsers
jobs:
  build:
    executor:
      name: node
    steps:
      - checkout
      - run:
          name: update-npm
          command: "sudo npm install -g npm@latest"
      - restore_cache:
          key: node-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run:
          name: npm install on ci
          command: npm ci
      - save_cache:
          key: node-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - ./node_modules
      - persist_to_workspace:
          root: .
          paths:
            - .
      - run:
          name: build flat
          command: npm run build
# ここから追記
  deploy-now:
    executor:
      name: node
    steps:
      - checkout
      - run:
          name: update-npm
          command: "sudo npm install -g npm@latest"
      - run:
          name: install now on global
          command: "sudo npm install -g now"
      - attach_workspace:
          at: .
      - run:
          name: deploy to now
          command: now deploy --token $NOW_TOKEN
# ここまで追記
workflows:
  version: 2
  build-and-cache:
    jobs:
      - build
      - deploy-now:
          requires:
            - build

```

でdeplpyすると、CircleCI経由でdeployすることが可能になります。
nowでauto deployもできるのでこの内容だけだと必要性を感じません。。。
now 自体も色々あるのであとで記載していこうかと。
