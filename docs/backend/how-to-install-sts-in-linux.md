---
title: '리눅스에 STS 설치하기'
eng_title: 'How to Install STS in Linux'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_position: 4
created_date: 2026-04-27
---

# 리눅스에 STS 설치하기

:::info 🤷‍♀️ STS가 머죠?

**Spring Tools**의 약어이다.<br />
Java EE를 써야 해서 인텔리제이라면 Ultimate 라이선스가 필요한데, 놀랍게도 싸피는 라이선스 지원 비용을 절감하기로 했나보다(?) so cool하게 라이선스 지원해줬던 이전 부캠과는 다른 행보이나, 어차피 다같이 IDE 하향평준화 하는거라 신경 안쓰기로 했다.

*괜찮아요 그만큼 맛난 쿠키 주시면 돼요*&nbsp;&nbsp;~~*아니 그래도 이클립스는 좀*~~

:::

<br />

### 1. STS 다운받기

[익숙한 그 사이트](https://spring.io/tools)에서 STS를 다운받을 수 있다.<br />
싸강생이면 이클립스 버전으로 받도록 하자.

<br />

### 2. 압축 해제

다운받은 파일을 압축 해제한다.<br />
파일명은 `spring`까지만 타이핑하고 `Tab` 누르면 앵간히 자동완성된다.

```bash
$ cd ~/Downloads
$ tar -xvf spring-tools-for-eclipse-5.1.1.RELEASE-e4.39.0-linux.gtk.x86_64.tar.gz
```

<br />

### 3. 바로가기 만들기

압축 해제된 파일을 `/opt`에 두고, 바로가기를 생성한다.

```bash
$ sudo mv sts-5.1.1.RELEASE /opt/sts
$ sudo vim /usr/share/applications/sts.desktop

[Desktop Entry]
Name=Spring Tools For Eclipse
Comment=Spring Tools For Eclipse IDE
Exec=/opt/sts/SpringToolsForEclipse
Icon=/opt/sts/icon.xpm
Terminal=false
Type=Application
Categories=Development;IDE;Java;
```

참고로 필자는 바탕화면에 바로가기를 하나 더 두었다. ~~*까먹지 말고 나중에 꼭 삭제하려고*~~

```bash
$ sudo cp /usr/share/applications/sts.desktop ~/Desktop/sts.desktop
```

<img src="https://velog.velcdn.com/images/qriosity/post/8b073256-429a-4d33-b7b8-0f67ba7c7361/image.png" width="180px" height="auto" />

요렇게 나오면 파일 내용을 잘못 작성한 것이고, 하단과 같이 익숙한 그 아이콘이 나와야 한다.

<img src="https://velog.velcdn.com/images/qriosity/post/a4d4654d-6dee-4bd6-bb87-3be3f0b8b9b4/image.png" width="180px" height="auto" />

<br /><br />

### 4. 실행 권한 부여 / trust 설정

근데 왜 빨간색 x가 떠있지? 하고 클릭해보면 99.99% 권한 문제이다. `chmod`를 조져주자.

```bash
$ sudo chmod +x sts.desktop
```

하지만 여전히 x가 떠있을 수 있다. 엥? 머지? 하고 클릭해보면 trust 문제라고 한다. (최신 GNOME 한정)<br />
이 경우 우클릭해서 Allow Launching 눌러도 되고, 하단의 명령어를 적용해줘도 된다.

```bash
$ gio set sts.desktop metadata::trusted true
```

<img src="https://velog.velcdn.com/images/qriosity/post/07fb4e20-66c0-49e0-a549-c01674aca411/image.png" width="180px" height="auto" />

<br /><br />

그럼 이렇게 초록빛이 도는 아이콘으로 변한다. 😺

<br />

### 5. (선택) 기타 설치

STS 설치와는 무관하나 (STS는 4번에서 끝남)<br />
만약 본인이 싸강생이고 maven 프로젝트 돌려야돼서 설치한 상황이면

<img src="https://velog.velcdn.com/images/qriosity/post/0da19ecd-d5e6-4ac3-8858-8fafb207a460/image.png" width="600px" height="auto" />

<br /><br />

- [Tomcat](https://tomcat.apache.org/) - 문서 작성일 기준 v11
- STS Marketplace의 `Eclipse Enterprise Java and Web Developer Tools` 플러그인

최소 요 2개는 필수로 추가 설치해줘야 프로젝트가 구동될 것이다.