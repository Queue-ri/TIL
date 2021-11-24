---
title: 'Java 객체지향 1: 클래스와 인스턴스'
eng_title: 'Java OOP 1: Class and Instance'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '객체지향 1: 클래스와 인스턴스'
created_date: 2021-11-16
updated_date: 2021-11-24
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

## 세 가지 변수 종류

### 클래스 변수
### 인스턴스 변수
### 지역 변수

```java
class Unit {
    // 클래스 변수
    private static int attackLv = 0;
    
    // 인스턴스 변수
    int damage;
    int hp;

    public Unit(int dmg, int hp) {
        // 지역 변수를 인스턴스 변수에 할당
        damage = dmg;
        this.hp = hp;
    }

    public int getAttackLv() {
        return attackLv;
    }

    public static void upgradeAttack() {
        attackLv += 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Unit unit1 = new Unit(80, 300);
        Unit unit2 = new Unit(50, 200);
        System.out.println("unit1:" + unit1.getAttackLv() + " unit2:" + unit2.getAttackLv());

        Unit.upgradeAttack(); // 모든 Unit의 공격력 업그레이드
        System.out.println("unit1:" + unit1.getAttackLv() + " unit2:" + unit2.getAttackLv());
    }
}
```
```text title=결과
unit1:0 unit2:0
unit1:1 unit2:1

```

<br />