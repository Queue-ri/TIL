---
title: 'uniQ 개발 노트'
eng_title: 'uniQ dev note'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: 'uniQ 개발 노트'
created_date: 2025-05-20
updated_date: 2025-06-14
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

frontmatter 파싱, FE `1.0.0-beta.1` 릴리즈

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

```bash
npm install simple-git
npm install dotenv
```

서버 최상단에 env를 불러오도록 설정한다.

```js
require('dotenv').config();
```

그리고 repo 권한 추가한 GitHub PAT를 발급하여 env에 넣는다.

그럼 push할때 sign in 창이 안뜨고 아묻따 push가 가능해진다.

<br />

#### 올바른 git 참조하기

`simple-git`으로 push util을 만들어서 모듈화하고, 이 모듈을 post.js에서 불러와 처리하고자 했다.

그런데 `/post`에서 git init하면 동기화를 못하기 때문에, 프로젝트 루트 경로의 git을 참조해야 한다.

```js
const gitPath = path.join(__dirname, '../../');
const git = simpleGit(gitPath);
```

따라서 simpleGit에 이런식으로 .git이 있는 루트 path를 넣어준다.

암튼 이렇게 해서 [pushToGithub.js](https://github.com/Queue-ri/uniq-cms/commit/1d08e7c0fec8f64a6ec5636148c6aa8e587683a2)를 작성했고

publish api에 GH push flow를 추가했다. ([5e00690](https://github.com/Queue-ri/uniq-cms/commit/5e00690ea1cc0d1551fe4f5793049810d9f2b50a))

<br />

#### git 작업 시 참고사항

push util로 main에 checkout 해서 push하려니까 현재 feature 브랜치에 있어서 stash 경고가 떴다.

- ➡️ stash하고 main으로 checkout 했는데 stash때문에 util 작성한게 다 과거로 돌아감 ㅋ

    - ➡️ stash pop을 했는데 merge conflict가 떠서 keep theirs로 stash 버전을 살리고 main에서 util 테스트를 진행했다.

프로덕션에선 브랜칭할 일이 없을테니 상관없지만 개발하는 repo에선 이거 좀 불편하다. 😐

그리고 publish 관련 커밋을 다이렉트로 main에 꽂아버리기 때문에 사용자 입장에서는 fork를 통한 CMS 관리가 어렵다. 업데이트를 위해 pull 땡길 시 충돌나기 때문.

어떻게 하면 api 버전업이 용이할지는 다음의 고민 사항이다.

<br />

#### 아직 DB 연결은 안되어있음!

push util 상의 설정 정보들은 (ex. remote url, username 등) 사용자가 수정할 수 있어야 한다.

그래서 DB에서 퍼오는걸로 점진적 수정을 거쳐야 하는데

우선 조회 api 먼저 구현해서 #1 이슈를 끝내고 #2에서 몽고DB 작업을 할 예정이다.

</details>

### 📆 25-05-28

MDX query API 구현, MongoDB 연결, publish API DB 연결

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq-cms/issues/1](https://github.com/Queue-ri/uniq-cms/issues/1)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq-cms/issues/3](https://github.com/Queue-ri/uniq-cms/issues/3)

<br/>

#### 📌 MDX query API 구현

DB 연결이 안된 상태라 mock으로 구색만 맞춰놓고 1번 이슈를 끝냈다.

```js title="post.js"
router.get('/:id', (req, res) => {
    const postId = req.params.id;

    if (postId === '1') {
        const filePath = path.join(__dirname, '../../post/test.mdx');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('[Error] Failed to read MDX:', err);
                return res.status(500).send('Failed to read post file.');
            }

            res.type('text/markdown').send(data);
        });
    } else {
        res.status(404).send('Cannot find requested post.');
    }
});
```

<br />

#### 📌 MongoDB 연결

뭣모르고 썼는데 Express 4.16.0 이상부터 `body-parser`가 내장되어있다고 한다.

```js
app.use(express.json());
```

그래서 index.js에 이렇게 설정해주면 all set이었던 거였음!

<br />

#### 📌 MongoDB 연결

```bash
npm install mongoose
```

```js title="index.js"
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/uniq-cms')
.then(() => console.log('✅ Successfully connected to MongoDB'))
.catch(err => console.error('❌ Failed to connect to MongoDB:', err));
```

<br />

#### 📌 Post Collection 정의

다음과 같이 Collection 스키마를 정의할 수 있다.

별도의 설정을 넣지 않는다면 자동 생성되는 Collection은 소문자 & 복수형으로 네이밍된다. (ex. Post -> posts)

`visibility`는 포스트 접근권한으로, enum으로 관리하기로 했다.

```js title="Post.js"
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    filePath: { type: String, required: true },
    visibility: {
        type: String,
        enum: ['public', 'protected', 'private'],
        default: 'public',
        required: true
    }
}, {
    timestamps: true, // automatically set createdAt and updatedAt
});

module.exports = mongoose.model('Post', postSchema);
```

<br />

#### Post Document 저장

JPA의 repository마냥 `require`로 Post 스키마를 불러와서 필요한 document를 저장하면 된다.

절대경로인 `targetPath`는 프로젝트 경로까지 포함하기 때문에 프로젝트 파일이 이동되면 관리하기 힘들어진다.

따라서 post 경로부터 시작하는 상대경로로 변환하여 저장했다.

이러면 post 경로가 바뀌어도 document에는 영향이 없다.

```js title="post.js"
const Post = require('../models/Post');

const projectRoot = process.cwd(); // project root path
const relativePath = path.relative(projectRoot, targetPath);

await Post.create({
    title: jsonData.title,
    category: jsonData.category,
    filePath: relativePath,
    visibility: jsonData.visibility
});
```

```json title="저장된 document"
{
  "title": "uniQ 개발 노트",
  "category": "dev-note",
  "filePath": "post\\test.mdx",
  "visibility": "protected",
  "createdAt": {
    "$date": "2025-05-28T14:13:13.519Z"
  },
  "updatedAt": {
    "$date": "2025-05-28T14:13:13.519Z"
  },
  "__v": 0
}
```

</details>

### 📆 25-05-29

MDX query API DB 연결, slug 필드 추가

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq-cms/issues/3](https://github.com/Queue-ri/uniq-cms/issues/3)

<br />

#### 📌 query API 수정하기

기존에 mock으로 하드코딩했던 부분을 MongoDB와 연결했다.

[post.js diff](https://github.com/Queue-ri/uniq-cms/commit/14532ee43556e9c44cb0db5ac6f81a54d2011931)

하지만 테스트해보니 요런 에러가 터졌다.

```
[Error] Failed to get post: CastError: Cast to ObjectId failed for value "1" (type string) at path "_id" for model "Post"
```

이 말인 즉슨 MongoDB에 보낸 1이라는 쿼리 값이 ObjectId가 아니라는 뜻이다.

mongoose의 `findById`는 내부적으로 _id가 MongoDB의 ObjectId 타입이라고 가정하는데 내가 무지성으로 MySQL 마냥 정수형 id 값을 날린게 원인이다.

Auto increment처럼 id 필드를 따로 만들어주는 방법이 있긴 했는데, 찾아보니 ObjectId를 사용하는 것이 일반적이고 성능도 가장 최적화되어있다고 하여 해당 방식을 그대로 따르기로 했다.

```
http://localhost:6229/api/post/683860a3561f6209b13787fb
```

그리고 ObjectId로 다시 호출하니 잘 조회되었다.

<br />

#### 📌 하지만 주소창에 683860a3561f6209b13787fb 를 쓸 순 없자너

그렇다. 그래서 UX와 SEO-friendly함을 고려하여 slug라는 것이 존재하는 것이었다.

> **slug란?**
>
> slug는 웹 페이지를 쉽게 읽을 수 있는 형태로 식별하는 URL의 일부이다.<br />
> 당연히 unique 해야 한다.

```text title="FE route URL"
http://localhost:3000/post/uniq-dev-note
```

그렇다면 FE에서 slug 기반 URL로 route 할 경우

```text title="FE -> BE request endpoint"
http://localhost:6229/api/post/683860a3561f6209b13787fb
```

FE가 BE에 ObjectId로 조회 요청을 날리는 flow가 되는데, 이는 아주 일반적인 방법이라고 한다.

개인적으로 정수형 id를 더 선호해왔어서 slug 방식이 SEO 이득을 보는지 몰랐다 😂

아무튼 스키마와 API 둘 다 slug 필드를 추가해주었고,

[Commit e51a8a8](https://github.com/Queue-ri/uniq-cms/commit/e51a8a8c88ce8148142a1c10aab7c7f7f8c8e6f5)

slugify라는 npm 패키지로 자동 생성도 가능하다는데 MVP 단계니까 있다는 것만 적어두고 패스한다.

```js
slug: { type: String, required: true, unique: true }
```

...그나저나 개발 일지 쓰면서 갑자기 보였는데 slug 필드에 unique 빼먹었다.

내일 fix하자 ㅋㅋㅋㅋㅋㅋㅋㅋ

<br />

#### 😙 내일의 계획!

내일은 리트코드 POTD 말고도 프로그래머스 문제 하나를 더 풀고 싶기 때문에 가능할지는 모르겠으나

- slug field fix
- MDX list query API impl
- 무시무시한(?) CORS setting

이 3가지가 일단 목표이고, 토요일이 5월의 마지막 날이니 이 날 뷰 작업이 얼추 되었으면 좋겠다고 생각한다.

6월부터는 DOKI 양도 봐드려야 하고 정처기 실기도 준비해야 되기 때문에~

</details>

### 📆 25-05-30

slug 필드 패치, MDX list query API 구현

<details>
<summary>내용 보기</summary>

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq-cms/issues/5](https://github.com/Queue-ri/uniq-cms/issues/5)

<br />

#### 📌 slug 필드의 누락된 제약 조건 패치

[Commit 4d2366a](https://github.com/Queue-ri/uniq-cms/commit/4d2366ad50275cc314537bf93c8d5eb992996149)

<br />

#### 📌 MDX list query API 구현

```diff
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
+   description: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    filePath: { type: String, required: true },
    visibility: {
        type: String,
        enum: ['public', 'protected', 'private'],
        default: 'public',
        required: true
    }
}, {
    timestamps: true, // automatically set createdAt and updatedAt
});
```

slug fix에 이어 목록 조회시 필요할 description 필드도 Post.js에 추가했다.

<br />

#### Post list query API

[Commit fdbd88c](https://github.com/Queue-ri/uniq-cms/commit/fdbd88c7f07efe287c65dab43a3e7a1735aa7465)

<br />

#### Timezone 지정하기

timestamp가 UTC 기준으로 찍히길래 query에 대한 timezone 변환도 필요하더라.

MongoDB config가 따로 없나 싶었는데 시간대 변환은 어플리케이션 레벨에서 처리하는 것이 일반적이라고 한다.

```bash
npm install dayjs
```

```js title="post.js"
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
```

상단과 같이 dayjs 패키지를 이용하여 UTC -> GMT+9로 변환한다.

```js title="post.js"
createdAt: dayjs(post.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
```

```json title="변환 전"
{
  "createdAt": "2025-05-29T13:26:59.764Z"
}
```
```json title="GMT+9 변환 후"
{
  "createdAt": "2025-05-29 22:26:59"
}
```

</details>

### 📆 25-06-09

CORS 설정, 포스트 목록 UI 구현, slug 기반 MDX query API 구현

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq-cms/issues/5](https://github.com/Queue-ri/uniq-cms/issues/5)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/7](https://github.com/Queue-ri/uniq-cms/issues/7)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq-cms/issues/7](https://github.com/Queue-ri/uniq-cms/issues/7)<br />
> [https://github.com/Queue-ri/uniq/issues/4](https://github.com/Queue-ri/uniq/issues/4)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/9](https://github.com/Queue-ri/uniq-cms/issues/9)

<br/>

#### 📌 CORS FE origin 허용하기

BE에 cors 패키지를 설치하고 허용할 origin을 명시해주면 된다.

왜이렇게 쉽게 해결됐지? 이게 아닌데? 싶지만 생각해보니 웹 공부 3년째다. 아직도 이해 못했으면 심각한 것이다.

CORS 설정 도중에 카카오 맵 API에서 허용 IP 주소를 설정했던 것이 떠올라서<br />
CORS origin도 동적으로 관리할 수 있는지 알아보았는데, 된다고 한다.

로그인 기능이 추가되면, 추후 관리자 페이지에서 설정 가능하면 좋을 것 같다.

```bash
npm install cors
```

```js title="index.js"
// allowed CORS origins
let allowedOrigins = [
  'http://localhost:3000',
];

// CORS middleware setting
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  }
}));
```

<br />

#### 📌 MainPage와 PostList 컴포넌트 구현

MainPage에서 fetching 관련 useEffect를 두고 PostList는 컴포넌트로써 렌더링만 담당하도록 분리했다.

data fetching은 페이지 단위에서 처리하는 게 일반적이라고 한다.

1. 유지보수 측면에서 데이터와 UI를 분리하는 것이 좋고
2. 다른 페이지와 데이터 공유가 용이해지며
3. route 전환이나 refresh 될 때 한번씩만 실행되어야 하기 때문이다.

<br />

#### 📌 `formatDate` 유틸 함수 구현

locale 기반 datetime 포맷팅이 자주 쓰일 것 같아 util로 모듈화하여 구현했다.

```js title="formatDate.js"
export function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
```

<br />

#### 💥 사실 slug로 조회 가능했어야 함 💥

😠.................😡.....

현재 MainPage에서 PostList를 통해 포스트 목록을 보여주고,

여기서 item 하나를 클릭하면 PostDetail로 라우팅해서 넘어가려고 했는데

이렇게 넘어가려면 `navigate`해야 하지만 URL 상에 id를 쿼리로 주지 않고는 컴포넌트에 넘기는게 안된다고 한다.

하지만 URL에 ObjectId가 노출되면 안된다. slug를 내가 왜 추가했는데 ㅜㅜㅋㅋ

`navigate`에 state를 줄 순 있지만 이는 새로고침시 bye 하는거라 refresh하면 포스트 내용이 증발하는 대참사가 일어나고

사실 redux-persist같은 상태관리 패키지 쓰면 안될것이야 없긴 한데,, 뇌절이다.

결국 미디엄, 노션 다 slug 기반 조회 API를 두길래, 보편성을 고려해서 BE에 API를 추가하기로 결정했다.

<br />

#### Origin 명시해줘요 ^ㅅ^

```
Error: Not allowed by CORS: undefined
    at origin (C:\Users\Hexagoner\Desktop\uniq-cms\api\index.js:22:16)
    at C:\Users\Hexagoner\Desktop\uniq-cms\node_modules\cors\lib\index.js:219:13
```

이젠 BE에 CORS 정책을 설정해놨기 때문에 포스트맨 헤더에 Origin을 명시해줘야 한다.

[유익한 CORS 관련 레퍼런스](https://okky.kr/articles/1459836)

</details>

### 📆 25-06-10

라우팅, 포스트 상세 UI 구현, CSS Module, 포스트 접근제어, BE `1.0.0-beta.1` 릴리즈

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq-cms/issues/9](https://github.com/Queue-ri/uniq-cms/issues/9)<br />
> [https://github.com/Queue-ri/uniq/issues/4](https://github.com/Queue-ri/uniq/issues/4)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/11](https://github.com/Queue-ri/uniq-cms/issues/11)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/6](https://github.com/Queue-ri/uniq/issues/6)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/11](https://github.com/Queue-ri/uniq-cms/issues/11)

<br/>

#### 📌 라우터 설정 및 PostViewPage 연결

```bash
npm install react-router-dom
```

```js title="index.js"
<Router>
  <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/post/:slug" element={<PostViewPage />} />
  </Routes>
</Router>
```

<br />

#### 📌 응답으로 받은 MDX 렌더링하기

이미 EditorPage에서 렌더링 로직을 구현했으나,<br />
PostViewPage에서 PostDetail로 건네주는 것은 MDX 파일 자체가 아니라 내용이 적힌 문자열이다.

따라서 MDX 문자열을 컴포넌트로 변환해주는 패키지와, frontmatter 파싱용 gray-matter가 필요.........

```bash
npm install @mdx-js/runtime
npm install gray-matter
```

.....할 줄 알았으나?

```text title="안되잖아"
Compiled with problems:
ERROR in ./src/component/post/PostDetail.js 7:0-45
Module not found: Error: Can't resolve '@mdx-js/runtime' in 'C:\Users\Hexagoner\Desktop\uniq\src\component\post'
```

필요하지 않았음 ^^

[패키지 사이트](https://www.npmjs.com/package/@mdx-js/runtime)에 가보니 @mdx-js/runtime은 deprecated 되었고

거기 공지에 `@mdx-js/mdx`를 쓰라고 해서 하라는대로 했다.

이렇게 되면 frontmatter는 기존에 쓰던 remark 플러그인을 사용하면 된다.

```js title="PostDetail.js"
useEffect(() => {
  const compileMdx = async () => {
    try {
      const compiled = await evaluate(mdxData, {
        ...runtime,
        useDynamicImport: false,
        format: 'mdx',
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
      });

      setContent(() => compiled.default);
      if (compiled.frontmatter) {
        setFrontmatter(compiled.frontmatter);
      }
    } catch (error) {
      console.error('MDX compile error:', error);
    }
  };

  compileMdx();
}, [mdxData]);
```

<br />

#### 📌 CSS 충돌과 모듈화를 통한 해결

MainPage의 CSS와 PostViewPage의 CSS가 충돌나는듯 했다. 같은 wrapper 클래스를 가지고 있었는데

자꾸 MainPage의 wrapper가 PostViewPage의 wrapper 사이즈로 지정되고, 타이틀 폰트도 꼬였다.

알아보니 foo.css 이런식으로 import하면 해당 CSS는 **전역 스코프**라고 한다.

이 경우 가장 마지막으로 로딩된 스타일을 적용한다고 했으니, MainPage에 PostViewPage 스타일이 적용되어버린 것이다.

따라서 **로컬 스코프인 CSS Module** 방식으로 변경했는데...

사실 이거 쓰면 해싱된 네이밍 때문에 가독성이 떨어져서 일부러 안하고 있었는데, 그냥 처음부터 쓸 걸 그랬나보다.

---

<center>⬇️ <b>하단부터는 포스트 접근제어 작업</b> ⬇️</center>

---

<br />

#### 📌 기존의 query API 수정

이제 protected와 private MDX는 direct access되면 안되기에

1. ObjectId 기반 query API는 보안상 제거 (=주석처리)
2. slug 기반 query API를 대표 query API로 지정 -> `/slug`를 삭제하여 endpoint 간소화
3. query API에서 MDX visibility만 조회하는 metaOnly 옵션 추가
4. query API에서 protected면 password verify하기
5. query API에서 private면 403 FORBIDDEN 던지기
6. list query API에서 private 포스트는 필터링하기

요런 API상의 많은 수정들이 필요하다. 관련 이슈는 [11번](https://github.com/Queue-ri/uniq-cms/issues/11)이므로 참고.

<br />

#### 🤔 API를 분리하는 것이 좋을까?에 대한 고민과 그 결과

최종적으로는 slug 기반 query API 하나로 통합하고 여기서 접근제어를 다 처리하기로 했다.

왜냐하면 API를 여러 개 분리해서 구현할 경우,<br />
*이럴땐 여기다 호출하고 저럴땐 저기다 호출하고...* 이렇게 되면

- FE: 여기선 엔드포인트 뭐였더라 ㅇㅁㅇ? (이전 코드나 API 문서 찾아보는 비효율성)
- BE: 헐 다른쪽 쿼리 API 유효성 검사 빼먹고 머지했다 (추가 이슈 처리하는 비효율성)
- 눈: 살려...ㅈ... (반복되는 fetch 코드로 인한 쓸데없는 라인 수 증가 및 시력 저하)

같은 상황이 발생하기 때문이다.

<br />

따라서 엔드포인트는 하나로 두고,

1. 포스트의 visibility check 모드 여부를 확인하는 `metaOnly` query와
2. private 접근 제한
3. protected 비밀번호 유효성 검증

이 모든걸 한 곳에서 처리하도록 설계했다.

<br />

#### 📌 패스워드에 bcrypt 적용하기

평문으로 저장하는 것은 매우 안좋은 인상을 남기므로 11번 이슈와 함께 처리한다.

- MDX publish API
- MDX query API

해싱은 두 가지 모두에 적용해야 한다.

일단 https 통신이기만 하면 FE -> BE 평문 전송은 괜찮다고 한다.

JWT같이 어디 저장할때가 문제인거고, 이건 그냥 타이핑해서 바로 보내는거니까.

```bash title="설치해주세요"
npm install bcrypt
```

[Commit ac395cd](https://github.com/Queue-ri/uniq-cms/commit/ac395cd792da1ba0d721a135afbfc87b69e7a454)

여기까지 BE 작업을 마무리하고 `1.0.0-beta.1`을 릴리즈했다. ~~*잔디에 반영하고 싶어서*~~

<br />

#### 🛠️ 포스트 상세 조회에 대한 FE 플로우 수정

기존에는 FE fetch 요청 -> BE 응답 -> FE 렌더링의 flow를 가지고 있었지만

현 시점부턴 접근제어 기능이 추가되었으므로<br />
FE meta 요청 -> BE 응답 -> FE fetch 요청 -> BE 응답 -> FE 렌더링의 방식으로 가야 한다.

meta 요청은 마치 HTTP OPTIONS나 preflight처럼, fetch라는 실질적인 요청을 날리기 전에

얘가 패스워드를 줘야 하는 포스트인가 아니면 그냥 요청해도 되는건가... 를 결정할 수 있도록 해준다.

<br />

#### 앞으로의 계획

현재 둘러보았을 때

- 페이지네이션 (API는 되어있는데 UI 상의 페이지네이션 없음)
- 썸네일 이미지
- 주인장 소개 영역
- 작고 소중한 footer
- TOC
- 네비게이션 메뉴
- 로그인

정도의 기본적인 보완 요소들이 보이는데,

여기서 페이지네이션과 주인장 소개 영역, footer만 추가하고 릴리즈해서 서버에 올릴 것이다.

베어메탈 세팅 + 네트워크 세팅에서 시간이 걸릴 것 같아서 내일 릴리즈하고 싶다.

publish API에 authentication이 필요하긴 한데... CORS로 막아보죠 뭐(?)

</details>

### 📆 25-06-11

페이지네이션 UI, layout shift 문제, config.js, About, Footer

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq/issues/6](https://github.com/Queue-ri/uniq/issues/6)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/8](https://github.com/Queue-ri/uniq/issues/8)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/14](https://github.com/Queue-ri/uniq-cms/issues/14)

<br/>

#### 📌 페이지네이션 추가

우선 전체 페이지 수를 API 상으로 안 알려주고 있으므로, BE에서 `totalPages`를 추가로 반환해주어야 한다.

```js {4} title="post.js"
res.json({
    page,
    size: postMetadataList.length,
    totalPages,
    posts: postMetadataList
});
```

그런 다음 FE에서 pagination 버튼과 그에 대한 handler를 만들어준다.

pagination도 여러가지 형태의 UI가 존재하는데,

나는 그 중 1 2 3 4 5 .. 형식의 多 버튼 UI는 피하기로 했다.

가장 익숙한 형태이나, 만드는데 조금 더 시간이 걸리기 때문이다.

![](https://velog.velcdn.com/images/qriosity/post/c6ce4bed-7c91-4f1b-9ee9-26695b14e902/image.png)

...한편으론 저번에 본 닌텐도 홈페이지의 페이지네이션 UI가 인상깊어서이기도 하다.

```js MainPage.js
const handlePrev = () => {
  if (page > 1) onPageChange(page - 1);
};

const handleNext = () => {
  if (page < totalPages) onPageChange(page + 1);
};

const handleInputChange = (e) => {
  setInputValue(e.target.value);
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
    }
  }
};
```

<br />

#### 뒤로가기시 페이지 초기화되는 문제

react-router-dom의 useSearchParams를 이용해서 현재 페이지 번호를 쿼리로 관리하고

뒤로가기해도 이전 페이지 상태가 유지되도록 했다.

다만 URL이 `http://localhost:3000/?page=2` 처럼 되는데 100% 만족스럽진 않다.

보통은 `http://localhost:3000/posts?page=2` 이런식으로 하니까...

근데 그럼 블로그같이 메인에 리스트 냅다 올려진 곳들은 어떡하지?

벨로그는 루트(각 사용자의 블로그 홈)를 `/posts`로 리디렉션하는 것 같다만.

<br />

#### 💥 Layout Shift

> Cumulative Layout Shift (CLS)
>
> Google이 웹 품질 측정을 위해 정의한 Core Web Vitals 중 하나로,<br />
> 사용자가 페이지를 보는 중에 얼마나 많은 레이아웃 변경이 누적되었는지를 수치로 평가한다.

메인페이지에서 페이지를 변경할때마다 Loading과 list item이 번갈아 렌더링되면서

우측의 스크롤바가 사라졌다가 생기고, viewport 사이즈 변화로 결국 컴포넌트들이 약간씩 이동하면서

시각적 불편함을 주는 문제가 있었다.

이걸 따로 부르는 용어가 있나 해서 찾아보니 진짜 있었다; 심지어 이걸로 품질 점수도 매김 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

마법의 1픽셀을 추가해서 해결했다. 후...

```css {3}
.wrapper {
  display: flex;
  min-height: calc(100vh - 69px + 1px); /* 1px: prevent annoying layout shift */
  flex-direction: column;
  padding-top: 32px;
  padding-left: calc((100vw - 1200px) / 2);
  padding-right: calc((100vw - 1200px) / 2);
}
```

하지만 위에 About 컴포넌트가 추가되니 이는 무용지물이 되었다. ㅜㅜ

보다 근본적인 해결책은 페이지 전환시 list 영역을 Loading 문구로 re-render 하지 않고

overlay같은 것으로 띄우는 것이다.

그럼 list는 이전 데이터였다가 최신 데이터로 갈아끼워지기만 할 것이다.

추후의 베타버전에서 손보도록 하자...

<br />

#### 📌 하드코딩 대신 config.js 사용하기

docusaurus에서 config를 통해 블로그명이나 meta 정보를 관리했던 것이 생각나서 적용해보았다.

컴포넌트에 하드코딩하는 것보단 유지보수 측면에서 편하기 때문에 해당 방식을 채택했다.

```js title="uniq.config.js"
export const UNIQ_CONFIG = {
  blogName: 'qriosity.dev',
  version: '1.0.0-beta.2',
};
```

```js title="Navigation.js"
<div className="Navigation">
  <div className="navLogo">{UNIQ_CONFIG.blogName}</div>
  <div className="version">{UNIQ_CONFIG.version}</div>
</div>
```

<br />

#### ✨ 여태까지 완성된 UI

하단은 오늘 분량 다 구현했다는 증거이다. 😎

피그마 없이 어찌저찌 눈대중으로 잘... 빌드했네

오늘 릴리즈하고 싶긴 했는데 생각해보니 EditorPage가 아직도 레거시 상태여서 그대로 올리기엔 무리인 것 같다.

그리고 CORS로 막아보겠다는 그거는... 네 안돼요

왜 안되느냐? CORS는 IP 차단책이 아니잖아..............

![](https://velog.velcdn.com/images/qriosity/post/84c62a08-3df6-4277-a6f4-9f4c9dad5da5/image.png)
![](https://velog.velcdn.com/images/qriosity/post/ba7618ad-3ae8-4646-968b-bd265300ad8a/image.png)

</details>

### 📆 25-06-12

EditorPage 보수, Publish API 연결, raw-loader, multer 인코딩 문제

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq/issues/8](https://github.com/Queue-ri/uniq/issues/8)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/10](https://github.com/Queue-ri/uniq/issues/10)

<br/>

#### 📌 User story였는데요, 아니였습니다.

기존에 쓰던 user story가 agile 원칙에 안맞고 오히려 acceptance criteria에 맞다고 해서

이슈 작성 형식을 다음처럼 수정하게 되었다.

![](https://velog.velcdn.com/images/qriosity/post/516688a7-84bf-4d26-8cfd-07b076e8ee92/image.png)

Agile에서 말하는 User Story의 핵심 구조는 이렇게 되어야 한다고 한다.

> As a **[type of user]**, I want **[some goal]** so that **[some reason/benefit]**.

반면에 Acceptance Criteria(수용 기준)는 user story가 '완료'되었는지 판단하는 구체적인 조건들을 뜻한다.

사용자가 아닌 개발자, 디자이너, PM, QA를 위한 체크리스트이다.

<br/>

#### 📌 EditorPage 진입 방식에 대한 고민

이제 루트 경로는 MainPage와 연결되어있기에 EditorPage는 다른 곳에 연결해야 한다.

그럼 MainPage에서 어느 경로로 진입할 수 있어야 할까?

일정 고민 하에 워드프레스를 떠올렸다. **WP는 UI상에 로그인 버튼을 노출시키지 않고 url로만 접근 가능**하다.

그리고 로그인 이후 대시보드에서 글을 작성할 수 있다.

현재 uniQ는 로그인 기능이 구현되어있지 않기에, UI상으로는 EditorPage를 노출시키지 않고 url로만 접근 가능하게끔 했다.

외부인이 어찌저찌 url 찍어서 접근 후 publish 기능을 사용하는 Access Control Bypass의 위험이 있으나

AWS 아니고 개인 서버라서 로그인 기능 추가되기 전까지 잠깐은 감수해도 될 것 같다.

<br/>

#### 📌 Conditional Rendering의 중요성

라우터 연결 후 EditorPage에 들어갔더니 이런 에러가 떴다.

```
Cannot read properties of null (reading 'title')
TypeError: Cannot read properties of null (reading 'title')
```

frontmatter가 파싱되지 않아 undefined 상태인 듯하다.

원래는 에러 안떴는데 비동기라서 운좋게 그땐 안걸렸던듯 ㅋㅋ

```js {1} title="EditorPage.js"
{frontmatter && (
  <div className="meta">
    <h1>{frontmatter.title}</h1>
  </div>
)}
```

그래서 해당 코드를 찾아본 후 `frontmatter &&`를 추가해서 해결해줬다...만

<p style={{fontSize: '32px'}}><b>아오 그놈의 할루시네이션</b></p>

원래 상황이 뭐였냐면, 내가 *'경로에 mdx 파일 없을때 컴포넌트 렌더링하지 말고 안내 문구 나오게 코드 수정해줘'* 라고 했었는데

GPT 얘가 아무말 없이 `frontmatter &&` 있는 버전으로 코드를 뽑아놓고, 내가 에러 뜬다고 말하니까 이상한걸 원인으로 짚기 시작했다.

얘가 준 EditorPage 코드랑 내 코드 상태랑 동일하게 작성된게 맞는지부터 검토해야 하는데

걍 자기꺼 버전 기준에서만 생각하니 애꿎은 craco config를 의심한다.

그런데 이젠 gpt 할루시네이션 패턴에 익숙해져서 안속음. 🙃ㅋㅋ

보통은 수정된 부분에 주석으로 표시해달라고 하는데 생략하니까 이 모양이다. 프롬프트는 템플릿 세팅같은거 없나?

<br />

#### 📌 null/undefined frontmatter 처리하기

```markdown title="MDX"
---
---

## 안녕하세요 전 제목이에용

안녕히계세요
```

이건 **null** frontmatter 이고

```markdown title="MDX"
## 안녕하세요 전 제목이에용

안녕히계세요
```

이건 **undefined** frontmatter이다.

만약 frontmatter에 `title` 등의 필드가 있었다가, 사라지면 어떻게 될까?

이상적인 UI 작동은, EditorSideBar에서 공문자열로 re-render 해주는 것이다.

```js title="EditorSideBar.js"
useEffect(() => {
  // auto generate default slug based on title
  // ...

  // init with frontmatter values if exist else empty string
  setTitle(frontmatter?.title ?? '');
  setCreatedDate(frontmatter?.created_date ?? '');
  setUpdatedDate(frontmatter?.updated_date ?? '');
}, [frontmatter]);
```

`??` 연산자는 **null 병합 연산자(nullish coalescing operator)**로,

왼쪽 피연산자가 null 또는 undefined일 때 오른쪽 피연산자를 반환한다.

optional chaining은 아는데 얘는 처음 봐서 찾아봄!

<br />

#### 💥 자스로 로컬 파일 첨부 안됨

```
Not allowed to load local resource: file:///C:/Users/Hexagoner/Desktop/uniq/src/post/test.mdx
```

로컬 파일을 fetch해서 File 객체 생성하고 이걸 페이로드에 담으려 했는데,

보안 정책 상 로컬 파일은 사용자가 input을 통해 직접 첨부해야 한다고 한다.

...........................ok..... (보안은 ㅇㅈ)

그렇다면 다른 방법을 떠올려보자.

<br />

#### ✅ Webpack의 raw-loader로 MDX 내용 퍼오기

craco config에 raw-loader를 추가한 뒤 앱을 재시작해주고

```js title="보안상 안되는 코드"
// get file blob by fetching the fileUrl then create File object
const response = await fetch(fileUrl);
const blob = await response.blob();
const fileName = filePath.replace('./', '');
const file = new File([blob], fileName, { type: 'text/markdown' });
```

작동 불가한 이 코드를 하단처럼 수정해준다.

```js title="로컬 MDX 첨부 우회 방법"
const filePath = keys[0]; // ex. './sample.mdx'
const fileName = filePath.replace('./', '');
const publishFileName = `${slug}.mdx`;

// dynamic import mdx file by raw-loader
const rawModule = await import(
  /* webpackChunkName: "raw-mdx" */
  /* webpackMode: "lazy" */
  `../post/${fileName}?raw`
);

// rawModule.default -> content of the file (as string)
const content = rawModule.default;

// create File object
const file = new File([content], publishFileName, { type: 'text/markdown' });
```

raw-loader로 MDX 원본 내용을 가져와서 (즉, 파싱 안한 원본 내용을 문자열로 가져옴)

File 객체로 생성한 뒤 formData에 첨부하는 방식이다.

<br />

#### 💥 multer는 별도의 UTF-8 설정이 필요

FE에서 파일명을 `{slug}.mdx`로 바꾸고 request 날리는데

slug에 한글이 있을 때 백엔드에서 인코딩이 깨지는 이슈가 있었다.

```
python-ë°±ì¤-nqueen-ë¬¸ì -íì´.mdx
```

FE는 문제 없었다. 브라우저는 내부적으로 multipart/form-data의 파일명을 UTF-8로 인코딩한다고 한다.

원인은 BE의 multer 설정이었는데 

```js
const upload = multer({
  dest: 'temp_uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
```

이렇게 설정하면 기본적으로 파일명은 **Latin-1 (ISO-8859-1)** 인코딩으로 처리된다고 한다.

따라서 하단과 같이 수정해주었다.

```js title="post.js"
const storage = multer.diskStorage({
    destination: 'temp_uploads/',
    filename: (req, file, cb) => {
        // Change filename encoding from Latin-1 to UTF-8
        try {
            const rawName = file.originalname;
            const utf8Name = Buffer.from(rawName, 'latin1').toString('utf8');

            console.log('originalname (raw):', rawName);
            console.log('originalname (utf8):', utf8Name);

            cb(null, utf8Name);
        } catch (err) {
            console.error('Filename decode error:', err);
            cb(err);
        }
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});
```

그런데 출력이........ raw만 출력되고 utf8이랑 console.error는 흔적도 없는데요??

자정 내로 작업 끝내긴 글렀군 ㅜㅜ

---

아 깨달았음

raw 출력하면서 깨진 인코딩때문에 뒤에 이어지는 출력된 문자열을 먹어버린 것임

이걸 따로 부르는 용어가 있나 싶어 찾아보니 딱히 대표적인 용어라기보단

**Terminal Pollution 또는 Console Pollution** 정도로 부르면 될 것 같다.

```js title="post.js"
const storage = multer.diskStorage({
    destination: 'temp_uploads/',
    filename: (req, file, cb) => {
        // Change filename encoding from Latin-1 to UTF-8
        try {
            const utf8Name = Buffer.from(file.originalname, 'latin1').toString('utf8');
            console.log('latin1 decoded:', utf8Name);
            cb(null, utf8Name);
        } catch (err) {
            console.error('Filename decode error:', err);
            cb(err);
        }
    },
});
```

```
latin1 decoded: python-백준-nqueen-문제-풀이.mdx
```

이렇게 뽑아보니 잘 출력되긴 하는데, 문제는 저장된 파일명은 여전히 인코딩이 깨지는 이슈가 있었다.

좀 더 살펴보니 API 내부에서 `file.originalname`으로 접근하고 있던게 원인이었다.

`originalname`은 FE로부터 받은 원본 파일명이고, multer에서 cb(callback)로 지정한 값은 `filename`으로 들어간다고 한다.

따라서 해당되는 모든 부분들을 `file.filename`으로 수정했고 인코딩 이슈는 종결되었다.

![](https://velog.velcdn.com/images/qriosity/post/12758b0c-e3e4-4477-b5b0-a5f32fa7a8f8/image.png)

![](https://velog.velcdn.com/images/qriosity/post/003bd5c3-5721-46c8-b895-f1a64234819f/image.png)

<p style={{fontSize: '64px'}}><b>어휴.</b></p>

오늘은 예상보다 오래 걸렸다.

뒤로가기 버튼부터는 ~~*내일*~~ 오늘 오전에 하자. 밤낮 바뀌면 안됨.

</details>

### 📆 25-06-13

포스트 썸네일 추가, transition 문제 해결, react hook 규칙, 최.신.C.S.S, GH push 로직 수정, 에러 핸들링 개선, CSS 조정

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues
> [https://github.com/Queue-ri/uniq/issues/10](https://github.com/Queue-ri/uniq/issues/10)<br />
> [https://github.com/Queue-ri/uniq/issues/12](https://github.com/Queue-ri/uniq/issues/12)<br />
> [https://github.com/Queue-ri/uniq-cms/issues/14](https://github.com/Queue-ri/uniq-cms/issues/14)

#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/12](https://github.com/Queue-ri/uniq/issues/12)

<br/>

#### 📌 frontmatter에 `image` 추가

![](https://velog.velcdn.com/images/qriosity/post/1fc02bb5-ff2d-443d-abe7-02a34a36e17f/image.png)

![](https://velog.velcdn.com/images/qriosity/post/b30ba6ab-77ee-4f8f-bde4-5b3d85085080/image.png)

대표 썸네일용 `image` 필드를 추가하고 그에 맞추어 FE, BE를 업데이트했다.

카카오톡이 2:1이고 벨로그, 유튜브 등은 16:9라서 썸네일 비율을 어떻게 할지 고민되었는데

2:1 해보니까 너무 길쭉해서 ㅋㅋㅋ 16:9로 설정했다.

관련 이슈는 [12번](https://github.com/Queue-ri/uniq/issues/12)이다.

<br />

#### 📌 Post item의 box-shadow 버그

PostList의 각 item에 hover할 시 생기는 그림자가 버벅대는 현상이 있었는데<br />
(transition은 되는데 transition 끝나기 전까진 하단에 있는 item에 가려져서 렌더링되는 느낌)

뭐라 설명해야되는지 모르겠는데 직감적으로 z-index가 애매해서라는 생각이 들었다.

item끼리 z-index가 동일해서 그런 것 같은데?

그래서 `:hover`에 z-index를 지정해줬고 실제로 해결이 되었다.

<br/>

#### 📌 svg 에셋 추가 및 컬러 조정

![](https://velog.velcdn.com/images/qriosity/post/750a9711-7106-4632-86df-a3230f0fcd05/image.png)

뒤로가기 화살표... 피그마 열기 귀찮아서 DOKI에서 뜯어왔다 ㅋㅋ...

public에 넣는거 아니고 **src 하위에 asset 폴더 새로 만들어서 넣어야 react 컴포넌트로 불러올 수 있다.**

svg color를 CSS로 조정하는 방법은 우선 svg 코드를 까서 path 부분의 fill을 `currentColor`로 지정해주는 것이다.

좀 유연하게 코드를 보고 수정해줘야 하는데, 대부분 path 수정해주면 다 된다.

<br/>

#### 💥 motion과의 transition 겹침 문제 해결

motion으로 post 관련 컴포넌트에 transition을 넣었는데

PostList의 각 item에 CSS로 설정된 hover transition과 motion의 transition이 겹치는 문제가 있었다.

겹쳤다기보단 그냥 둘이 나란히 수행되는데, 서로 transform의 duration이 달라서 버벅이는 것처럼 보였다.

따라서 motion은 그대로 두고 CSS에서

```css
.postItem:hover {
  box-shadow: 0 6px 32px rgba(142, 82, 255, 0.15);
  transform: translateY(-2px);
  border-left: 6px solid #8e52ff;
  z-index: 99;
}
```

이거를 없애고

```css
/* post item hover-ready transition after motion triggered */
.hoverReady {
  transition: border 0.4s ease-out, box-shadow 0.5s ease, transform 0.5s ease;
}

.hoverReady:hover {
  box-shadow: 0 6px 32px rgba(142, 82, 255, 0.15);
  transform: translateY(-2px);
  border-left: 6px solid #8e52ff;
  z-index: 99;
}
```

이렇게 `hoverReady`라는 별도의 클래스로 분리했다.

motion transition 끝나기 전까진 hover transition이 필요 없기 때문에, 기본적으론 `hoverReady`를 붙이지 않고

motion의 `onAnimationComplete` 콜백을 이용해서 motion transition 끝난 애들을 state로 관리하여

걔네들만 `hoverReady` 클래스를 붙여주었다.

또한 페이지 바뀔때마다 API로 응답 오면 useEffect로 hoverReady를 다시 떼어주었다.

안그럼 페이지 넘기면서 transition이 또 겹치게 되기 때문이다.

<br />

#### 📌 React hook 사용 규칙을 따르자

```
React Hook "useEffect" is called conditionally.
React Hooks must be called in the exact same order in every component render.
Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks
```

`useEffect`는 react hook 사용 규칙에 따라 return문이 포함된 조건문 아래 놓이면 안된다.

```js
if (loading) return <p>Loading...</p>;
if (error) return <p>Error!</p>;

useEffect(() => {
  // ...
}, [posts]);
```

다시 말해 이런 코드 구조면 안된다는 것이다.

이는 `useEffect`가 조건부로 호출되면 안되고 일관되게 호출되어야 하기 때문이다.

웬만하면 최대한 상단에 놓아주자.

<br />

#### ✨ WA! 최신 CSS!

```css
html {
  scrollbar-gutter: stable;
}
```

- 스크롤바가 생겨도 레이아웃 너비는 고정됨
- 모던 브라우저 지원 (Chrome, Edge, Firefox 등)
- **Safari는 아직 지원하지 않는다.** (2025년 기준)

`overflow-y: scroll` 보다 맛있어서 사파리 버리고 이거 씀 사파리가 알아서 나중에 지원하라 그래

저 한 줄로 layout shift의 80퍼는 잡힌 것 같다. 후...^^

---

<center>⬇️ <b>하단부터는 백엔드 API 보수 작업</b> ⬇️</center>

---

#### ✨ pushToGithub 로직 수정

원래 uniq-cms의 repo에 push하는 방식이었는데 계속 사용해보니 별로인 것 같다.

- uniq-cms는 결국엔 npm package가 되어야하는 녀석임
- 패키지에 docs가 들어가나요? 아니잖아;

그래서 분리했다.

사용자 입장에서는 npm으로 uniq-cms 버전 관리를 하고,

사용자만의 uniq-posts repo를 따로 생성 후 거기에 포스트를 저장하는게 관리에 용이할 것이다.

그리고 일단 분리를 해두어야 경로 변경이 생겨도 이전의 커밋 기록이 날라가지 않는다. (잔디 중요 ^ㅅ^)<br />
repo 자체가 중간에 변경돼서 커밋 내역 다 날라간다고 상상해보자. 이 얼마나 슬픈지...

따라서 `pushToGithub`에 인자로 넘기던 github username과 repo를 env로 분리하고 (username은 없앴다)

필자는 qriosity-posts라고 repo를 생성해서 해당 repo에 연결했다.

최종적으로, `/post` 경로를 git 저장소로 사용해서 category로 폴더링하고 동기화하는 방식으로 변경되었다.

![](https://velog.velcdn.com/images/qriosity/post/82926b9a-b6a5-437c-8c57-2f0f788881db/image.png)

그나저나 경로에 git 2개 있으면 vscode에서 둘 다 띄워주네 와우 ㄷ smart~

<br />

#### ✨ 에러 핸들링 개선

FE에서 publish하다가 제일 많이 터지는 실패 원인이 slug 중복인데

에러 핸들링이 부실해서 그냥 실패했다는 식으로만 alert 되었었다.

이 점이 너무 불편해서 릴리즈 전에는 손봐야겠다는 생각이 들었다.

MDX 첨부 실패(=multipart File 객체 첨부 실패)와<br />
첨부 성공 후 BE에 요청했는데 BE에서 실패했을 시 MongoDB의 에러 메시지를 FE에서 확인할 수 있도록 BE의 에러 핸들링을 보완했다.

<img src="https://velog.velcdn.com/images/qriosity/post/51a367be-cb9a-418c-bf11-8f6622f5f6e2/image.png" width="700px" height="auto" />

<br /><br />

그리고 참고로,

```js
try {
  const res = await fetch('http://localhost:6229/api/post', {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    alert('Successfully published the post!');
  }
  else { // 4xx, 5xx
    const errorText = await res.text();
    throw new Error(`[${res.status}] ${errorText}`);
  }
} catch (err) { // network error: Server down, DNS, CORS
  alert(`Failed to publish:\n ${err.message}`);
}
```

4xx, 5xx 에러는 catch로 빠지지 않는다. catch는 네트워크 에러에 대한 블록이기 때문이다.

그래서 else에서 throw해서 catch로 빠지도록 했다.

<br />

#### ✍ 차후를 위한 개선 가능 사항 기록

publish 로딩 속도의 9할은 깃허브 푸시 작업인 것 같다.

아무래도 동기식이라 그런듯한데 비동기로 빼서 개선해볼수 있을 듯하다.

<br />

---

#### 내일(또 자정 넘어버려서 오늘)은....

FE는 favicon이랑 title 변경하고, <br />
BE는 오늘 수정으로 production ready 수준이 된 것 같으니 버전 올리고 그대로 main에 머지할 것이다.

</details>

### 📆 25-06-14

FE meta 변경, 모바일 레이아웃 막기

<details>
<summary>내용 보기</summary>

#### 📌 Closed Issues


#### 📌 Opened Issues
> [https://github.com/Queue-ri/uniq/issues/14](https://github.com/Queue-ri/uniq/issues/14)

<br/>

#### 📌 FE metadata 변경

WIP

</details>