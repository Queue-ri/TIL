---
title: '01장'
eng_title: 'chapter 01'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: '01장'
created_date: 2022-01-10
---

# 01장 정리

## 1. Intellij 프로젝트 설정



## 2. Gradle 프로젝트를 Spring Boot 프로젝트로 변경

이 책에서는 [스프링 이니셜라이저](https://start.spring.io)를 일부러 사용하지 않는다. 이는 build.gradle 학습을 위해서이다.

- build.gradle 파일 열기
- 하단의 코드를 build.gradle 최상단에 추가

```java {7}
buildscript {
    ext {
        springBootVersion = '2.1.7.RELEASE'
    }
    repositories {
        mavenCentral()
-       jcenter()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}
```
책에서 jCenter를 사용하고 있지만 이는 2022년 2월 서비스 종료로 deprecated 되니 빼주자.

- 추가한 코드 밑에 다음의 코드 또한 작성 (plugins 블록이 있다면 그 밑에 작성해야 함)

```java {1}
- apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'
```
책에서 apply plugin으로 java를 추가하고 있지만 build.gradle의 plugins에 java가 디폴트로 추가되어 있는 경우 필요 없다.

- dependencies에 다음의 코드를 추가한다.
```java
implementation('org.springframework.boot:spring-boot-starter-web')
testImplementation('org.springframework.boot:spring-boot-starter-test')
```
책에선 compile과 testCompile을 사용하고 있는데, 이는 gradle 3.0부터 deprecated되어 7.0에선 아예 removed 되었다. 따라서 이를 implementation과 testImplementation으로 대체해준다.