---
title: '정보처리기사 실기 프로그래밍 문제 유형'
eng_title: 'EIP Programming Question Patterns'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '정처기 실기 프로그래밍 문제 유형'
sidebar_position: 98
created_date: 2025-07-21
---

# 정보처리기사 실기 프로그래밍 문제 유형

:::info

이 글에서는 개정된 정보처리기사 실기 시험의 프로그래밍 문제 유형에 대해서 다룬다.<br />
프로그래밍 문제는 전공자 비전공자 할 것 없이, 해당 언어를 좀 써봤으면 하루 벼락치기도 가능한 수준이다.<br />
언어에 익숙하다면 거저 주는 문제인데 10문제 가량 되므로, 나오지도 않을 개념 달달 외우는 불상사가 없도록 하자.

:::

## 들어가기에 앞서..

### 🕗️ 벼락치기러를 위한 정상화 타임 존재

9시에 시험 시작하는줄 알았는데 9시까지 입실이고

9시부터 9시 30분까지 방송을 핑계로 벼락치기러들 기억을 포맷시키는 정상화 타임이 존재한다.

<br />

### 🦓 검은건 코드요 흰건 종이로다

흑백 인쇄이므로 코드에 prettify 따윈 되어있지 않고, 라인 넘버도 없다.

그리고 파이썬 제외 Java 등에선 indent를 정확히 안지킨다.

```java
public static void main(String[] args) {
코드가
이렇게
써있어요
}
```

<br />

## Java

정처기에서 제일 현웃인건 자바 파트이다. 수험생을 어떻게든 틀리게 하려는 출제진의 눈물나는 노력이 느껴진다.

대체 어디서 다들 알아온건지 모를, 실무에서 쓸 리 없는 각종 안티패턴을 들고 온다.

### 📌 스텔스 `super`

### 📌 업캐스팅

### 📌 `static` 변수와 동적바인딩

### 📌 `static` 메소드와 동적바인딩

### 📌 call by value를 아십니까?

<br />

## C

### 📌 포인터와 배열

### 📌 연결리스트

### 📌 큐

### 📌 비트 연산

### 📌 call by value를 아십니까?

<br />

## Python

### 📌 리스트 슬라이싱

### 📌 f-string

### 📌 dictionary

### 📌 set

<br />

## SQL

기본적인 문법만 나오고 지엽적인건 없으니 차라리 관계대수 기호랑 DB 이론을 더 보는 것이 낫다.

### 📌 `SELECT` - `FROM` - `WHERE`

### 📌 `GROUP BY` - `HAVING`

### 📌 `ORDER BY`

### 📌 서브 쿼리