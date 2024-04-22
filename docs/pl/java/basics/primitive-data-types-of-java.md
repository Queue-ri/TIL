---
title: 'Java의 기본 자료형'
eng_title: 'Primitive Data Types of Java'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '기본 자료형'
sidebar_position: 1
created_date: 2021-11-08
updated_date: 2024-04-17
---

# Java의 기본 자료형

자바의 자료형은 크게 기본 자료형, 참조 자료형의 두 가지로 분류됩니다. 이번에는 그중 기본 자료형에 대해 알아보기로 합니다.

여느 때와 다름없이 익숙한 타입들이 자바에서도 기본에 해당합니다.

- 정수: `byte` `short` `int` `long`
- 실수: `float` `double`
- 문자: `char`
- 논리: `boolean`

<br />

## Byte

```
- 크기: 1B = 8b
- 범위: -128 ~ 127 (2^8 = 256)
```

```java
public class Main {
	public static void main(String[] args) {
        System.out.println("Byte:" + Byte.BYTES);
    }
}
```
```text title=결과
Byte:1

```

<br />

## Character

```
- 크기: 2B = 16b
- 범위: -32,768 ~ 32,767 (2^16 = 65,536)
```

자바의 문자형은 놀랍게도 크기가 2바이트입니다. 파이썬, 고랭같은 언어를 사용해오셨다면 별로 임팩트 있지 않겠지만, C/C++로 몸이 절여지신 분이라면 머리에 1바이트로 각인되어 있기 때문에 이부분이 색다르게 느껴지실 겁니다.

그럼, 왜 하필 자바의 문자형은 2바이트인 것일까요?

그건 바로 자바가 내부적으로 UTF-16 인코딩을 사용하기 때문입니다.

```java
public class Main {
	public static void main(String[] args) {
        System.out.println("Character:" + Character.BYTES);
    }
}
```
```text title=결과
Character:2

```
<br />

## Long

```
- 크기: 8B = 64b
- 범위: -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807 (2^64 = 18,446,744,073,709,551,616)
```

자바에는 long long이라는 자료형이 없습니다.. 대신 long이 8바이트 정수형을 담당하고 있습니다.

```java
public class Main {
	public static void main(String[] args) {
        System.out.println("Long:" + Long.BYTES);
    }
}
```
```text title=결과
Long:8

```