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

現状のディレクトリにいることを確認して、

```terminal
$ now deploy --prod

Deploying ~/your/project/directory under YOUR_PC
> Using project PROJECT_NAME
> NOTE: To deploy to production (react-sample.now.sh), run `now --prod`
> Synced 1 file [4s]
> https://XXX.now.sh [4s]
> Ready! Deployed to https:/XXX.now.sh [in clipboard] [24s]

```

コマンドを入力すると build されてデプロイされます。
表示された URL を確認すると、作成した URL が表記されてるかと思います。

## 4. nextjs を CircleCI を使って Auto Deploy する

circleCI での now の設定は３段階。
1.now の token を発行して、circleCI の env に記載。最後に、circleCI の config から参照して deploy する形となります。

### 4-1. now token を発行する

now の token は login タイミングで発行するものと、自分で作成するものがあります。
token の発行方法は、ダッシュボード画面にいき Settings から token を発行することができます。

[dashboard](https://zeit.co/)にいき右上のユーザーアイコンから、Settings リンクをクリック。

<img>
