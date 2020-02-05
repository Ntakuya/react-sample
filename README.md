# NextJS(Typescript)の環境に ESLINT/Prettier をツッコミ CircleCI の設定に追加する

tslint を利用しようと思いましたが、2019 年に ESLINT に統一するようになるよって話があるので[https://github.com/palantir/tslint/issues/4534](https://github.com/palantir/tslint/issues/4534)ESLINT に変更して作成します。

## Table of Contents

1. Prettier と es-lint を追加する
2. husky を追加して precommit/prepush の前に lint と formatter を走らす
3. CircleCI の build をする前に lint test を走らす

## 1. Prettier と ts-lint を追加する

[Prettier](https://prettier.io/)の有効かをしていきます。

### 1-1, Prettier を install する

install するのは 2 種類。perttier と pretty-quick を install します。

```terminal
$ npm install -D prettier pretty-quick
```

### 1-2. Prettier の設定ファイルを作成する

```terminal
$ touch .prettierrc
```

中身は個人的に基本的な設定のみ対応します。

```.prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

install した pretty-quick が利用できるように、package.json に追加します。

```package.json
...
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start",
  "prettier:quick": "pretty-quick --staged"
},
...
```

試しに実行すると、github 場で変更したファイルを確認して prettier を実行してくれます。

```
$ npm run prettier:quick
🔍  Finding changed files since git revision 43aa1b4.
🎯  Found 0 changed files.
✅  Everything is awesome!
```

### 1-3. lint を install する

lint の設定は、lint をインストールして設定ファイルを作成します。

```
$ npm install -D eslint
```

### 1-4. lint の設定をする

es-lint の設定ファイル eslint.json を作成していきます。
--init を利用しファイルを作成していきます。

```terminal
$ npx eslint --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code
style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Does your project use TypeScript? Yes
? Where does your code run? Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Standard: https://github.com/standard/stan
dard
? What format do you want your config file to be in? JSON
```

作成させた eslintrc は以下になります。

```.eslintrc
{
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["plugin:react/recommended", "standard"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {}
}

```

react を利用する際に error が生じるため、以下の設定を追加します。

```.eslintrc.json
{
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["plugin:react/recommended", "standard"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {},
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

```

lint がコマンドから叩けるように package.json を編集します。

```package.json
...
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start",
  "lint": "eslint src/** --ext .ts,.tsx",
  "lint:fix": "npm lint --fix"
},
...
```

次に prettier の rule を lint の rule にも追加するように設定します。

```terminal
$ npm install -D eslint-plugin-prettier
```

```.eslintrc.json
{
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["plugin:react/recommended", "standard"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

```

次にコマンドが正常に動くか確認します。

```terminal
$ npm run lint
```

成功したら husky の設定をしていきます。

## 2. husky を追加して precommit/prepush の前に lint と formatter を走らす

[husky](https://github.com/typicode/husky)は、git のアクションにフックして、コマンドを走らせることができます。

husky を install して設定していきます。

```terminal
$ npm install husky --save-dev
$ touch .huskyrc
```

今回はコミットの前にフォーマットを走らせ、push の前に lint を走らせるよに変更します。

```package.json
"husky": {
  "hooks": {
    "pre-commit": "pretty-quick --staged",
    "pre-push": "npm run lint"
  }
}
```

## 3. CircleCI の build をする前に lint test を走らす

circleci に設定を追加してきます。
deploy する前に test をはしらせて、失敗したら deploy しないように設定していきます。

テストの内容を追加していきます。

```.circleci/config.yml
version: 2.1
executors:
  node:
    working_directory: ~/project
    docker:
      - image: circleci/node:10.12-browsers
## ここから追記
jobs:
  test-lint:
    executor:
      name: node
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: linting code
          command: npm run lint
## ここまで追記
```

job の作成が完了したら、workflow に追加します。

```.circleci/config.yml
workflows:
  version: 2
  build-and-cache:
    jobs:
      - build
      - test-lint:
          requires:
            - build
      - deploy-now:
          requires:
            - test-lint
```

requires で build 後に lint が走るように設定し、deploy については lint を通した後に実装するように変更しました。
