---
title: '1강 - Context Logic'
eng_title: 'Chapter 1 - Context Logic'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: '1강 - Context Logic'
created_date: 2022-03-01
---

# 1강 - Context Logic

<div class="video-container">
<iframe src="https://www.youtube.com/embed/C5kMgshNc6g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## NGINX 기본 명령어
- `nginx -v`: NGINX 버전 확인
- `nginx -t`: configuration syntax 검사 (테스트, 보통 push 전에 사용)
- `nginx -T`: 인스턴스의 현재 configuration 확인
- `nginx -s reload`: configuration 파일을 인스턴스로 push
-t, -T는 sudo 권한 필요함

## Configuration 파일 위치
- main configuration 파일 경로: `/etc/nginx/nginx.conf`
- include(커스텀 로직) 경로: `/etc/nginx/conf.d/*.conf`

## Context 구조 및 설명
**configuration = context + directives**

각 configuration은 한 개의 Main, HTTP context를 가진다.

### Context 구조 개요
- **Main**
    - **Events**
    - **HTTP**
        - Server
            - Location
        - Upstream
    - **Stream**
        - Server
        - Upstream

### 0️⃣ Main
최상위 레벨 directive로 구성됨
- worker 프로세스 수
- 리눅스 사용자명
- PID
- 로그 파일 위치 

### 1️⃣ Events
- worker 프로세스에 할당된 연결 개수

### 1️⃣ HTTP
HTTP context에서 사용되는 directive는 자식 context(ex.Server, Upstream, Location)에 상속됨
- NGINX가 http, https 연결을 처리하는 방법을 정의
- 백엔드 서버/어플리케이션 pool 설정

### 1️⃣ Stream
NGINX가 3, 4계층 트래픽을 처리하는 방법을 정의
- TCP
- UDP

#### Server
virtual server(프로세스가 http 요청 받는 가상 호스트) 정의
- 도메인
- IP 주소
- Unix 소켓
으로 정의될 수 있음

#### Upstream
백엔드 서버 그룹 정의 <br />
기본적으로 load balancing에 사용
- 어플리케이션 서버
- 웹 서버

#### Location
정의한 URI를 기반으로 가상 서버가 http 요청을 처리하는 추가적인 방법 정의
- 파일 경로
- 문자열 매칭

## Directive란?
주어진 NGINX 동작을 제어하는 단일 명령문 <br />

### Block
directive들이 중괄호로 묶인 영역

## 주의사항
NGINX는 `include` directive로 configuration들을 읽을 때 알파벳 순으로 읽어들인다.