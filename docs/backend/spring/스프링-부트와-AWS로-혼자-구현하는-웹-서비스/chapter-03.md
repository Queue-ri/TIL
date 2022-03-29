---
title: '03장'
eng_title: 'chapter 03'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 3
sidebar_label: '03장'
created_date: 2022-03-25
updated_date: 2022-03-29
---

# 03장 정리

## 1. JPA와 데이터베이스
- 서비스 기업: Spring Boot & JPA 가 전사 표준
- SI 기업: Spring & MyBatis

RDB와 OOP는 패러다임이 불일치하므로, 이 경우 중간에서 패러다임을 일치시켜주는 JPA가 유용합니다.

개발자가 객체지향적 프로그래밍을 하면, JPA는 이를 SQL로 바꾸어 실행해줍니다.

결론적으로 생산성이 향상되고, 유지보수하기 용이해집니다.

### Spring Data JPA
JPA는 사실 인터페이스이기 때문에 구현체가 필요합니다. 대표적인 구현체로는 Hibernate가 있는데, 이 구현체를 쉽게 갈아끼우도록 스프링 진영에선 Spring Data 프로젝트의 일환으로 Spring Data JPA라는 모듈을 만들었습니다. 뿐만 아니라 Spring Data 프로젝트는 차후 트래픽 규모가 증가하여 MongoDB와 같은 NoSQL로의 전환이 필요할 시 Spring Data JPA를 Spring Data MongoDB로 변경하는 저장소 교체 용도에도 유용합니다.

#### HOW???
Spring Data의 하위 프로젝트는 모두 기본 CRUD 인터페이스가 같기 때문입니다. 호환이 잘 되니 갈아끼우기도 쉽습니다.

## 2. Spring Data JPA 적용하기
### 디펜던시 추가
build.gradle에 디펜던시를 추가로 등록합니다. 다쓰고 Gradle Sync 하는거 잊지 마세요.
```java
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'com.h2database:h2'
}
```

#### spring-boot-starter-data-jpa
- 스프링 부트 버전에 맞추어 자동으로 JPA 라이브러리 버전 관리

#### h2
- 인메모리 관계형 데이터베이스
- 별도 설치 필요 없이 디펜던시 만으로 관리 가능
- 메모리에서 실행? -> 앱 재시작하면 싹 초기화 -> 테스트 용도로 좋겠군!

### 패키지 및 클래스 추가
`main` > `java` > ... 의 하위에 domain 패키지를 생성하고,

domain 패키지 하위에 `posts` 패키지, 그 안에 `Posts` 클래스를 생성합니다.

#### 도메인이란?
게시글, 댓글, 회원, 정산, 결제 등 SW 요구사항 또는 문제 영역
- 더 자세히 알아보고 싶으면 *DDD Start* 라는 서적을 추천

### 엔티티 생성
Posts 클래스에 다음의 코드를 작성합니다.
```java
package com.hellspring.domain.posts;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
@Entity

public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    @Builder
    public Posts(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
```
**Posts 클래스는 실제 DB 테이블과 매칭**되는 클래스이며, Entity 클래스라고도 합니다.

#### @Entity
- 테이블과 매칭될 클래스임을 나타냄

#### @Id
- 해당 테이블의 PK 필드

#### @GeneratedValue
- PK 생성 규칙

#### @Column
- 테이블의 컬럼
- 선언 안해도 해당 클래스의 필드는 모두 자동으로 컬럼이 되나, 기본 외 옵션이 필요한 경우 작성

*롬복 어노테이션을 위에 따로 놓는 스타일은 후에 코틀린 등으로 전환해서 더이상 롬복이 필요없어질 때 삭제하기 편하다고 합니다.*

#### @NoArgsConstructor
- 기본 생성자 자동 추가

#### @Getter
- 클래스 내 모든 필드의 Getter 자동 생성

#### @Builder
- 해당 클래스의 빌더 패턴 클래스 생성
- 생성자 상단에 작성 시 생성자에 포함된 필드만 빌더에 포함됨

필드 값 변경 시엔 그 목적이 코드에 명확히 드러나야 하기 때문에 애매한 Setter는 생성하지 않습니다.

### 리포지토리 생성
Posts 클래스로 DB를 접근하게 해줄 JpaRepository를 생성합니다. Posts와 같은 경로에 다음의 내용으로 PostsRepository 인터페이스를 생성합니다.

```java
package com.hellspring.domain.posts;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {
    
}
```
JPA의 Repository 인터페이스는 MyBatis에서 Dao라는 DB Layer 접근자에 대응됩니다.

- `JpaRepository<Entity 클래스, PK 타입>`을 상속하면 자동으로 기본 CRUD가 생성됩니다.
- Entity 클래스와 Repository 인터페이스는 함께 위치해야 합니다.

## 3. Spring Data JPA 테스트 코드 작성하기
이전과 같은 방식으로 대응되는 경로에 테스트 클래스 `PostsRepositoryTest`를 생성합니다.

