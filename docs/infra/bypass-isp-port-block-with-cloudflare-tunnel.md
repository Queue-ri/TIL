---
title: 'Cloudflare Tunnel로 80/443 통신사 포트 차단 우회하기'
eng_title: 'Bypass ISP Port Block with Cloudflare Tunnel'
image: https://til.qriosity.dev/img/m_banner_background.jpg
created_date: 2026-06-18
---

# Cloudflare Tunnel로 80/443 통신사 포트 차단 우회하기

:::info 초안 발행 예정

이 TIL 문서는 블로그 글로 발행될 예정입니다.

:::

## 문제 상황

### 공유기에서 LAN으로 갈아탄 후 외부 접속 불가

홈서버 환경을 공유기로 세팅했을 땐 Super DMZ 설정을 통해 포트 허용이 가능했다.<br />
그런데 가족이 공유기를 가져가버린 후(...) *오히려 좋아* 하며 LAN으로 직결했는데<br />
Let's Encrypt 인증서 발급이 계속 타임아웃 나서 yougetsignal 확인 + 서칭 좀 해본 결과, 통신사에서 포트를 막아놨다는 사실을 알게 되었다.

### 왜 막음?
국내 대부분의 가정용 유선 인터넷 회선은 보안 및 트래픽 제어를 목적으로 웹 서비스용 표준 포트인 80, 443 인바운드 요청을 통신사(ISP) 단에서 원천 차단한다. 서버 내부 방화벽(UFW)에서 포트를 허용하더라도 랜카드에 패킷이 도달하기 전에 드랍되므로 일반적인 웹서버 포트 개방 방식으로는 외부 접속이 안되는 것이다.

<br />

## 해결 방법

### Cloudflare Tunnel

인바운드를 막았다고 했지 아웃바운드를 막았다고는 안했다(!)<br />
사실 아웃바운드를 통신사가 막을 수 없다. 그걸 막으면 웹 접속이 안되므로.

엥 이거 내부->외부로 가는 단방향 아니에요? 싶지만, 잘 생각해보면 인바운드도 connection 맺어지면 양방향 통신이 되듯이,

아웃바운드도 connection 수립 요청만 외부를 향하는 단방향이고, 수립되면 양방향이다.<br />
그래서 클플 터널이 이걸 기똥차게 인바운드처럼 쓰게 해준다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

![](https://velog.velcdn.com/images/qriosity/post/674cf563-38d8-4384-a2b6-991884efd89d/image.png)
<br /><sub>무슨 나이더스 커널임?</sub> 

<br />

## 설정 1: cloudflared 설치

서버 내부에 `cloudflared` 데몬을 설치해야 한다. ~~이게 나이더스 커널임~~<br />
얘를 설치하면 Cloudflare Edge 서버와 지속적인 connection 터널을 먼저 수립한다. 이후 외부 사용자가 도메인으로 접속하면, 클플이 기존에 연결되어 있는 아웃바운드 파이프라인을 타고 역으로 데이터를 서버 내부로 주입해준다. (보안은 덤)

이 방식을 사용하면 서버의 80, 443 포트를 열지 않고도 외부 HTTPS 접속을 안전하게 허용할 수 있고, 공인 IP 노출도 안되는데다 SSL 인증서 관리까지 Cloudflare 단에서 처리되므로 아주 편리하다.

<span style={{ fontSize: '2rem' }}> **그리고 무엇보다 무료임!**</span>

<br />

## 설정 2: NGINX 리버스 프록시

### NGINX 프록싱을 순수 HTTP로 설정

443 블록조차 없으며, 그저 http만 열어놓은 매우 간단한 구조가 된다.

```config title="gyul.qriosity.dev"
server {
    listen 80;
    server_name gyul.qriosity.dev;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```

상단은 FE 설정인데 BE는 어차피 같은 머신 내라서 프라이빗하게 연결할...까 싶었으나<br />
생각해보니 swagger 때문에 같이 설정하는게 좋을 것 같다.

### NGINX syntax 검사 및 재시작

```bash 
sudo nginx -t
sudo systemctl restart nginx
```

<br />

## 설정 3: 터널 생성

![](https://velog.velcdn.com/images/qriosity/post/7f1ac1b8-edab-46b1-87c6-c8023f94a5f5/image.png)

1. **Cloudflare 대시보드** 진입 -> **Networking** -> **Tunnels** -> **Create a tunnel** 클릭
2. 맞는 머신 환경(나는 Debian) 선택 후, 제공되는 스크립트를 순차적으로 서버 터미널에서 실행
3. Connection Status 확인

<br />

### 설정 4: DNS에 터널 매핑
![](https://velog.velcdn.com/images/qriosity/post/6fa53152-805b-49db-bb4d-a08d84911740/image.png)

우선 도메인이 겹치는 기존의 A 레코드가 있다면 충돌나므로 삭제해준다.<br />
이후 CNAME 레코드로 터널을 등록하여 연결해주면 된다.

참고로 UUID는 Tunnel ID이다. Replica ID 아님 주의! (잘못 쓰면 1033 에러 뜸)

:::warning 자나깨나 구라핑 주의

제미나이가 분명 **CNAME 레코드는 터널 생성 시 자동 등록해준댔는데**<br />
공식 도큐를 보니 터널 별 UUID 기반으로 서브도메인이 생성된다는거지, 레코드는 수동 등록이다 ㅎ

![](https://velog.velcdn.com/images/qriosity/post/3e2055e4-bb60-4827-97fa-f65c384f6854/image.png)

어쩐지 `NS_ERROR_UNKNOWN_HOST` 뜨더라

:::
