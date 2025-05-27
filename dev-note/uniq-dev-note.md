---
title: 'uniQ 개발 노트'
eng_title: 'uniQ dev note'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: 'uniQ 개발 노트'
created_date: 2025-05-20
updated_date: 2025-05-27
---

:::note 내용 못알아먹겠음 주의

Dev note는 정식 회고록이 아닌 draft 입니다.<br />

:::

### 📆 25-05-20

기획

<details>
<summary>내용 보기</summary>

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/1](https://github.com/Queue-ri/uniq/issues/1)

<br/>

#### 📌 프로젝트 기획

티스토리 -> 네이버 -> velog 로 유목민 생활을 해본 결과, 각자 하나씩은 아쉬움이 있어 그냥 자체 블로그 프레임워크를 만들기로 했다.

FE 지식이 많진 않은데 당장 목표하는 기본 기능만 구상해서 맨땅에 헤딩하려 한다.

우선 다음의 원칙은 지켜야 한다.

<br />

#### 기능 측면
- 글 작성이 빠르고 쉬우면서 결과물이 이쁘게 나올 것
- 보호, 비공개 글 기능이 있을 것

#### 관리 측면
- 기본 언어는 영어 (나중에 i18n으로 한국어 넣음)
    - 주석 포함 모든 문서화는 영어로 작성되어야 함

<br />

따라서 JAMstack 기반의 정적 페이지는 사실상 불가능하고, 애초에 정적 페이지로 블로그 운영할거였으면 기존에 널린거 주워다 썼을 것이다.

보호/비공개 기능 때문에 글 원본은 접근이 제한되는 영역에 있어야 하고, 이는 self-host 또는 private repo 형식으로 관리되는 방식이 될 것 같다.

<br />

#### 📌 기술 스택

- [FE] React.js
- [BE] Node.js / Express
- [DB] MongoDB

검색은 algolia로 고민중이다. ES까진 오버엔지니어링이라고 생각.

**나중에 알았는데 이걸 MERN 스택이라고 하더라**

</details>

### 📆 25-05-21

MDX renderer 구현

<details>
<summary>내용 보기</summary>

#### 📌 프로젝트 세팅

Node.js를 오랫동안 업데이트하지 않았었는데 디펜던시 warning이 뜨길래 최신 LTS로 바꿔줬다. 16 -> 22로 올렸으니 진짜 징하게 안바꾸긴 함.

프로젝트는 CRA로 init 했다.

<br />

#### 📌 padding이 width, height를 건드리는 문제

EditorSideBar에 padding 넣는데 넣은 만큼 width, height가 늘어나는 문제가 있었다.

[스택오버플로](https://stackoverflow.com/questions/779434/how-do-i-prevent-the-padding-property-from-changing-width-or-height-in-css)를 참고해서 고쳤다.

<br />

#### 📌 MDX 로드하기

쌩 CRA로는 MDX 로딩이 안되고, CRA의 Webpack 설정을 건드려야 한다고 한다.

하지만 Webpack 설정이 기본적으로 숨겨져있기 때문에 Eject 하거나 craco를 써야 했고, 나는 craco 방식을 선택했다.

<br />

#### Webpack이 하는 일
모든 FE 리소스(JS, CSS, 이미지, 폰트 등)를 하나의 JS 번들로 변환하는 빌드 도구이다.

MDX같이 브라우저가 이해할 수 없는 파일을 JS 코드로 변환해준다.

#### MDX -> JSX 변환 필수
브라우저는 MDX가 뭔지 모른다.

따라서 브라우저가 이해하는 JSX 코드로 변환해주어야 하는데, 이걸 해주는 게

Webpack + @mdx-js/loader 이다.

<br />

#### 📌 MDX 로딩을 위한 세팅

1. 필요한 패키지 설치

```bash
npm install @craco/craco @mdx-js/react @mdx-js/loader
```

2. `package.json` 수정
```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test"
}
```

3. `craco.config.js` 생성 및 설정

```js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. remove mdx from the rule
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.filter(
            (r) => !(r.test && r.test.toString().includes('mdx'))
          );
        }
        return rule;
      });

      // 2. add mdx loader
      const mdxRule = {
        test: /\.mdx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
          {
            loader: require.resolve('@mdx-js/loader'),
            options: {
              providerImportSource: "@mdx-js/react",
            },
          },
        ],
      };

      const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));
      if (oneOfRule) {
        oneOfRule.oneOf.unshift(mdxRule);
      }

      return webpackConfig;
    },
  },
};
```

babel-loader는 이미 CRA에 포함되어 있다.

<br />

#### 📌 컴포넌트에서 MDX 렌더링하기

```js
const mdxContext = require.context('../post', false, /\.mdx$/);
```

이런식으로 Webpack의 `require.context`를 이용해서 동적 로드한 다음 (이 방식 아니면 import 문 직접 써야 하는데 내가 원하는 방식이 아님)

```jsx title=EditorPage.js
<div className="content">
    {MdxComponent && (
    <MDXProvider>
        <MdxComponent />
    </MDXProvider>
    )}
</div>
```

대충 요런식으로 변환된 내용을 불러올 수 있다.

<br />

#### 🐞 craco config 설정시 주의점

기존에 gpt가 알려준 이 설정은 틀렸다.

```js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mdx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
          {
            loader: require.resolve('@mdx-js/loader'),
            options: {
              providerImportSource: "@mdx-js/react",
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};
```

왜냐하면 단순히 `@mdx-js/loader`의 설정을 push만 했기 때문이다. 이건 rule을 뒤에다 붙인 것이다.

CRA Webpack의 기본 설정은 mdx를 알 수 없는 파일로 간주하여 정적 파일로 처리하기 때문에

**`@mdx-js/loader`가 기존 로더보다 먼저 실행되지 않으면 무시된다 (!)**

따라서 최종 config에선 filter로 기존 로더를 제거하고 unshift로 새 로더를 맨 앞에 붙여서 처리 우선순위를 확보했다.

<br />

#### 🌌 렌더링 결과

요기까지 완성하고 내일의 나에게 맡긴다.

![https://velog.velcdn.com/images/qriosity/post/96f18959-895d-46b4-b825-b0b07502237b/image.png](https://velog.velcdn.com/images/qriosity/post/96f18959-895d-46b4-b825-b0b07502237b/image.png)

</details>

### 📆 25-05-26

frontmatter 파싱, `1.0.0-beta.1` 릴리즈

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq/issues/1](https://github.com/Queue-ri/uniq/issues/1)

<br />

#### 📌 frontmatter 파싱

MDX가 잘 렌더링되는 것 같지만 frontmatter는 사실 안그랬다.

`-----`를 기점으로 안의 내용들이 한 뭉탱이로 다 h2 처리되더라.

admonition도 별도로 처리해야하는 것 같지만 frontmatter는 메타데이터라 중요해서, 먼저 처리하기로 했다.

목표는 이러했다.

- `title`: 글 최상단에 h1으로 렌더링 & 사이드바에 렌더링
- `created_date`: 사이드바에 렌더링
- `updated_date`: 사이드바에 렌더링

그리고 하단의 방식으로 해결했다.

1. 필요한 패키지 설치

```bash
npm install remark-frontmatter remark-mdx-frontmatter
```

2. craco.config.js 수정

상단에 요거 추가하고

```js
module.exports = async (env) => {
  const { default: remarkFrontmatter } = await import('remark-frontmatter');
  const remarkMdxFrontmatter = (await import('remark-mdx-frontmatter')).default;
  ...
```

mdxRule의 options에 frontmatter 플러그인을 추가했다.

```js
options: {
  providerImportSource: "@mdx-js/react",
  remarkPlugins: [
    remarkFrontmatter,
    [remarkMdxFrontmatter, { name: 'frontmatter' }],
  ],
},
...
```

`import` 구문 쓰는데 애 좀 먹었어서 default에 대해 알아봐야겠다.

그나저나 모듈마다 CJS/ESM 호환 갈리는거 진심 탈모 요소 중 하나인듯

3. EditorPage.js, EditorSideBar.js 수정

- [EditorPage.js diff](https://github.com/Queue-ri/uniq/commit/ddaf1583b283330d1d1921c2fa2d7526d8200979)
- [EditorSideBar.js diff](https://github.com/Queue-ri/uniq/commit/dcad5883477bb30d15ebf2abc82043a2b2aa0c30)

<br />

#### 📌 다음 릴리즈 계획

서버 컴이 와서 놀고있기 때문에 좀 더 열심히 개발해야겠다.

다음 버전에선 publish한 mdx를 서버쪽으로 보내고, 서버에선 이를 쏴주는 api를 만들어야 한다.

그리고 private gh repo에 push가 되어야하기 때문에... 이리저리 고민한 결과

백엔드 API를 통해서 처리하는 것이 제일 정석적인 flow라고 생각한다.

왜냐하면,

- 카테고리 정보 받으려면 결국 백엔드 통신이 필요함
- Electron으로 렌더링 부분만 데스크탑 앱으로 빼면 프로젝트 복잡해짐
- FE단에 뷰어와 private repo 접근 기능 모두를 넣으면 보안상 안좋음.
- CORS 잘~ 설정하면 로컬 -> 리모트 통신 가능

그래서 내일은 express 작업을 할 것 같다.

</details>

### 📆 25-05-27

MDX publish API 구현

<details>
<summary>내용 보기</summary>

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq-cms/issues/1](https://github.com/Queue-ri/uniq-cms/issues/1)

<br/>

#### 📌 express 기본 세팅

백엔드 단 프로젝트 명을 `uniq-cms`로 정하고 express 서버로 세팅했다.

UI는 `uniq` CRA 프로젝트에서 다 맡고 있으니 `uniq-cms`는 headless CMS인 격이다.

```bash
npm install express
npm install --save-dev nodemon
```

디펜던시를 상단과 같이 설치하고 index.js와 post.js를 생성했다.

```js title="index.js"
const express = require('express');
const app = express();
const port = 6229;

// parse JSON body
app.use(express.json());

// set /api prefix for all endpoints
const postRoutes = require('./routes/post');
app.use('/api/post', postRoutes);

app.listen(port, () => {
    console.log(`🚀 uniq-cms running at http://localhost:${port}`);
});
```

```js title="post.js"
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`Post content ${postId} :3`);
});

