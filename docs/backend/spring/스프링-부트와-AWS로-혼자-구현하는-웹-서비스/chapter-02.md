---
title: '02장'
eng_title: 'chapter 02'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 2
sidebar_label: '02장'
created_date: 2022-02-06
---

# 02장 정리

## 1. 테스트 코드의 중요성

견고한 서비스를 위해선 TDD와 테스트 코드가 필수적이고, 채용 과제에 단위 테스트를 요구하는 회사도 있다고 합니다.

## 2. TDD와 단위 테스트

### TDD
- **테스트가 주도하는 개발**
- 테스트 코드를 먼저 작성하는 것부터 시작

#### TDD의 사이클
- 항상 실패하는 테스트 먼저 작성 (Red)
- 테스트가 통과하는 프로덕션 코드 작성 (Green)
- 테스트가 통과하면 프로덕션 코드 리팩토링 (Refactor)

### 단위 테스트
- TDD의 첫번째 단계인 **기능 단위의 테스트 코드를 작성**하는 것

#### 왜 단위 테스트가 필요한가?
- **톰캣을 올렸다 내리고 print로 찍어보는 노가다를 안해도 됨**
- 개발 단계 초기에 문제 발견
- 리팩토링, 업그레이드 시에 작동 문제 없는지 확인
- 기능의 불확실성 감소
- 단위 테스트를 문서로도 사용 가능

## 3. 직접 테스트 해보자

### 메인 클래스 생성

`src` > `main` > `java` 에 새 패키지를 추가한 뒤, 하위에 자바 클래스를 생성한 후 하단의 코드를 작성합니다.

```java title=Application.java
package com.hellspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HellSpringApplication {
	public static void main(String[] args) {
		SpringApplication.run(HellSpringApplication.class, args);
	}
}
```

Application 클래스는 프로젝트의 메인 클래스입니다.

@SpringBootApplication 은 스프링 자동 설정 데코레이터이며, 이 데코레이터가 위치한 지점부터 적용되기 때문에 프로젝트 최상단에 위치해야 합니다. 

SpringApplication.run 은 내장 WAS(Web Application Server)를 실행합니다. 이 경우 톰캣은 설치할 필요가 없습니다.

### 테스트 Controller 생성

이전에 생성한 패키지의 하위에 새 패키지 `web`을 생성합니다. 그 다음 `web`에 `HelloController` 자바 클래스를 생성하여 하단의 코드를 작성합니다.

```java title=HelloController.java
package com.hellspring.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }
}
```

#### RestController
- json을 반환하는 컨트롤러로 만들어줌

#### GetMapping
- HTTP Get 요청을 받을 수 있는 API를 만들어줌

:::note 아하! 그렇다면...
네 맞습니다. `/hello`로 Get이 요청되면 `hello`문자열을 json 형태로 반환하는 것입니다.
:::

### 테스트 코드 생성
WAS를 실행하지 않고, 테스트 코드로 검증해봅니다.

`src` > `test` > `java` 에 이전의 패키지를 그대로 생성한 후, 해당 패키지에 테스트 클래스를 생성합니다. <br />
테스트 클래스명은 일반적으로 *대상 클래스명 + Test* 로 짓습니다.

클래스가 생성되었다면 하단의 코드를 작성해줍니다.

```java {18} title=HelloControllerTest.java
package com.hellspring;

import com.hellspring.web.HelloController;
import org.junit.jupiter.api.Test;
// import org.junit.runner.RunWith;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = HelloController.class)
public class HelloControllerTest {
	@Autowired
	private MockMvc mvc;

	@Test
	public void return_hello() throws Exception {
		String hello = "hello";

		mvc.perform(get("/hello"))
				.andExpect(status().isOk())
				.andExpect(content().string(hello));
	}
}
```

책에서는 JUnit4 기준으로 `RunWith`, `SpringRunner`를 사용하고 있지만, 이는 JUnit5에서 각각 `ExtendWith`, `SpringExtension`으로 변경되었으므로 작성 시 유의합니다.

그 다음 코드에 하이라이팅 되어있는 라인의 ▶ 버튼을 눌러 Test 클래스를 Run 합니다. 이후 ✔️*Tests Passed* 표시가 뜨면 테스트를 통과한 것입니다.