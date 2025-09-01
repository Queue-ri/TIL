---
title: '🐳 유용한 Docker 팁'
eng_title: '🐳 Useful Docker Tips'
image: https://til.qriosity.dev/img/m_banner_background.jpg
created_date: 2025-09-01
---

# 🐳 유용한 Docker 팁

## 간단하게 `ps` 보기

필요한 칼럼만 추려서 조회할 수 있는데 명령어가 너무 길면 alias를 사용하면 된다.

```sh
alias dps='docker compose ps --format "table {{.Name}}\t{{.Service}}\t{{.State}}\t{{.Ports}}"'

dps
```

<br />

## 우분투에서 호스트 접근하기

docker 스크립트에서 `localhost` 대신 사용하는 `host.docker.internal`은 슬프게도 Mac이랑 Windows에서만 기본적으로 작동하고

리눅스는 컨테이너 실행 시 `--add-host host.docker.internal:host-gateway` 옵션을 지정해야 작동한다.

compose 파일로 작성할땐 다음과 같다.

```yml
extra_hosts:
    - "host.docker.internal:host-gateway"
```

그리고 개인적으로는 외부 IP를 통한 통신이 아니더라도 **같은 머신 상의 컨테이너 &lt;-> 호스트 간 연결에 ufw까지 허용해줘야 했다.**

`docker0` 도 안되고 `127.17.0.0/16` 안되고 결국 Anyware로 열어버리니 연결이 되는데 대체 어디서 핸드셰이크 하고 자빠진건지 모르겠음.