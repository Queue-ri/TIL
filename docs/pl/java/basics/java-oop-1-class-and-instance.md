---
title: 'Java 객체지향 1: 클래스와 인스턴스'
eng_title: 'Java OOP 1: Class and Instance'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '객체지향 1: 클래스와 인스턴스'
created_date: 2021-11-16
updated_date: 2021-11-26
---

# Java 객체지향 1: 클래스와 인스턴스

우리는 객체지향 이론에서 클래스, 객체, 인스턴스라는 용어를 항상 접해옵니다. 간단히 설명하자면:

- **클래스:** 객체를 정의하는 모형틀
- **인스턴스:** 클래스로 생성한 객체
- **객체:** 실존하는 것 (= 메모리에 올려진 것)

인데, 이렇게 놓고 보면 객체랑 인스턴스랑 뭔 차이인가 싶죠. 둘의 차이는 a/the 차이입니다. 인스턴스는 어떠한 클래스에서 생성된 특정(the) 객체를 지칭하고, 객체는 모든 인스턴스들을 general하게(a) 지칭하는 용어입니다. 객체지향은 들어봤어도 인스턴스지향은 뭔가 어색하잖아요? 하지만 소통에 있어서 불편함만 없으면 되니 매번 무슨 단어 쓸 지 너무 깊게 고민할 필요는 없습니다.
<br />

## 인스턴스 생성

```java
class Developer {
    String name;
    String position;
    double coffee_gauge;
    int hair;

    public void print() {
        System.out.println("현재 " + position + " 개발자 " + name + "씨의 커피 게이지는 " + coffee_gauge + "%, 머리카락은 " + hair + "가닥 입니다.");
    }
}

public class Main {
    public static void main(String[] args) {
        Developer dev1 = new Developer();

        dev1.name = "니냐뇨";
        dev1.position = "Backend";
        dev1.coffee_gauge = 100.0;
        dev1.hair = 100_000;

        dev1.print();
    }
}
```
```text title=결과
현재 Backend 개발자 니냐뇨씨의 커피 게이지는 100.0%, 머리카락은 100000가닥 입니다.

```
<br />

## 생성자 오버로딩
```java
class Developer {
    String name;
    String position;
    double coffee_gauge;
    int hair;

    public Developer(String n, String p, double cg, int h) {
        name = n;
	    position = p;
	    coffee_gauge = cg;
	    hair = h;
    }

    public void print() {
        System.out.println("현재 " + position + " 개발자 " + name + "씨의 커피 게이지는 " + coffee_gauge + "%, 머리카락은 " + hair + "가닥 입니다.");
    }
}

public class Main {
    public static void main(String[] args) {
        Developer dev1 = new Developer("냐나니머스", "DevSecOps", 100.0, 115_000);
        dev1.print();
    }
}
```
```text title=결과
현재 DevSecOps 개발자 냐나니머스씨의 커피 게이지는 100.0%, 머리카락은 115000가닥 입니다.

```
<br />

## 우리 소멸자는 미국 가셨어!
![미국간_짤](https://user-images.githubusercontent.com/77003554/143244006-cde2d598-3ac4-41e4-aff8-1327a61d1051.png)

자바에는 소멸자 개념이 없습니다...

예전에는 `Object.finalize()`를 이용한 트릭이라도 있었지만, 이는 실행 보장이 되지 않을뿐더러

시스템을 어지럽힌다면서 Java 9부터는 아예 deprecated 되었습니다.

대신 자바는 JVM이 메모리를 관리하기 때문에, 다음과 같이 null을 대입하여 레퍼런스를 끊어주면 나중에 GC가 알아서 일괄적으로 처리합니다.

```java
public class Main {
    public static void main(String[] args) {
        Developer dev1 = new Developer(...);

	    // ...

        dev1 = null;
    }
}
```
<br />

## 클래스, 인스턴스, 지역 변수

### 클래스 변수

모든 인스턴스가 공유하는 변수입니다. `static` 키워드를 붙여 선언하며, 인스턴스를 생성하지 않아도 `클래스명.클래스변수` 형태로 접근하여 사용할 수 있습니다. 클래스 사용 시 JVM의 메서드 영역에 생성됩니다.

### 인스턴스 변수

각각의 인스턴스가 독립적으로 가지는 변수입니다. 인스턴스 생성 시 JVM의 힙에 생성됩니다.

### 지역 변수

생성자, 멤버 함수 등에서 선언되는 변수입니다. 함수 호출 시 JVM의 콜 스택에 생성됩니다.

:::info

예시 코드는 하단의 [변수와 메서드 예제](#%EB%B3%80%EC%88%98%EC%99%80-%EB%A9%94%EC%84%9C%EB%93%9C-%EC%98%88%EC%A0%9C)를 확인하세요.

:::

<br />

## 클래스, 인스턴스 메서드

### 클래스 메서드

`static` 키워드를 붙여 선언합니다.

인스턴스 생성 없이도 사용 가능하기에, 클래스 메서드에서 인스턴스 변수를 사용하면 안되겠죠 ^~^

그 대신, 클래스 메서드는 인스턴스 메서드보다 호출 시간이 짧아 성능 면에서 유리합니다.


### 인스턴스 메서드

인스턴스 생성 시점부터 사용 가능한 함수입니다. 인스턴스 메서드에선 클래스 변수를 사용할 수 있습니다.

<br />

## 변수와 메서드 예제
```java
class Unit {
    // 클래스 변수
    static int attackLv = 0;
    // 인스턴스 변수
    private int damage;
    private int hp;

    public Unit(int dmg, int hp) {
        // 지역 변수를 인스턴스 변수에 할당
        damage = dmg;
        this.hp = hp;
    }
    // 클래스 메서드
    public static int getAttackLv() {
        return attackLv;
    }
}

public class Main {
    public static void main(String[] args) {
        Unit[] unit = new Unit[2];
	    unit[0] = new Unit(80, 300);
        unit[1] = new Unit(50, 200);
        System.out.println("unit[0]:" + unit[0].getAttackLv() + " unit[1]:" + unit[1].getAttackLv());

        Unit.attackLv += 1; // 모든 Unit의 공격력 업그레이드
        System.out.println("unit[0]:" + unit[0].getAttackLv() + " unit[1]:" + unit[1].getAttackLv());
    }
}
```
```text title=결과
unit[0]:0 unit[1]:0
unit[0]:1 unit[1]:1

```
