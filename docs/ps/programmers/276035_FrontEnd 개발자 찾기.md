---
title: '276035 - FrontEnd 개발자 찾기'
eng_title: '276035 - FrontEnd 개발자 찾기'
slug: '/ps/programmers/276035_FrontEnd 개발자 찾기'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '276035 - FrontEnd 개발자 찾기'
sidebar_position: 276035
created_date: 2025-08-31
---

# 276035 - FrontEnd 개발자 찾기

:::info

- **문제 보기**: [276035 - FrontEnd 개발자 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/276035)
- **소요 시간**: 8분 52초
- **풀이 언어**: `mysql`
- **체감 난이도**: 3️⃣~4️⃣
- **리뷰 횟수**: ✅

:::

<br />

### 풀이 키워드

<details>
<summary>스포주의</summary>

`JOIN` `&`

</details>

<br />

### 풀이 코드

```sql
WITH FE AS (
    SELECT SUM(CODE) AS SUM_CODE
    FROM SKILLCODES
    WHERE CATEGORY = 'Front End'
)

SELECT ID, EMAIL, FIRST_NAME, LAST_NAME
FROM DEVELOPERS D
JOIN FE F
ON F.SUM_CODE & D.SKILL_CODE > 0
ORDER BY ID;
```

<br />

### 풀이 해설

`DEVELOPERS`의 스킬이 전부 `SKILL_CODE`에 비트테이블 식으로 저장되어있는데

여기서 비트마스킹을 통해 FE 스킬을 가지고 있는지 확인해서 추리는 문제이다.

<br />

#### 풀이 순서

1. 모든 FE 스킬 코드를 하나의 코드로 합산해서 `FE` 테이블 생성
2. `DEVELOPERS`의 스킬 코드와 `FE`의 코드를 bitwise and해서 양수일때만 `INNER JOIN`
3. ID로 오름차순 정렬


<br />

### 메모

- 서브쿼리는 가독성에 좋지 않으므로 `WITH`를 활용하자
- FE가 테이블이라서 `WHERE`가 아니라 `JOIN`을 써야 함
- `ON`에 비트연산자 넣을 수 있는거 첨 알음