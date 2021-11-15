---
title: 'Java의 배열'
eng_title: 'Array of Java'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '배열'
created_date: 2021-11-11
updated_date: 2021-11-15
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