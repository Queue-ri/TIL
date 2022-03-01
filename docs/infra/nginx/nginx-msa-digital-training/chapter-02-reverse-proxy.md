---
title: '2강 - Reverse Proxy'
eng_title: 'Chapter 2 - Reverse Proxy'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: '2강 - Reverse Proxy'
created_date: 2022-03-01
---

# 2강 - Reverse Proxy

<div class="video-container">
<iframe src="https://www.youtube.com/embed/lZVAI3PqgHc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<marquee style={{fontSize:'50pt'}} scrollamount="20">⭐<b>리버스 프록시는 가장 흔한 NGINX use case이다</b>⭐</marquee>

## Proxy 종류

### Forward Proxy
- 클라이언트의 identity를 숨기고 대신하는 용도

### Reverse Proxy
- server-side proxy
- 백엔드 어플리케이션의 identity를 숨기고 대신하는 용도

일반적으로 NGINX는 리버스 프록시로 배포합니다.

## NGINX의 Proxy Directives

### proxy_pass

NGINX는 `proxy_pass` directive로 프록시를 수행합니다.

```
proxy_pass <backend destination>
```

`proxy_pass`는 일반적으로 `Server` 또는 `Location` context에서만 사용합니다.

### proxy_set_header

NGINX는 리버스 프록시 지점에서 클라이언트와의 연결을 닫은 후 다시 리버스 프록시에서 백엔드로의 연결을 시작하는 방식으로 동작하기 때문에, 이 과정에서 클라이언트 측의 정보가 유실될 수 있습니다. 따라서 백엔드에서 클라이언트의 헤더 정보를 보려면 `proxy_set_header` directive를 통해 헤더 정보를 변수화하여 백엔드에 넘겨주어야 합니다.

```
proxy_set_header <HTTP header field name> <variable name>
```