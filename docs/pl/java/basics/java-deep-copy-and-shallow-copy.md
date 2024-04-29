---
title: '깊은 복사와 얕은 복사'
eng_title: 'Deep Copy and Shallow Copy'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '깊은 복사와 얕은 복사'
sidebar_position: 7
created_date: 2024-04-29
---

# 깊은 복사와 얕은 복사

## 얕은 복사

### 얕은 복사가 일어나는 이유
...

```java
public class Main {
    public static void main(String[] args) {
        int[] term1 = {100, 200, 300};
        int[] term2 = term1;
        System.out.println(term1 + " " + term2); // shallow copy
        term2[0] = 96;
        System.out.println(Arrays.toString(term1));
        System.out.println(Arrays.toString(term2));
    }
}
```
```text title=결과
[I@3af49f1c [I@3af49f1c
[96, 200, 300]
[96, 200, 300]
```

<br />

## 깊은 복사

### 1️⃣ clone()

```java
public class Main {
    public static void main(String[] args) {
        int[] term3 = {100, 200, 300};
        int[] term4 = term3.clone();
        System.out.println(term3 + " " + term4); // deep copy
        term4[0] = 96;
        System.out.println(Arrays.toString(term3));
        System.out.println(Arrays.toString(term4));
    }
}
```
```text title=결과
[I@19469ea2 [I@13221655
[100, 200, 300]
[96, 200, 300]
```

<br />