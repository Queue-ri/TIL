---
title: '자바의 한계와 개선 필요 사항'
eng_title: 'Limitations and Potential Improvements in Java'
image: https://velog.velcdn.com/images/qriosity/post/d78485d9-245a-4caf-8e80-5d0a0984399b/image.png
sidebar_label: '자바의 한계와 개선 필요 사항'
sidebar_position: 99
created_date: 2025-05-23
updated_date: 2025-05-25
---

# 자바의 한계와 개선 필요 사항

:::note 이 글은 자바 30주년 기념으로 작성되었습니다.

<img src="https://velog.velcdn.com/images/qriosity/post/abb67f33-dab0-4c7e-93bd-08268302fa58/image.png" width="480px" height="auto" />

<br />

🎉 Happy 30th Anniversary!

[30주년 기념 고슬링 ~~신화~~ 인터뷰 보러가기](https://thenewstack.io/java-at-30-the-genius-behind-the-code-that-changed-tech/) | [[한국어 번역](https://news.hada.io/topic?id=20964)]

:::

:::tip 현명한 자바 사용법

자바의 안정성과 생산성 아래 모두는 평등합니다. ~~*가독성조차*~~<br />
자바를 선택했다면 효율성 따질 시간에 스케일업이나 하세요.

:::

:::info 믿거나 말거나

자바는 원래 ~~효율성이 중요한~~ IoT용으로 만들어졌다가 진출에 실패했습니다.<br />
하지만 웹 코인으로 갈아타서 올해 30살이 될 수 있었습니다.<br />
*유명한 역사지만 그래도 출처는 [요기](https://whatap.io/bbs/board.php?bo_table=blog&wr_id=60&page=15)*

:::

:::caution 무지성 자바 까기 글 아님 주의

자바는 우리가 최소 밥은 먹고 살도록 해주는 훌륭한 언어입니다.<br />
그리고 간헐적으로 혈압을 올려줌으로써 저혈압 환자에게 좋습니다.<br />
작성자의 혈압이 오를때마다 글 내용이 추가될 수 있습니다.

:::

<br />

### unsigned 타입의 부재

> "자바 개발자는 내부 원리같은거 알 필요 없음"

출처: [왜 자바는 unsigned 타입이 없을까](http://til.qriosity.dev/featured/pl/java/advanced/why-no-unsigned)

<br />

### 연산자 오버로딩 불가

> "자바는 왜 C++처럼 연산자 오버로딩 지원 안함?"
>
> "그건 자바 철학임. C++ 개발자들이 남발하길래 빼버림."
> 
> "String은 + 연산자 지원하잖아?"
> 
> "그건 오버로딩 아님"
> 
> "엥 그럼 뭔데"
>
> "StringBuilder 치환 문법임"
>
> "Integer끼리 연산자 써지는건?"
> 
> "그건 autoboxing 때문인데요"

<br />

#### 자바의 철학 (a.k.a 고슬링 취향)

```java
BigInteger a = new BigInteger("2364564564564645645");
BigInteger b = BigInteger.valueOf(2);
BigInteger c = BigInteger.valueOf(3);
BigInteger d = b.multiply(a.add(c));
```

출처 1: [The C Family of Languages: Interview with Dennis Ritchie, Bjarne Stroustrup, and James Gosling](http://www.gotw.ca/publications/c_family_interview.htm)<br />
출처 2: [milleniumbug/java_rant.txt](https://gist.github.com/milleniumbug/3bd74fcdce6355d1355f05cec1a909b2)

<br />

### 원시 자료형 내림차순 정렬 시의 어려움

> 오름차순은 되는데 내림차순은 API 복잡해져서 만들어주기 싫었어요
>
> 어차피 boxing하면 `Collections`에서 지원해줌
>
> boxing 오버헤드? 싫으면 스케일업하세요
>
> 오름차순 정렬하고 O(n)으로 reverse하면 결과 똑같긴 함
>
> O(n) 비용? 싫으면 스케일업하세요

출처: [Java SE 8 for the Really Impatient by Cay S. Horstmann](https://stackoverflow.com/a/23106578)

<br />

### 수학적 정의를 따르지 않는 음수 모듈로 연산

| 연산       | Java     | Python     |
| --------- | :------: | :--------: |
| `-7 % 3`  | `-1`     | `2`        |
| `7 % -3`  | `1`      | `-2`       |
| `-7 % -3` | `-1`     | `-1`       |

> "Python: 모듈로의 수학적 정의대로 구현했어요"
> 
> "Java: C/C++ 방식 그대로 따라했어요"

<br />

### length 접근 설계의 비일관성

> "왜 String은 length() 메소드로 접근함?"
> 
> "변수로 접근하면 내부 구현이랑 호환 깨질수 있어서"
>
> "그럼 왜 배열은 length라는 멤버변수로 접근함?"
> 
> "메소드로 접근하면 오버헤드 있어서"
>
> "아니 왜 이건 오버헤드 신경씀?"
>
> "자주 쓰이는건 C++급 성능을 내고 싶어서.

<img src="https://velog.velcdn.com/images/qriosity/post/b045aed8-9045-465c-bc58-b7b107718e8e/image.png" width="700px" />

*~하지만 사실 배열 length는 멤버변수가 아닌 JVM 특수 토큰이었다~*

> "뭐야 성능때문에 멤버변수로 접근한다매; 멤버변수 아니잖아 왜 구라쳐"
> 
> "개발자는 몰라도 돼 아무튼 멤버변수임"

출처: [How does Arrays work in the ByteCode of Java](https://stackoverflow.com/questions/20646022/how-does-arrays-work-in-the-bytecode-of-java)

<br />

### inline 함수 키워드의 부재

> "왜 자바는 인라인 키워드 지원 안함?"
> 
> "인라인으로 돌릴지는 JIT이 결정하니까 개발자는 신경쓰지 마"

<br />

### 2차원 배열의 메모리 접근 비효율성

> "자바 2차원 배열 왤캐 느림?"
>
> "힙 메모리라서 ㅇㅇ new로 생성했자너"
>
> "아 싫어요 스택에 생성해줘"
>
> "스택 생성은 지원 안함"
> 
> "C++ 따라한다며?"
> 
> "그건 자바 철학이라 타협 안함" 
>
> "........"
>
> "글고 그거 JIT 최적화하기 어려우니까 참고해"

<br />

### MZ한 unboxing 정책

```java
true ? 123 : (Integer)null
```

> "이거 왜 NPE 터져요?"
> 
> "RTFM."
> 
> "Type Promotion 처럼 작동하는거 아니었음??"
> 
> "맞음 그래서 primitive 우선이라 reference를 언박싱함"
> 
> "아니 C#, 코틀린 다 문제 없구만 왜 자바만 lossy conversion 하는건데"
> 
> "아무튼 정책은 그럼"

출처: [Java Language Specification, Java SE 7 Edition, §5.6.2 Binary Numeric Promotion](https://docs.oracle.com/javase/specs/jls/se7/html/jls-5.html#jls-5.6.2)

<br />

### 벗어날 수 없는 명사 지옥

#### C++ *(자바보다 10년 더 오래된 언어)*
```cpp
int add(int x, int y) {
    return x + y;
}

int main() {
    function<int(int, int)> f = add;
    cout << f(1, 2) << endl;
}
```

#### Python *(자바보다 4년 더 오래된 언어)*
```python
def add(x, y):
    return x + y

f = add
print(f(1, 2))
```

#### Java
```java
public class Main {
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> f = (x, y) -> x + y;
        System.out.println(f.apply(1, 2));
    }
}
```

> "apply() 이거 꼭 호출해야돼?"
> 
> "진짜 1급 시민으로 쓰려면 JVM도 수정해야돼서 안됨"

#### Kotlin
```kotlin
val f: (Int, Int) -> Int = { x, y -> x + y }

fun main() {
    println(f(3, 5))
}
```
> "그럼 코틀린은 같은 JVM 쓰는데 왜 잘만 돼??"
>
> "걔는 컴파일러가 ()를 invoke()로 치환해줌"
> 
> "자바도 치환해주면 되잖아"
> 
> "싫어"