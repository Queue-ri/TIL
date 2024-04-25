---
title: '왜 자바는 unsigned 타입이 없을까'
eng_title: "Why there's no unsigned type in Java"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: 'unsigned 없찐?'
sidebar_position: 2
created_date: 2024-04-25
---

# 왜 자바는 unsigned 타입이 없을까

## C++의 unsigned int

모두 알다시피 C++은 부호 없는 자료형인 `unsigned` 타입을 지원한다.

적절한 유형의 데이터에 `unsigned` 자료형을 사용할 경우, 딱 맞는 크기의 메모리만 사용함으로써 자원을 절약할 수 있다.

예를 들어, C++에선 바이너리 값 또는 RGB 값을 `unsigned char` 타입에 할당하곤 한다.

`unsigned char`의 값 범위가 0~255로, 정확히 해당 유형의 데이터 값 범위와 일치하기 때문이다.

<br />

## Java는 unsigned 타입이 없다

### 사실 하나 있다

자바의 `char` 자료형은 C++의 `unsigned short`와도 같다.

근데 2바이트잖아........... `unsigned byte`가 없는 것이 너무나도 아쉽다.

<br />

### 왜 없음?

[모 인터뷰](http://www.gotw.ca/publications/c_family_interview.htm)에 따르면, 고슬링이 `unsigned` 따윈 필요없다고 한다.

> For me as a language designer, which I don't really count myself as these days, what "simple" really ended up meaning was could I expect J. Random Developer to hold the spec in his head. That definition says that, for instance, Java isn't -- and in fact a lot of these languages end up with a lot of corner cases, things that nobody really understands. Quiz any C developer about unsigned, and pretty soon you discover that almost no C developers actually understand what goes on with unsigned, what unsigned arithmetic is. Things like that made C complex. The language part of Java is, I think, pretty simple. The libraries you have to look up.

요약하자면, 대부분의 개발자들은 내부 원리를 잘 모르기에 괜시리 복잡하게만 만드는 `unsigned` 타입을 지원에서 배제했다고 한다.

그리고 이러한 고슬링의 의견에 반대하는 개발자들이 꽤나 있다.

![극대노.png](https://github.com/user-attachments/assets/944d0bb8-19cf-441f-a146-1e7489315e90)

<br />

### unsigned 부재의 대안

JDK 1.8 (Java SE 8) 부터 `Integer` wrapper class에서 unsigned 연산을 지원한다. <br />
따라서 이를 이용하여 대충 땜빵할 수 있다.

```java
public class Main {
	public static void main(String[] args) {
        int uIntMax = Integer.parseUnsignedInt("4294967295");
        System.out.println(uIntMax); // -1
        String uIntMaxStr = Integer.toUnsignedString(uIntMax);
        System.out.println(uIntMaxStr); // 4294967295
    }
}
```

signed integer overflow를 거리낌 없이 쓰는 점에서 이게 맞나 싶지만, <br />
자바는 이에 대해 specified 되어 있고, platform-dependent 하지 않으니 UB의 공포에서 벗어난 셈이다.

<br />

## 개인적 견해

그냥 예약어 하나 만들어주는게 그렇게나 싫었니