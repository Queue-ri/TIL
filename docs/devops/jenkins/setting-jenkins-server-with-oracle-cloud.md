---
title: '오라클 클라우드로 젠킨스 서버 만들기'
eng_title: 'Setting Jenkins Server with Oracle Cloud'
image: https://til.qriositylog.com/img/m_banner_background.jpg
created_date: 2022-03-25
---

# 오라클 클라우드로 젠킨스 서버 만들기

## 패키지 업데이트
서버 SSH 접속 후 관리자 권한으로 실행합니다.
```bash
$ sudo apt-get update -y
$ sudo apt-get upgrade -y
```

## 자바 설치
```bash
$ sudo apt-get install default-jdk -y
```

다 설치했으면 자바 버전도 확인해보세요.
```bash
$ java -version
```

## 젠킨스 설치
우분투에 리포지토리에는 젠킨스가 기본으로 제공되지 않으므로 따로 추가해줍니다.
```bash
$ sudo apt-get install apt-transport-https gnupg2 -y
$ sudo wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | apt-key add -
$ sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

추가가 완료되었으면 패키지를 업데이트하고 젠킨스를 설치합니다.
```bash
$ sudo apt-get update -y
$ sudo apt-get install jenkins -y
```

```
Job for jenkins.service failed because a timeout was exceeded.
See "systemctl status jenkins.service" and "journalctl -xe" for details.
invoke-rc.d: initscript jenkins, action "start" failed.
● jenkins.service - Jenkins Continuous Integration Server
     Loaded: loaded (/lib/systemd/system/jenkins.service; enabled; vendor preset: enabled)
     Active: activating (auto-restart) (Result: timeout) since Thu 2022-03-24 05:01:34 UTC; 75ms ago
    Process: 677575 ExecStart=/usr/bin/jenkins (code=exited, status=143)
   Main PID: 677575 (code=exited, status=143)
     Status: "Jenkins stopped"

Mar 24 05:01:34 qriositylog systemd[1]: Failed to start Jenkins Continuous Integration Server.
```
??? 타임아웃 에러네요. 아마 포트가 막혀있어서 그럴 확률이 높습니다.

저는 오라클 클라우드이므로 Subnet 쪽의 Ingress Rules을 설정했는데요,

젠킨스 기본 포트인 8080을 rule에 추가해도 되지만, 충돌을 피하기 위해 8081로 설정하는 것도 나쁘지 않습니다.

이처럼 기본 포트를 변경하고 싶다면 젠킨스 자체 설정 파일에서도 포트 값을 변경해줘야 합니다.

`/etc/default/jenkins` 파일에서 `HTTP_PORT` 값을 변경해주세요.

포트 수정이 끝났으면 오류 나서 자고 있는 젠킨스를 다시 start 합니다.
```bash
$ sudo service jenkins start
```

그 다음, 젠킨스가 일하는지 status를 확인합니다.
```bash
$ sudo systemctl status jenkins
```

java 녀석이 명령한 포트에서 똑바로 LISTEN 하고 있는지 감시도 한번 해봅니다. 굳이 왜하냐고요? 포트 변경 명령 안듣고 계속 8080에서 대기하는 버그가 있기 때문입니다. ~~진짜 샷건 치기 직전에 재설치해서 고쳤다는~~
```bash
$ sudo ss -antpl | grep 8081
```

:::note 전반적인 젠킨스 설치 및 실행 과정

install jenkins -> 오류 -> port 8081로 변경, 8081 포트 허용 -> service jenkins start

:::

참고로 '8081 포트 허용' 이란 다음의 두 커맨드를 의미하는 것인데
```bash
sudo iptables -I INPUT -p tcp --dport 8081 -j ACCEPT
sudo iptables -I OUTPUT -p tcp --sport 8081 -j ACCEPT
```

이는 젠킨스를 설치할 서버에 제가 이미 아파치를 설치하여 웹 서버로 사용하고 있었기 때문이며, 다른 환경이라면 참고 정도만 하고 별 이상 없으면 넘기셔도 됩니다.

마지막으로 curl 한번 실행해보면 운명의 결과를 알 수 있습니다. 자바가 내 말을 들었을지...
```bash
$ curl localhost:8081
```
저처럼 웹 서버에 설치하셨다면 이 상태에서 바로 웹 브라우저로 `http://도메인:8081`에 접속 또한 가능합니다.

## 젠킨스 시작
젠킨스 페이지에 들어가면 메인 화면에 비번 파일 경로를 알려주면서 비번을 입력하라고 합니다.

입력하고 들어가면 초기 설정을 할 수 있습니다.