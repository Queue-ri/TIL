---
title: 'Java의 기본 자료형'
eng_title: 'Primitive Data Types of Java'
image: https://til.qriositylog.com/img/m_banner_background.jpg
created_date: 2021-11-08
---

# Java의 기본 자료형

자바의 자료형은 크게 기본 자료형, 참조 자료형의 두 가지로 분류됩니다. 이번에는 그중 기본 자료형에 대해 알아보기로 합니다.

여느 때와 다름없이 익숙한 타입들이 자바에서도 기본에 해당합니다.

- 정수: `byte` `char` `short` `int` `long`
- 실수: `float` `double`
- 논리: `boolean`

## Character
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

## Long
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