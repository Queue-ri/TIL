---
title: 'uniQ 개발 노트'
eng_title: 'uniQ dev note'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: 'uniQ 개발 노트'
created_date: 2025-05-20
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

</details>