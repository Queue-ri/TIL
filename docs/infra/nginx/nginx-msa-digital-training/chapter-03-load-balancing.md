---
title: '3강 - Load Balancing'
eng_title: 'Chapter 3 - Load Balancing'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: '3강 - Load Balancing'
created_date: 2022-03-08
---

# 3강 - Load Balancing

<div class="video-container">
<iframe src="https://www.youtube.com/embed/a41jxGP9Ic8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Load Balancing 이란?
### 정의
서버 farm의 여러 서버에 걸쳐 네트워크 및 어플리케이션 트래픽을 효율적으로 분배하는 것

### 위치
클라이언트와 백엔드 서비스 사이에 위치

### 역할
클라이언트로부터 요청을 받아 해당 요청을 수행할 수 있는 upstream 서비스 또는 인스턴스로 요청 전달

## NGINX의 Load Balancing 설정법
- 클라이언트 요청을 처리할 서비스 풀 또는 그룹 정의하기
- `proxy_pass` directive가 요청을 풀에 전달
- 풀 내의 서비스는 다음의 조합으로 정의 가능
    - Unix 소켓
    - 도메인 이름
    - IP 주소와 포트 번호

### `upstream`
- HTTP context 내에 정의
- 서버 풀을 설정하는 directive

```
upstream <server pool name> {
    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
}
```

### `proxy_pass`
- upstream으로 요청을 전달하는 directive

## NGINX의 Load Balancing 수행
- 사용자 정의 방법을 따름
- 사용자 정의가 없다면 디폴트 weighted Round Robin

### 디폴트 서버 가중치
```
upstream backend_servers {
    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9002;
}
```
디폴트 값은 1이며, 이 경우 균일하게 부하를 분배한다.

### 서버 가중치를 수동으로 정의한 경우
```
upstream backend_servers {
    server 10.1.1.4:9001 weight=2;
    server 10.1.1.4:9002 weight=3;
    server 10.1.1.4:9002 weight=5;
}
```

## Server Fail과 Timeout
특정 횟수만큼 실패하면 NGINX는 해당 서버를 제외시킬 수 있다.

### max_fails
서버가 unavailable로 마킹되기 전 실패한 연결 시도 횟수를 지정

### fail_timeout
- 연속 실패 시간 제한
- 서버의 unavailable 기간

```
upstream backend_servers {
    server 10.1.1.4:9001 weight=2 max_fails=10 fail_timeout=90s;
}
```
90초 동안 unavailable로 마킹되기 전에 10번 실패할 수 있으며, 마킹되면 NGINX는 이 서버에 90초 동안 요청을 보내지 않는다.