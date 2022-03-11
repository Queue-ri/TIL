---
title: '3강 - Load Balancing'
eng_title: 'Chapter 3 - Load Balancing'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: '3강 - Load Balancing'
created_date: 2022-03-08
updated_date: 2022-03-11
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
디폴트 값은 1이며, 이 경우 균일하게 부하를 분배합니다.

### 서버 가중치를 수동으로 정의한 경우
```
upstream backend_servers {
    server 10.1.1.4:9001 weight=2;
    server 10.1.1.4:9002 weight=3;
    server 10.1.1.4:9002 weight=5;
}
```

## Server Fail과 Timeout
특정 횟수만큼 실패하면 NGINX는 해당 서버를 제외시킬 수 있습니다.

### `max_fails`
서버가 unavailable로 마킹되기 전 실패한 연결 시도 횟수를 지정

### `fail_timeout`
- 연속 실패 시간 제한
- 서버의 unavailable 기간

```
upstream backend_servers {
    server 10.1.1.4:9001 weight=2 max_fails=10 fail_timeout=90s;
}
```
90초 동안 unavailable로 마킹되기 전에 10번 실패할 수 있으며, 마킹되면 NGINX는 이 서버에 90초 동안 요청을 보내지 않습니다.

## NGINX의 Load Balancing 방법
### `hash`
- md5 hash 알고리즘 사용
- 지정된 키를 기반으로 요청을 서버에 전달
- 프론트보단 백엔드, 방화벽 뒤에서 사용
- 세션 정보 유지 가능
    - but 서버 추가나 제거 시 hash 키가 손실되어 세션 정보 무효화

```
upstream backend_servers {
    hash $request_uri;

    server 10.1.1.4:9001 weight=1;
    server 10.1.1.4:9002 weight=2;
    server 10.1.1.4:9003 weight=3;
}
```

`request_uri`에 클라이언트가 요청한 URI를 캡쳐

 URI에 따라 라우팅 경로가 다릅니다.

 upstream에서 변경 사항 발생 시 hash 키는 재생성됩니다.

### `ip_hash`
- 클라이언트 IP를 키로 사용

```
upstream backend_servers {
    ip_hash;

    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
}
```

hash와 비슷하지만, 차이점이라면 이미 클라이언트의 IP(IPv4, IPv6)로 키가 결정된다는 점입니다.

**Reverse Proxy 사용 시 모든 요청이 같은 IP에서 오는 줄 알기에 주의!**

### `least_conn`
- least connection, 연속 연결 수가 가장 적은 서버에 요청을 보내는 방법
- 연결 수가 동일할 시엔 가중치 라운드 로빈

```
upstream backend_servers {
    least_conn;

    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
}
```

### `least_time`
- NGINX Plus Only
- 평균 응답 시간이 가장 빠르고 활성 연결 수가 가장 적은 서버를 선택

```
upstream backend_servers {
    least_time header;

    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
}
```
`header` 매개변수 외에도 `last_byte` 또는 `inflight` 사용 가능

### random
- NGINX Plus Only
- 무작위
- 두 개의 옵션에 따라 가중치 기반으로 두 개의 서버를 랜덤 선택 -> 둘 중 하나 랜덤 선택

## 세션 지속성 활성화
### 고정 쿠키
세션 지속성을 활성화하는 **가장 쉬운 방법은 고정 쿠키**를 사용하는 것입니다.

```
upstream backend_servers {
    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
    sticky cookie srv_id expires=1h domain=.example.com path=/;
}
```
`srv_id`는 고정 쿠키, 이후는 optional parameters

### 고정 경로
```
upstream backend_servers {
    server 10.1.1.4:9001 route=a;
    server 10.1.1.4:9002 route=b;
    server 10.1.1.4:9003;
    sticky route $route_cookie $route_uri;
}
```

### 고정 Learn
request와 response를 검사하여 세션 식별자를 찾습니다.
```
upstream backend_servers {
    server 10.1.1.4:9001;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
    sticky learn
     create=$upstream_cookie_examplecookie
        lookup=$cookie_examplecookie
        zone=client_sessions:1m
        timeout=1h;
}
```

## 기타
### `max_conns`
서버가 처리 가능한 최대 동시 연결 수

### `queue`
upstream에 대한 max_conns를 초과하지 않는 수의 요청을 대기열에 배치

```
upstream backend_servers {
    server 10.1.1.4:9001 max_conns=300;
    server 10.1.1.4:9002;
    server 10.1.1.4:9003;
    queue 100 timeout=70;
}
```
`timeout`: 대기열의 클라이언트에 503 오류를 보내기 전 서버가 대기하는 시간