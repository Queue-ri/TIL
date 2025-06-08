---
title: 'Camo 이미지 캐시 재생성하기'
eng_title: "How to invalidate Camo image cache"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: 'Camo 이미지 캐시 재생성하기'
sidebar_position: 3
created_date: 2025-06-08
---

# Camo 이미지 캐시 재생성하기

## 문제 상황

LeetCode badge를 프로필 README에 `img` 태그로 올렸었는데,

하루가 지나도 최근에 받은 신규 뱃지가 안 뜨는 문제가 있었다.

<img src="https://velog.velcdn.com/images/qriosity/post/e4cbb427-5279-45ad-b69a-b0e119636222/image.png" width="700px" height="auto" alt="문제 상황" />

GitHub 캐시 문제는 최대 일주일까지 지켜보다가 자동으로 해결된 적이 있었지만

이번엔 혹시 다른 방법이 있나 해서 알아보았더니 진짜 있었다😮 진작 찾아볼걸;

<br />

## 원인

GitHub는 이미지 프록시로 [Camo](https://github.com/atmos/camo)를 사용한다.

웹 페이지가 https로 로드되어도, 그 안의 이미지 등 일부 요소가 http로 로드되면 **혼합 콘텐츠 경고**가 뜨는데

Camo는 `https://camo.githubusercontent.com/`로 시작하는 프록시 url로 콘텐츠를 제공하여 이를 방지한다.

<br />

### 💥 부적절한 캐시 정책

필자가 사용한 LeetCode badge API가 별도의 캐시 정책을 지정하지 않은 것 같은데

이렇게 되면 Camo의 캐시 정책으로 이미지를 관리하게 된다고 한다.

결국 API를 호출했을땐 멀쩡히 최신 정보가 나오던게 Camo를 통해서는 계속 과거만 보여주게 되었다.

<br />

## 해결 방안

### 캐시 정책 설정하기

API가 본인 것이면 캐시 정책을 추가해주면 된다.

```yaml
cache-control: no-cache
```

`no-cache`는 매번 서버로 재검증 요청을 보내도록 강제한다.

<br />

### Camo 캐시 삭제하기

API가 본인 것이 아니면 **Camo에 curl 요청을 날려서 캐시를 삭제할 수 있다.**

```bash title="캐시 삭제 요청"
curl -X PURGE https://camo.githubusercontent.com/dcf67d714c95...
```

```json title="응답"
{ "status": "ok", "id": "1450056-1748980571-2400" }
```

<br />

## 결과

최대 일주일치의 고민거리가 사라졌다. 얏호!!

~~*하지만 뱃지 사이즈가 마음에 안들어서 결국 쪼갰다는 후문*~~

<img src="https://velog.velcdn.com/images/qriosity/post/42ffd8c6-588c-4c2e-b90f-6b40fe4c3ad4/image.png" width="700px" height="auto" alt="해결 방안" />