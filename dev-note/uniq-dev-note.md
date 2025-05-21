---
title: 'uniQ 개발 노트'
eng_title: 'uniQ dev note'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: 'uniQ 개발 노트'
created_date: 2025-05-20
updated_date: 2025-05-21
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

### 📆 25-05-20

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

```sh
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