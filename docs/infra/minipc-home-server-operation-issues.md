---
title: '미니PC 홈서버 운영 이슈들'
eng_title: 'MiniPC Home Server Operation Issues'
image: https://til.qriosity.dev/img/m_banner_background.jpg
created_date: 2025-09-27
updated_date: 2026-06-18
---

# 미니PC 홈서버 운영 이슈들

## 방화벽 문제 없는데 523 뜰 경우

공유기 자체의 DHCP 동적할당 때문에 내부 IP가 틀어질 수 있다.

일정 기간 동안(1~2일?) 특정 내부IP가 사용되지 않으면 할당이 해제되는듯?

![](https://velog.velcdn.com/images/qriosity/post/be9c27c8-f93e-4d49-b8e6-a73ca0c51764/image.png)

이틀정도 서버를 꺼놨을 때 상단과 같이 홈서버의 내부 IP가 변경되었다.

따라서 홈서버는 아예 MAC주소로 묶어서 고정 내부 IP를 사용하도록 설정하는 방식이 권장된다.

<br />

## 유선 외부접속 재설정

동생이 공유기를 가져가버려서 외부접속을 다시 설정해야 하는 일이 발생했다.<br />
서버는 이래서 고정 IP인게 굉장이 중요한듯 하다ㅜㅜ 재설정이 상당히 번거롭다.

```bash
$ curl ifconfig.me
```

여기서 나온 IP를 네임서버에 재등록한다.

![](https://velog.velcdn.com/images/qriosity/post/2a5dc0a7-8787-4458-b8fb-5b12bb7b3cbc/image.png)
<br /><sub>이 개똥 리눅스 크롬 진짜 클플 캡챠 되는걸 본 적이 없음 아오</sub>

DNS 네임서버에 신규 추가될 도메인이 있으면 해당 IP로 등록해준다. **Proxy는 지금 단계에선 설정하면 안됨!**

*그나저나 IP가 안바꼈네?? 동일한 랜 허브에 연결한거라서 그런가??*

### NGINX 설정

기존의 리버스 프록시 설정은 `/etc/nginx/sites-available`에 서브도메인별로 파일을 나누어 관리하고 있었다.

```bash
qriosity@server:/etc/nginx/sites-available$ ls
default  doki.qriosity.dev  qriosity.dev  uniq.qriosity.dev
```

해당 방식을 그대로 따라가도록 한다.<br />
그리고 당장은 http로만 설정하고 이따 nginx test 끝나면 Let's Encrypt로 SSL/TLS 설정하는거 잊지 말기!

```bash
sudo vim /etc/nginx/sites-available/gyul.qriosity.dev
```

파일 작성 후 심볼릭 링크를 생성한다 (그래야 NGINX가 적용함)

```
sudo ln -s /etc/nginx/sites-available/gyul.qriosity.dev /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.gyul.qriosity.dev /etc/nginx/sites-enabled/
```

링크 생성 여부를 하단의 명령어로 확인한다.

```bash
ls -l /etc/nginx/sites-enabled/
```

ㅇㅇ 그리고 NGINX 테스트~

```bash
sudo nginx -t
sudo systemctl restart nginx
```

테스트 통과하고 restart 했으면 SSL/TLS 설정을 진행한다.

```bash
sudo certbot --nginx -d gyul.qriosity.dev -d api.gyul.qriosity.dev
```

### 헬지 유플러스

근데 certbot이 들어오질 못하네?? [yougetsignal](https://www.yougetsignal.com/tools/open-ports/)을 확인하니 80번도 막혀있고 443도 막혀있었다.<br />
분명 방화벽 설정 다 확인했는데 왜 그런가 하여 찾아보니

![](https://velog.velcdn.com/images/qriosity/post/0a8f6198-3961-4592-81b3-a151aef11932/image.png)

아. 😡

### Cloudflare Tunnel을 통한 통신사 block 우회

![](https://velog.velcdn.com/images/qriosity/post/3a6a32aa-f3d2-47e6-90f0-f45ea471a69a/image.png)

하지만 우리는 늘 답을 찾을 것이다.

아니 이런 창의적인 방법이 있었다니? ㅋㅋㅋㅋㅋㅋㅋㅋ<br />
갓갓갓갓플레어의 Tunnel을 통해서 아웃바운드 커넥션으로 아주 쉽게 외부접속을 뚫는 방법이 있었다.

클플 터널을 통한 자세한 세팅 과정은 [Cloudflare Tunnel로 80/443 통신사 포트 차단 우회하기](https://til.qriosity.dev/featured/infra/bypass-isp-port-block-with-cloudflare-tunnel) 문서에 정리해두었다.