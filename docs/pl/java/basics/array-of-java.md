---
title: 'Java의 배열'
eng_title: 'Array of Java'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '배열'
created_date: 2021-11-11
updated_date: 2024-04-18
---

# Java의 배열

## 참조 변수 선언

배열 참조 변수만 선언할 경우, 다음과 같이 두 가지 방법으로 선언이 가능합니다. C/C++과 다르게 대괄호가 자료형 바로 다음에 위치할 수도 있고, 변수명 다음에 놓일 수도 있습니다.

```java
int[] arr;
int arr[];
```
<br />

## 크기 지정

배열의 크기는 `new int[SIZE]`로 지정할 수 있습니다. 크기가 지정되면 배열이 비로소 생성되고, 배열 값들은 선언된 데이터 타입의 기본값으로 자동 초기화됩니다. int형 배열의 경우 기본값인 0으로 초기화가 이루어집니다.

```java
int[] arr;
arr = new int[99]; // 0 값으로 초기화 됨
```

타입 별 기본 초기화 값은 다음과 같습니다.

| Data Type | Init Value |
| :-------: | :--------: |
| `byte` | `0` |
| `int` | `0` |
| `long` | `0L` |
| `float` | `0.0F` |
| `double` | `0.0` |
| `char` | `'\u0000'` |
| `boolean` | `false` |
| `reference` | `null` |
<br />

## 선언과 동시에 초기화

꼭 선언과 초기화 각자 따로 하지 않고, 한 구문에 처리할 수도 있습니다.

```java
int[] arr = {1, 5, 7, 7};
int[] brr = new int[] {2, 1, 2, 7};
String[] srr = {"대학생학대는", "거꾸로읽어도", "대학생학대"};
```
<br />

## 2차원 배열
2차원 배열도 이전 문법의 큰 틀을 벗어나지 않습니다. 대괄호가 왼쪽 방향에 놓일수록 높은 차원을 의미합니다.

```java
int[][] crr = new int[2][3];
int[][] drr = { {9, 5, 0}, {5, 2, 4} };
```

2차원 배열부턴 낮은 차원의 크기를 생략할 수 있습니다.

```java
// int arr1[] = new int[]; // err: 크기 생략 불가
int arr2[][] = new int[3][]; // ok: 1차원 크기 생략 가능
int arr3[][][] = new int[99][][]; // ok: 1,2차원 크기 생략 가능
```

또한 자바에선 1차원 배열 요소에 배열을 저장하는 방식으로 고차원 배열을 구성하기 때문에, 각 행마다 길이가 다른 배열을 저장할 수도 있습니다.

:::note

각 행마다 크기가 다른 배열을 `Ragged Array`라고 합니다.

:::

```java
int ragged[][] = {
    {1, 2, 3, 4},
    {5, 6, 7},
    {8, 9}
};

for (int[] x : ragged) {
    for (int y : x)
        System.out.print(y + " ");
    System.out.println("");
}
```
```text title=결과
1 2 3 4
5 6 7
8 9
```

<br />

## 배열 길이 확인

배열의 길이는 `length`로 확인할 수 있습니다.

```java
public class Main {
	public static void main(String[] args) {
        int[] arr = {1,2,3,4,5,6,7};
        System.out.print(arr.length);
    }
}
```
```text title=결과
7
```
<br />

## 배열 출력

배열 출력은 C/C++에서 했던 것처럼 `for` 노가다를 사용해도 되지만, 자바의 `Arrays` 클래스에서 기본적으로 제공하는 `toString` 함수를 사용할 수도 있습니다. 어느쪽이든 편한대로 사용하면 됩니다.

:::note

toString 메소드를 사용하려면 `java.util.Arrays` 또는 `java.util.*`을 import 해야 합니다.

:::

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
        int[] arr = {1,2,3,4,5,6,7};
        System.out.print(Arrays.toString(arr));
    }
}
```
```text title=결과
[1, 2, 3, 4, 5, 6, 7]
```
<br />

### 출력 포맷 변경
:::tip

***toString으로 출력한 포맷이 마음에 안들어요!***

`replace` 노가다로 출력 포맷을 수정할 수 있습니다.

:::

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
        int[] arr = {1,2,3,4,5,6,7};
        System.out.print(Arrays.toString(arr).replace(",", " *").replace("[", "").replace("]", ""));
    }
}
```
```text title=결과
1 * 2 * 3 * 4 * 5 * 6 * 7
```
<br />

## 배열 복사

배열 복사 역시 for 노가다로 해결할 수 있지만, 관련하여 `System` 클래스의 `arraycopy`가 제공되고 있습니다.

다만 source 파라미터가 destination보다 앞에 위치하여 정의된 형태로, C/C++의 convention과는 조금 다릅니다.

```java
public class Main {
	public static void main(String[] args) {
        char[] des = {'최','고','의',' ','언','어',' ','R','u','s','t','?'};
	    char[] src = {'최','고','의',' ','레','거','시',' ','J','a','v','a','!'};
	    System.arraycopy(src, 8, des, 7, 5);
        System.out.print(des);
    }
}
```
```text title=결과
최고의 언어 Java!
```