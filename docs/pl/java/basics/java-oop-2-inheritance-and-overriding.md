---
title: 'Java 객체지향 2: 상속과 오버라이딩'
eng_title: 'Java OOP 2: Inheritance and Overriding'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_label: '객체지향 2: 상속과 오버라이딩'
sidebar_position: 5
created_date: 2021-11-26
---

# Java 객체지향 2: 상속과 오버라이딩
<br />

## 상속

```java
class Unit {
    private int damage;
    private int hp;

    public Unit(int dmg, int hp) {
        damage = dmg;
        this.hp = hp;
    }
}

class ProtossUnit extends Unit {
    static int shieldLv = 0;
    private int shield;

    public ProtossUnit(int dmg, int hp, int sh) {
        super(dmg, hp);
        shield = sh;
    }
}

class ProtossGroundUnit extends ProtossUnit {
    static int attackLv = 0;
    static int defenseLv = 0;

    public ProtossGroundUnit(int dmg, int hp, int sh) {
        super(dmg, hp, sh);
    }
}

public class Main {
    public static void main(String[] args) {
        ProtossGroundUnit probe = new ProtossGroundUnit(5, 20, 20);
    }
}
```