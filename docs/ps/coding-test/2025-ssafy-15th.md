---
title: '2025 SSAFY 15기 1차수(오전)'
eng_title: '2025 SSAFY 15th Cohort (Phase 1)'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_position: 0
created_date: 2025-12-26
---

# 2025 SSAFY 1차수(오전)

:::info

- **문제 수**: 2문제
- **소요 시간**: 풀이 60분 / 검토 20분 / 총 80분
- **풀이 언어**: `python`
- **체감 난이도**: 2️⃣~2.5
- **리뷰 횟수**: ✅

:::

<br />

### 코테 준비

:::tip 빡공할거면 D3 추천순으로 밀면 된다.

:::

[SWEA](https://swexpertacademy.com/main/main.do) 환경이랑 비슷하대서 자바 던지고 파이썬 잡았다.

전날 D3 레벨 S/W 문제해결 기본, 응용 각 1문제씩 총 2문제 풀다가 급 졸려져서 파이썬 정리 한번 훑고 잠... 😴

<br />

### 응시 후기

- 메일로 날라오는 감독 링크는 폰접해야 하고 응시 페이지는 싸피 홈페이지로 컴접해야 한다.
    - 폰접에서 별별 오류 다 터졌는데 해결할 시간 넉넉하고 감독관이 잘 알려주니 바로 문의하자.
- 감바감이 존재한다.
    - 나처럼 카와이 보송 친절한 young 감독관 당첨될 수도 있고
    - 옆집처럼 무서운 FM old 감독관 당첨될 수도 있음
    - 인텔리제이는 감독관에 따라 허용되기도, 안되기도 했다.
- 보안프로그램으로 브라우저 화면도 모니터링 한 것 같다.
    - 플머는 API 레벨로 모니터링 요청해서 알았는데
    - 싸피는 피방 카운터마냥 조용히 추적하는듯
- 시험 시작 전 종이, 신분증을 검사하고 360도 룸투어를 시킨다.
- ⚠️ **끝날때도 룸투어 시킨다. 일찍 끝나서 검사 안받고 그냥 나가면 부정행위 처리됨.**

<br />

### 풀이 후기

:::info 한줄평: 구현력보단 사고력을 요구하는 좋은 문제 👍️

:::

#### 📌 '2솔 호소인'이 등장하는 이유

문제 채점 기준이 좀 세밀한 것 같은데 개인적으로 이렇게 느꼈다.

| 채점단계 | 샘플 TC 채점 | 히든 TC 채점 | 복잡도 최적화 | ACCEPT 여부 | 2번 열람 가능? | '솔' 여부 |
|--------|------------|------------|------------|-------------|-------------|----------|
| 0단계 | X | X | X | X | X | X |
| 1단계 | ☑️ | X | X | ACCEPT | X | X |
| 2단계 | ☑️ | ✅ | X | ACCEPT | **가능** | 솔 |
| 3단계 | ☑️ | ✅ | 💯 | ACCEPT | **가능** | 솔 |

그래서 2솔이라고 생각했는데 2번 문제를 1단계로 ACCEPT만 받은거라서 2솔 호소인이 되는 경우들이 있나보다.

두 문제 모두 최적화까지 하기에는 골딱이 입장에서 시간이 빠듯하게 느껴졌다. 합격 여부에는 크게 관여하지 않는듯?

그것보다 2단계 수준으로 정확하게 풀이하는게 중요한데 응시자들 평을 보면 서울캠은 마지노선이 1솔이겠다는 생각이 들었다.

#### 📌 풀이 환경

접속 상태나 버벅임은 프로그래머스보다 훨씬 안정적이어서 좋았다.

하지만 문제 풀이에 중요하게 사용되는 버튼들의 접근성이나 스크롤 조작이 잦은 점들은 아쉬웠다.

#### 📌 그 외...

- 1번 완벽 AC면 자동으로 2번 띄워지는줄 알았는데 그랬다는 사람이 없는걸로 보아...?
- 1차수(오전)가 2차수(오후)보다 어렵게 출제됐다는 평이 존재
- 출제 스타일은 코테 도입 초창기 느낌
    - 컴퓨팅적 사고력을 평가함. 구조적 + 수학적 사고 필요.
- 삼성답게 정확한 정의 기반 구현력 좋아함
    - 연습 종이는 웬만하면 사용하는 것을 추천한다.

<br />

### 풀이 상세

import DeQrypter from '@site/src/components/mdx-crypto/DeQrypter'

<DeQrypter encrypted="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" />