---
title: '인텔리제이 Lombok 툴팁이 안나올 경우'
eng_title: 'How to Fix Missing Lombok Tooltips in IntelliJ'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_position: 5
sidebar_label: '인텔리제이 Lombok 툴팁이 안나올 경우'
created_date: 2025-09-18
---

# 인텔리제이 Lombok 툴팁이 안나올 경우

툴팁이 안나오는데 컴파일은 된다면 **인텔리제이 플러그인 세팅**이 안된 것이다.

:::info 믿거나 말거나

TIL 주인장은 개발 환경이 바뀌어서 IDE에 롬복 세팅이 안되어있다는 것을 까먹은 채<br />
단순 인텔리제이 버그인줄 알고 한달간 롬복 툴팁 없이 개발한 적이 있다.<br />
*물론 롬복 컴파일은 된다. 구문에서만 인식 못해서 빨간줄로 도배될 뿐*

:::

<br />

세팅법은 다음과 같다.

### 1. Lombok 플러그인 설치 여부 확인

`File` > `Settings` > `Plugins` > Marketplace에서 Lombok 플러그인 설치하기

<br />

### 2. Annotation Processing 켜기

`File` > `Settings` > `Build, Execution, Deployment` > `Compiler` > `Annotation Processors`

Enable annotation processing에 체크

<br />

### 3. 캐시 재시작

`File` > `Invalidate Caches / Restart...` > `Invalidate and Restart` 실행하기