---
title: 'Java 문자열 1: String'
eng_title: 'Java String 1: String'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '문자열 1: String'
sidebar_position: 4
created_date: 2024-04-27
---

# Java 문자열 1: String

## 문자열 길이 구하기

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("12345".length());
    }
}
```
```text title=결과
5
```

<br />

## 문자열 비교하기

```java
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("가장 좋아하는 PS 유형: ");
        String str = sc.nextLine();

        if (str.equals("dp"))
            System.out.println("나두");
        else
            System.out.println("퉤");

        sc.close();
    }
}
```
```text title=결과
가장 좋아하는 PS 유형: dp
나두
```

<br />

## 공백 제거하기

:::note

실무에선 기본적으로 입력에 `trim()`을 수행하는 것이 권장됩니다.

:::

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("               ㅇ                 ".trim());
    }
}
```
```text title=결과
ㅇ
```

<br />

## 특정 구분자로 문자열 분리하기

```java
public class Main {
    public static void main(String[] args) {
        String[] a = "OOO0OO0O0OOO0O".split("0");
        System.out.println(Arrays.toString(a));
    }
}
```
```text title=결과
[OOO, OO, O, OOO, O]
```

<br />