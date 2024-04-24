---
title: '기본형 vs 래퍼 클래스'
eng_title: 'Primitive Type vs Wrapper Class'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '기본형 vs 래퍼 클래스'
sidebar_position: 1
created_date: 2024-04-24
---

# 기본형 vs 래퍼 클래스

## Primitive Type

자바의 기본형은 값을 저장하는 8개의 기본 자료형을 의미합니다.

> *참고: [Java의 기본 자료형](http://til.qriosity.dev/featured/pl/java/basics/primitive-data-types-of-java)*

<br/>

## Wrapper class

래퍼 클래스란 기본형을 객체화한 클래스입니다.

각각 해당 타입에 대응되는 기본형을 필드로 가지고 있습니다.

<br/>

## Boxing과 Unboxing

- **Boxing**: 기본형 -> 래퍼 클래스로 변환하는 것
- **Unboxing**: 래퍼 클래스 -> 기본형으로 변환하는 것

<br/>

### WA! 자동 형변환!

JDK 1.5부터는 autoBoxing, autoUnboxing이 적용되어 기본형 ↔ 래퍼 클래스 간 묵시적 형변환이 가능합니다.

```java
public class Main {
	public static void main(String[] args) {
        int primitive = 42;
        Integer wrapper = primitive + 1;
        primitive = wrapper;
        System.out.println(primitive);
        System.out.println(wrapper);
    }
}
```
```text title=결과
43
43
```

<br/>
