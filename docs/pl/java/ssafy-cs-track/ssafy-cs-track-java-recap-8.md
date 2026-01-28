---
title: "SSAFY 전공자 자바반 개념 정리 - 8"
eng_title: "SSAFY CS Track Java Recap - 8"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_position: 8
created_date: 2026-01-28
---

# SSAFY 전공자 자바반 개념 정리 - 8

:::note 별 내용은 아닌데

<img src="https://velog.velcdn.com/images/qriosity/post/e698c2d9-5051-407a-a360-f8badec7cd9b/image.png" width="720px" height="auto" />

킹외비때문에 공개하지 않습니다.

:::

:::info 좋았던 시절

오늘부터 알고리즘 개념 수업입니다. 자바 개념은 어제([recap 7](https://til.qriosity.dev/featured/pl/java/ssafy-cs-track/ssafy-cs-track-java-recap-7))가 끝‼️

:::

:::danger 시험 개망함

<img src="https://i.namu.wiki/i/6SW8BT5PVWiK_v64vH0umDoRKeL9lLhOmM_ieDdprfoSMqCgBQCe_ddNGdCpGfJgHs-2Bzk63yEjfy_THDGvrYrwGVBNLTQwubqjd48YtrHonqg3yL7HpWDpr0NBAmcKBvtrRv2aspO_G4DUE7_VaQ.webp" alt="따봉" width="150px" height="auto" />

시험 좌석의 sts 환경 억까로 20분을 날린 큐리는 눙물을 머금고 집에서 문제를 복습하게 되는데...<br />

<br />

#### 🛠️ STS 환경 체크하기

STS 5버전이어야 하고, 21버전으로 세팅된거 확인하고, module 파일 체크는 해제................<br />
아 그냥 똥텔리제이 얼티밋 라이선스 내놔!!!!!

<img src="https://velog.velcdn.com/images/qriosity/post/b23bd983-992b-4fd5-9e89-eb45afdf37a3/image.png" alt="sts 새 프로젝트 생성창" width="600px" height="auto" />

:::

import DeQrypter from '@site/src/components/mdx-crypto/DeQrypter';

<DeQrypter encrypted="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" />