다음의 코드는 save, findAll 기능을 테스트하는 코드입니다.

```java
package com.hellspring.web.domain.posts;

import com.hellspring.domain.posts.Posts;
import com.hellspring.domain.posts.PostsRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class PostsRepositoryTest {
    @Autowired
    PostsRepository postsRepository;

    @AfterEach
    public void cleanup() {
        postsRepository.deleteAll();
    }

    @Test
    public void 게시글저장_불러오기() {
        String title = "샘플제목";
        String content = "테스트 본문";

        postsRepository.save(Posts.builder()
                .title(title)
                .content(content)
                .author("qriositylog@gmail.com")
                .build());

        List<Posts> postsList = postsRepository.findAll();

        Posts posts = postsList.get(0);
        assertThat(posts.getTitle()).isEqualTo(title);
        assertThat(posts.getContent()).isEqualTo(content);
    }
}
```
#### @After
- 단위 테스트 끝날 때마다 수행되는 메소드 지정
- 대부분 전체 테스트 때 테스트 간 침범 막기 위해 사용

#### postsRepository.save
- posts 테이블에 insert/update 쿼리 실행
- id 있으면 update, 없으면 insert 실행

#### postsRepository.findAll
- posts 테이블에 있는 모든 데이터 조회

### 실행 쿼리 보기
내부적으로 실행되는 쿼리를 로그 형태로 보기 위해선 설정 파일이 필요합니다.

스프링 부트에선 `application.properties`, `application.yml` 등의 파일로 설정하는 것을 권장하고 있습니다.

설정 파일을 `src` > `main` > `resources` 디렉토리에 생성하여 하단의 코드를 작성합니다. (이미 생성됐을 수도 있음)
```
spring.jpa.show_sql=true
```
그럼 이제 로그에서 열심히 일하는 hibernate를 직관할 수 있습니다.
```
Hibernate: insert into posts (id, author, content, title) values (null, ?, ?, ?)
Hibernate: select posts0_.id as id1_0_, posts0_.author as author2_0_, posts0_.content as content3_0_, posts0_.title as title4_0_ from posts posts0_
Hibernate: select posts0_.id as id1_0_, posts0_.author as author2_0_, posts0_.content as content3_0_, posts0_.title as title4_0_ from posts posts0_
Hibernate: delete from posts where id=?
Hibernate: drop table if exists posts CASCADE 
```
만약 쿼리 로그를 MySQL 버전으로 변경하고 싶다면 다음의 설정을 추가하면 됩니다.
```
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
```

## 4. 등록/수정/조회 API 만들기
### API 제작에 필요한 클래스
1. Request 데이터 받을 Dto
2. API 요청 받을 Controller
3. 트랜잭션과 도메인 기능 간 순서 보장하는 Service

- 도메인이 비즈니스 로직을 다루면 -> 도메인 모델
- 서비스가 비즈니스 로직을 처리하면 -> 트랜잭션 스크립트

### Spring 웹 계층
- Web Layer: 컨트롤러, JSP/Freemarker 등의 뷰 템플릿 영역
- Service Layer: Controller와 Dao의 중간이자, Transactional이 사용되어야 하는 영역
- Repository Layer: DB 접근 영역, Dao(Data Access Object)
- Dtos: 계층 간 데이터 교환을 위한 객체(Dto, Data Transfer Object)들의 영역
- Domain Model: 도메인을 모든 사람이 동일 관점에서 이해하고 공유할 수 있도록 단순화시킨 것

### 클래스 생성
`service` > `posts`에 PostsService, `web` 에 PostsApiController, `web.dto` 에 PostsSaveRequestDto를 생성하고, 각자 다음의 코드를 작성합니다.

```java title=PostsSaveRequestDto
package com.hellspring.web.dto;

import com.hellspring.domain.posts.Posts;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostsSaveRequestDto {
    private String title;
    private String content;
    private String author;
    @Builder
    public PostsSaveRequestDto(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public Posts toEntity() {
        return Posts.builder()
                .title(title)
                .content(content)
                .author(author)
                .build();
    }
}
```

```java title=PostsService
package com.hellspring.service.posts;

import com.hellspring.domain.posts.PostsRepository;
import com.hellspring.web.dto.PostsSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@RequiredArgsConstructor
@Service
public class PostsService {
    private final PostsRepository postsRepository;

    @Transactional
    public Long save(PostsSaveRequestDto requestDto) {
        return postsRepository.save(requestDto.toEntity()).getId();
    }
}
```

```java title=PostsApiController
package com.hellspring.web;

import com.hellspring.service.posts.PostsService;
import com.hellspring.web.dto.PostsSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class PostsApiController {
    private final PostsService postsService;

    @PostMapping("/api/v1/posts")
    public Long save(@RequestBody PostsSaveRequestDto requestDto) {
        return postsService.save(requestDto);
    }
}
```