router.post('/', (req, res) => {
    res.send('Post published.');
});

module.exports = router;
```

<br />

#### 📌 MDX Publish API 구현 (1/2)

Publish 요청이 들어오면 해당 MDX 파일에 대해 다음의 두 가지를 처리해야 한다.

1. 서버의 `/post` 경로에 저장
2. GH private repo에 push

그 중 1번부터 작업했다.

<br />

#### mdx 파일 저장하기

중복 파일명 문제에 대해선 MVP 단계에서 생각할 부분이 아닌 것 같아 나중에 처리하기로 했다.

```bash
npm install multer
```

```js title="post.js"
// temporary upload
const upload = multer({
    dest: 'temp_uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* Publish MDX file */
router.post('/', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No mdx file uploaded.');
    }

    // Check if the file is mdx
    if (path.extname(file.originalname) !== '.mdx') {
        fs.unlinkSync(file.path); // delete file if not mdx
        return res.status(400).send('Only mdx files are allowed.');
    }

    // set mdx save directory
    const postDir = path.join(__dirname, '../../post');

    // if not exist then mkdir
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
    }

    // final save path for the mdx file
    const targetPath = path.join(postDir, file.originalname);

    // move mdx file from temporary upload path
    fs.rename(file.path, targetPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to save file.');
        }

        res.send('Post published.');
    });
});
```

#### json 파싱하기

mdx 뿐만 아니라 json 데이터도 같이 필요해질 확률이 99.99%라서 json 파싱 로직도 추가했다.

```js
// parse json
let jsonData = null;
if (req.body.json) {
    try {
        jsonData = JSON.parse(req.body.json);
    } catch (err) {
        return res.status(400).send('Invalid json payload.');
    }
}
```

```text title="console.log 결과"
[DEBUG] Received json: { category: 'dev-note', title: 'uniQ 개발 노트' }
```

<br />

#### 📌 MDX Publish API 구현 (2/2)



</details>