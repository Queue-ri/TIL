---
title: '미니PC 홈서버 운영 이슈들'
eng_title: 'MiniPC Home Server Operation Issues'
image: https://til.qriosity.dev/img/m_banner_background.jpg
created_date: 2025-09-27
---

# 미니PC 홈서버 운영 이슈들

## 방화벽 문제 없는데 523 뜰 경우

공유기 자체의 DHCP 동적할당 때문에 내부 IP가 틀어질 수 있다.

일정 기간 동안(1~2일?) 특정 내부IP가 사용되지 않으면 할당이 해제되는듯?

![](https://velog.velcdn.com/images/qriosity/post/be9c27c8-f93e-4d49-b8e6-a73ca0c51764/image.png)

이틀정도 서버를 꺼놨을 때 상단과 같이 홈서버의 내부 IP가 변경되었다.

따라서 홈서버는 아예 MAC주소로 묶어서 고정 내부 IP를 사용하도록 설정하는 방식이 권장된다.

<br />