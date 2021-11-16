---
title: 'Java의 기본 출력'
eng_title: 'Basic Print of Java'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '기본 출력'
created_date: 2021-11-07
updated_date: 2021-11-16
---

# Java의 기본 출력

## System.out.println
println은 거의 처음 배우게 되는 자바의 기본 출력 함수입니다.<br />
파라미터에 데이터를 넘겨주면, 이를 그대로 출력한 뒤 **한 번 개행**합니다.<br />
왜 개행하냐고요? 애초에 이 함수는 한 줄 단위 출력 용도로 만들어졌기 때문입니다. println의 ln이 line을 의미하거든요.

println이 개행할 때 찍는 문자는 시스템 속성인 `line.separator`에 의거하며, 단순히 `\n`은 아닙니다.

> *The line separator string is defined by the system property line.separator, and is not necessarily a single newline character ('\n').*
> [[1]](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/PrintStream.html#println())

<br />

대표적으로 윈도우(`\r\n`)와 리눅스(`\n`) 간의 개행 문자 호환성 문제가 있는데, 자바는 JVM이 알아서 다 고생해주니 너무 편하죠.

```java
public class Main {
	public static void main(String[] args) {
        System.out.println("Hell, Java!");
    }
}
```
```text title=결과
Hell, Java!

```
<br />

꼭 문자열 뿐만 아니라 여러가지 타입에 오버로딩 되어있어 이것저것 넘겨보면 다 뽑아줍니다.

```java
public class Main {
	public static void main(String[] args) {
		char[] ch = new char[]{'자','바',' ','두',' ','명',' ','타','요'};
		System.out.println(ch);
	}
}
```
```text title=결과
자바 두 명 타요

```
<br />

## System.out.print
반대로, **강제 개행을 원치 않고** 오로지 내가 원하는 데이터만 출력하게끔 하고 싶다면 print 함수를 사용하면 됩니다. 물론 끝에 개행 문자를 넣으면 println의 결과와 같습니다.

```java
public class Main {
	public static void main(String[] args) {
        System.out.print("Try Jython.");
    }
}
```
```text title="결과"
Try Jython.
```
<br />

### WA! 포터블 개행!
:::info

***개행 문자는 뭘 쓰죠?***

자바가 제공하는 OS-free한 `%n`을 사용하세요. (`\n` 오타 아님)

:::
<br />

## System.out.printf
살다보면 소수를 특정 자리수까지만 잘라서 출력한다거나, 정렬 등 특정 포맷이 정해진 출력이 필요할 때가 있습니다. 그런데 println과 print로 이러한 포맷 출력을 하기엔 부적절합니다. 그럼 어떻게 해야 할까요?

이 경우엔 printf 함수를 사용합니다. printf의 f는 formatted를 의미합니다.

```java
public class Main {
	public static void main(String[] args) {
		float f = 0.12345f;
		System.out.printf("%%f:%f %%.3f:%.3f", f, f);
	}
}
```
```text title="결과"
%f:0.123450 %.3f:0.123
```