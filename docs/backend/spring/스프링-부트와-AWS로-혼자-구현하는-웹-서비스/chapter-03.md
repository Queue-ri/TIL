---
title: '03장'
eng_title: 'chapter 03'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 3
sidebar_label: '03장'
created_date: 2022-03-25
---

# 03장 정리

## 1. JPA와 데이터베이스
- 서비스 기업: Spring Boot & JPA 가 전사 표준
- SI 기업: Spring & MyBatis

RDB와 OOP는 패러다임이 불일치하므로, 이 경우 중간에서 패러다임을 일치시켜주는 JPA가 유용합니다.

개발자가 객체지향적 프로그래밍을 하면, JPA는 이를 SQL로 바꾸어 실행해줍니다.

결론적으로 생산성이 향상되고, 유지보수하기 용이해집니다.

### Spring Data JPA
JPA는 사실 인터페이스이기 때문에 구현체가 필요합니다. 대표적인 구현체로는 Hibernate가 있는데, 이 구현체를 쉽게 갈아끼우도록 스프링 진영에선 Spring Data JPA라는 모듈을 만들었습니다. 뿐만 아니라 차후 MongoDB와 같은 저장소 교체에도 유용합니다.

#### HOW???
Spring Data의 하위 프로젝트는 모두 기본 CRUD 인터페이스가 같기 때문입니다.

## 2. Spring Data JPA 적용하기
