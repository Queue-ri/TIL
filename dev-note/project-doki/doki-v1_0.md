---
title: 'DOKI v1 (0220 ~ 0228)'
eng_title: 'DOKI v1 (0220 ~ 0228)'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 1
sidebar_label: 'DOKI v1 (0220 ~ 0228)'
created_date: 2025-05-20
updated_date: 2025-08-13
---

:::note 내용 못알아먹겠음 주의

Dev note는 정식 회고록이 아닌 draft 입니다.<br />

:::

### 📆 25-02-20

기획 수정, ERD, 회원가입/로그인(JWT)

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/4](https://github.com/ssginc-be/DOKI/issues/4)

<br/>

#### 📌 프로젝트 상황

이제 남은 기간이 얼마 없다. 프레젠테이션 때 최대의 결과를 보여드려야 하는데 기획에 CRUD가 다 없어서(특히 DELETE) 이게 심사 항목 상 문제가 되지 않을지 걱정이다.

모니터링이나 퍼포먼스 부분들은 내가 하고 싶은 부분인데 뭐랄까, '하고싶다' 레벨을 넘어섰다.

'한다', '안하는 미래는 없다'라는 생각이 더 지배적이다.

솔직히 집중을 위해 집에서 아무와도 상호작용 없이 작업하고 싶다. *(상호작용이 있으면 현재 수준의 몰입이 좀 흐트러진다.)*

근데 밖에서 이러한 몰입을 유지하도록 연습하는 당장의 환경이 좋은 경험이라고 생각은 한다.

<br/>

#### 📌 ER Diagram
> [https://www.erdcloud.com/d/iALeanZK8tosAe79p](https://www.erdcloud.com/d/iALeanZK8tosAe79p)

다음의 도메인을 drop 했다.

- 결제: 상품, 장바구니, 주문, 결제
- 채팅: 챗봇, 신고
- 권한: 팝업스토어 운영자(MANAGER)

왜냐하면 이전 포트폴리오들의 PR을 통해 해당 도메인은 이미 할 수 있다는 것을 보여줄 수 있을 것 같았다.

권한 부분에 있어선 운영자가 날라가므로 플랫폼 관리자가 문서 상의 팝업스토어 정보를 직접 등록해주는 것으로 기획 변경.

운영자가 날라가면서 회원계정 &lt;-> 팝업스토어 사이의 M:N 관계 중계하는 테이블도 ㅂㅂ 했는데, 중계 자체를 버리긴 싫어서 이를 팝업스토어 &lt;-> 카테고리 관계에 적용했다.

불량이용자 제재는 원래 채팅에서의 불량이용자를 의미했는데, 혹시 여유 시간 생기면 예약에서의 비정상 트래픽 탐지 및 제재로 옆그레이드 할 수 있을 것 같아서 테이블은 남겨뒀다.

늘 그래왔는데, 유난히 automation + tolerance한 시스템에 재미가 느껴진다.

그만큼 정교하게 만들고 싶은데 이것까지는 욕심 같음... 기간이 너무............ 없어도 너무 없음........

결제는 PG 좀 붙여보고 싶었는데 아숩지만 다음에 하면 되지. 잠시 안녕~

<br/>

#### 📌 회원가입/로그인

기존 아키텍쳐에서 큰 변동사항은 없을 것 같다. auth는 별도의 micro service로 두는 경우가 많긴 한데, 기간 고려하면 지금 그거 분리할 때가 아니다.

분리하면 할수록 service 간의 통신에서 오는 오버헤드나, cross-cutting concerns 부분을 고려하게 돼서, 걍 이 기간엔 안 그러는 것이 맞다고 생각했다.

MSA 아키텍쳐의 당위성을 납득시키려면 해당 부분에 대한 고민이 많아야 하는데, 지금 구현이 0순위라 어쩔 수가 없음.

그래서 기존의 계획은, PT때 기간 상의 한계를 들며 이 부분을 제언하려고 했다. 누가 봐도 MSA라는데 서비스 분리 딱 2개 해놓으면 '???' 싶기 때문에 ㅋㅋ

<br/>

---

#### 📌 참고 레퍼런스
https://pixx.tistory.com/287
https://pixx.tistory.com/275 -> 요거 내용 좋음. 밥먹으면서 여러번 보셈

이를 통해 flow를 정리하자면,

1. G/W는 filter를 구현해서 끼워넣으면 이걸로 JWT validation을 수행.
2. sign up, sign in, sign out 관련 비즈니스 로직은 controller, service 구현해서 common service로 ㄱㄱ
3. 그리고 겸사겸사 G/W에 routing 넣어야 하는데 이슈 분리하고 싶지만 바쁘니 타협함. (바빠서 하는 타협은 늘 기분이 별로다.)

---

<br/>

#### 📌 JwtUtil, 어디로 가야하나
validation 부분에서 DB를 한 번 갔다와야 하는데, G/W에서 그럴 순 없고

common service 쪽에 사용자 조회 api를 구현하고 OpenFeign 써야 할 듯! ... 이라고 생각했으나?

그럼 `JwtUtil` 어쩔거임. G/W랑 common service에 있을때랑 각자 사용자 정보 퍼오는 방식이 다르자늠? (내부 API 호출 vs. JPA 직빵 조회)

<br/>

#### 📌 해결 방안 후보
1. 각각에 맞도록 `JwtUtil`을 복붙해서 작성하기 -> 아 이건 좀;
2. common service에 `JwtUtil` 두고 G/W에는 유틸따위 없음 ㅇㅇ 그냥 모든 JWT 관련을 common service에 맡기기

<img src="https://velog.velcdn.com/images/qriosity/post/f33f945c-b2d4-4d90-9601-9fc9268d0b09/image.png" width="400" height="auto" alt="https://github.com/user-attachments/assets/a7080062-c495-4540-9fb8-ec2181bff731" />

...당연히 2안을 선택했다.

<br/>

#### 📌 AT 재발급의 최선책은?

현재의 기획으로는, AT와 RT는 모두 쿠키에 들어간다.

그럼 지정한 path에 대해선 둘 다 자동으로 쏘아지고, 서버는 해당 정보를 안다는 것이다.

여기서, 이용자가 플랫폼을 켜두고 잠깐 점심 먹고 왔다고 가정하자.

다시 돌아왔을 때 AT는 만료되었을 것이다. 이 상태로 서버에 request를 보내면, 서버가 검증단에서 만료된 토큰임을 인지한다.

그래. 근데 그 다음은? 추가로 생각을 또 나열해보자.

1. 서버: 401 던짐 -> 클라: 재발급 api 호출 -> 서버: AT 재발급하고 쿠키 세팅 -> 클라: AT 쿠키 갱신됨 -> 클라: 비즈니스 api 재호출
2. 서버: Redis에서 RT 조회 -> 서버: RT 유효하면 AT 재발급하고 쿠키 세팅 + 비즈니스 로직에 대한 결과 반환 -> 클라: AT 쿠키 갱신됨

1과 2중에서 어느 방식으로 할 지 내심 고민이 있었다. 근데 멘토분께서 보통은 서버가 덜 처리하는 방식으로 간다고 하셔서 1안을 선택했다.

따라서 JWT flow는 하단과 비슷하게 될 것 같다.

<img src="https://velog.velcdn.com/images/qriosity/post/7209693a-98f1-4893-adab-6f51813c28cb/image.png" width="600" height="auto" alt="https://github.com/user-attachments/assets/cf8b6a29-1597-4ab3-ab2b-d3b5e9daa6f5" />

</details>

### 📆 25-02-21

Custom Exception

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/5](https://github.com/ssginc-be/DOKI/issues/5)

<br/>

#### 📌 프로젝트 상황

<center><a href="https://youtu.be/VsYLIg67pYo"><span style={{fontSize:"18px"}}><i>FREEDOM DIVE</i></span></a></center>

<br/>

#### 📌 Custom Exception 만들기

레퍼는 [요걸](https://velog.io/@rungoat/SpringBoot-Custom-Exception-%EC%B2%98%EB%A6%AC) 참고함

</details>

### 📆 25-02-23

추가 토픽, JPA 순환참조 문제

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/10](https://github.com/ssginc-be/DOKI/issues/10)

<br/>

#### 📌 프로젝트 상황
`1.0.0-beta.3` 배포에 대한 압박감이 너무 심했던 나머지, 토요일은 진짜 하루종일 죽은듯이 잠만 잤다.

그 덕에 일요일부턴 머리 회전 속도가 꽤 나아졌지만, 토요일을 날린 대가로 예약 API를 아직 구현하지 못했다.

현재 프레젠테이션 거리는 4가지 정도 나온 것 같다.

1. 팝업스토어 조회 결과 캐싱하여 반환 타임 비교
2. LIKE 검색 vs Elasticsearch
3. 이미지 CDN 퍼포먼스 비교
4. 일반 예약과 MQ 예약 방식의 반환 타임 비교

그 외에 member 테이블에서 JPA가 충돌이 나는 부분이 있는데 일단 '명시화'로 땜빵해놓긴 했다.<br />
생각보다 단순한게 원인일 수도 있어서 프레젠테이션 대상으로는 보류 중이다.

그리고 API Gateway 쪽에 재밌는게 있을지 알아보고 있다.<br />
request 좀 가로채면 재밌는 거리가 나올 것 같은데...

#### 그 외에 생각해본 토픽들

- 메트릭, health check
- 로그 대시보드
- 비정상 예약 시도 탐지
- 이용자 트러블슈팅 및 관리자 유지보수
    - 5xx 에러만 트러블슈팅
    - `ErrorResponseEntity`에 request UUID나 타임스탬프 추가하면 좋을듯?

<br/>

#### 📌 JPA 양방향 연관관계 매핑과 순환참조 문제 해결

`@OneToMany`와 `@ManyToOne`으로 양방향 매핑 시 엔티티 그대로 직렬화하면 순환참조 대참사가 일어난다.

이는 DTO로 변환하여 직렬화 시 해결되는 문제이다.

사실 DTO 만들기 전 빠르게 API 응답 테스트하다가 생긴 문제였음.

</details>

### 📆 25-02-24

UI 디자인, Elasticsearch 설정

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/12](https://github.com/ssginc-be/DOKI/issues/12)

<br/>

#### 📌 프로젝트 상황
UI 개요가 잡혔다. 백화점이라는 도메인을 고려해서 보수적인 디자인을 하려 했는데,

디자인 알못이라 잘 된건지는 모르겠다.

그리고 실시간에 대한 나름의 정의와 기준을 내려야 하고

이를 기능으로 구현해야 하는데, 지금까지 한 2가지 정도 도출된 것 같다.

1. 예약 부하 분산 처리 (Kafka)
2. SSE 알림

키바나 로그 대시보드 만들려면 정말 매일매일 열..심히 구현해야겠다 ㅜ

---
#### 📌 UI 개요

#### ✨ 팝업스토어 목록 조회
이미지 강조형 서비스인데다 MZ하면 안돼서 강제 모노톤이 됨

![https://github.com/user-attachments/assets/90121139-03ea-4fda-8493-91abae9a4e59](https://velog.velcdn.com/images/qriosity/post/ca1c6db7-06e8-46ac-90d2-8f84dec6ff27/image.jpg)

#### ✨ 팝업스토어 예약
어떻게 하면 프론트 구현이 최대한 덜 번거로울까 고민한 결과

~~캘린더 따위 쓰지 않기로 했다 ^^~~

*(-> 어찌저찌 구현하다가 버튼 계층관계가 헬이라서 결국 캘린더를 사용했는데 훨씬 편했다.)*

![https://github.com/user-attachments/assets/43e3ea84-e6a4-41f7-87c9-60a7e8669b0c](https://velog.velcdn.com/images/qriosity/post/44041e83-4d89-4ffb-bacd-e04b0b5d67cb/image.jpg)

#### ✨ 운영자 대시보드

메뉴 구성과 기본적인 레이아웃만 잡았다. 내용에 들어가는건 레퍼 참고할거임.

하트 아이콘은 placeholder로 둔건데 뭔가 자연스러운듯...?

![https://github.com/user-attachments/assets/f22df443-96c0-4a98-ab23-02ced4a5c598](https://velog.velcdn.com/images/qriosity/post/12b2ff38-a972-47a7-8d9e-44655bbcde23/image.jpg)

#### ✨ 관리자 대시보드

운영자 대시보드랑 차이가 잘 안보일까봐 약간의 시각적 구분감을 주었다.

![https://github.com/user-attachments/assets/b4f166f9-5ed9-497c-ae94-1c15c2c6e0b9](https://velog.velcdn.com/images/qriosity/post/b27741ad-9c7a-4dca-b7c2-eb2484f28699/image.jpg)

---

<br/>

#### 📌 파일이 있었는데요, 없었습니다.
강의실 컴에서 프로젝트를 pull 했는데 일부 파일이 없더라.

읭? 내가 푸시를 안했었나?? 이럴 리 없는데?? 하고 git graph를 보니

분명히 푸시되어있고 다 pull 되어있어서 파일이 없을리가 만무했음.

그러하다. 또 똥텔리제이 캐시 문제였던 것이다.

invalidate하고 재실행하니 언제 그랬냐는 듯 파일이 생겨있더라...

<br/>

#### 📌 "connection refused"
Postman으로는 잘만 작동하는 Elasticsearch가 왜 스프링에서만 connection refused 뜨는지 모르겠어서

[공식문서](https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/clients.html)를 확인하니 `@Configuration` 빼먹었더라.

이후 연결은 됐는데 host는 앞에 http:// 빼야 했음.

<br/>

#### 📌 Elasticsearch와 LocalDate
```
10:14:20.659[restartedMain] WARN  o.s.d.e.c.c.MappingElasticsearchConverter - Type LocalDate of property StoreMetaDocument.storeStart is a TemporalAccessor class but has neither a @Field annotation defining the date type nor a registered converter for reading! It cannot be mapped from a complex object in Elasticsearch!
10:14:20.724[restartedMain] ERROR o.s.boot.SpringApplication - Application run failed
org.springframework.core.convert.ConverterNotFoundException: No converter found capable of converting from type [java.lang.Long] to type [java.time.LocalDate]
```

Date 포맷들이 전반적으로 까다로운듯.. 인식 안되면 Long으로 들어가는 것 같다.

따라서 기존에 잘못 인덱싱된건 curl로 수동 삭제했다.

<br/>

#### 📌 Elasticsearch settings 설정

<br/>

#### 📌 Lazy fetch와 @Transactional

</details>

### 📆 25-02-25

기획 수정

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/20](https://github.com/ssginc-be/DOKI/issues/20)

<br/>

#### 📌 프로젝트 상황
오늘 하루종일 UI 구현하고 로그인 플로우를 연결했다. `MANAGER` 권한은 다시 기획에 포함시켰고..

리액트처럼 코드 수정시 즉시 반영 안되고 서버가 내려갔다 올라갔다 하는게 좀 불편한데

~~devtools에 Live Reload 기능이 있다고 하니 나중에 이거 좀 알아봐야 할 듯?~~

*(-> 이미 쓰고 있었는데 구려서 몰랐음. 리액트 급 핫리로드는 안되는듯...😂)*

어제 구상했던, 실시간성을 나타낼 2개의 기능은 컨펌받았다. 아마 내일 팝업스토어 상세페이지를 대충 html만 올려놓고

예약 페이지 바로 구현하면서 같이 API 개발에 들어갈 것 같다.

</details>

### 📆 25-02-26

ERD

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/21](https://github.com/ssginc-be/DOKI/issues/21)

<br/>

#### 📌 프로젝트 상황

ERD 3차 수정 실화임?

*참고로 연관관계 빠진건 나중에 넣을 생각이다. 지금 기능 마감이 더 급함;*

![https://github.com/user-attachments/assets/5fa7e1c1-a119-4b8c-82fd-1be095ca7676](https://velog.velcdn.com/images/qriosity/post/0d83a345-1ff4-4d6c-9a9a-ce0218d38cae/image.png)

<br/>

일단 엔티티를 다시 일괄 구현해서 `ddl-auto` 돌린 다음에

예약 UI 붙인 후 예약 등록 v1 API 구현해서 연결하고

mock 데이터 일괄 작성해서 운영자 / 관리자 대시보드에 띄워줘야 함.

그리고 이슈나 브랜치 좀 덜 나누더라도 작업 단위를 크게 잡아야 할 것 같다.

현재 프로젝트 관리 요소 하나하나가 기능 구현에 방해가 되고 있다 ㅜ

</details>

### 📆 25-02-27

cmd 경로 길이 문제, 아키텍쳐 타협, Kafka 설정

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/23](https://github.com/ssginc-be/DOKI/issues/23)

<br/>

#### 📌 프로젝트 상황

모든게 잘되고 있엉!

*~~구라임~~*

<br />

#### 📌 cmd: "명령줄이 길어요"

![https://github.com/user-attachments/assets/0da908fe-8467-4b9b-8969-ed8f2a319b6b](https://velog.velcdn.com/images/qriosity/post/f1b36195-ce34-4d3a-b102-8547164510d3/image.png)

[Kafka 파일 경로를 `C:`에 두어야 한다.](https://velog.io/@sodliersung/kafka-window-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%EC%8B%A4%ED%96%89-%EC%97%90%EB%9F%AC) 그저 놀라운.......;

<br />

#### 📌 아키텍쳐, 이상과 현실

![https://github.com/user-attachments/assets/56597521-0d08-4a77-8de3-10aa66d0fe0c](https://velog.velcdn.com/images/qriosity/post/420b1364-0d02-4a45-88b2-469b5bddcde3/image.jpg)

그리하여, 카프카는 GCP에 올리고 개발하기로 결정했다.

프레젠테이션 때 100% 질문 들어올 것 같아서 방어전(?)을 위해 그려놨다.

<br />

#### 📌 Kafka, Zookeeper 컨테이너 설치
```yaml title=compose.yml
services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka:2.13-2.8.1
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```
...많이 쓰이는 것과 별개로, 마지막으로 레지스트리에 등록된 컨테이너가 상당히 구버전이었다. 지금 latest 카프카 버전이 `2.13-3.9.0`인데 ㅜ

그래도 바쁘니까 일단 쓰자.

<br />

#### 📌 Docker 소켓 권한 설정하기
```bash
$ docker compose -f compose.kafka.yml up -d
unable to get image 'wurstmeister/kafka:2.13-2.8.1': permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.47/images/wurstmeister/kafka:2.13-2.8.1/json": dial unix /var/run/docker.sock: connect: permission denied
```

카프카 설치하다가 터진 문제인데, `/var/run/docker.sock` 파일의 권한을 666으로 변경하면 된다고 한다.

```bash
$ sudo chmod 666 /var/run/docker.sock
```

<br />

#### 📌 compose down시 볼륨 제거하기
```bash
$ docker compose -f compose.kafka.yml down -v
```

나는 왜 그동안 `docker rm -v $(docker ps -qa)`로 삽질을 하였는가

*그래도 명령어 외우는데 도움됨*<br />
~~*아니 그걸 왜 외워요?*~~

<br />

#### 📌 Kafka 토픽 관련 명령어

#### Kafka 컨테이너 쉘 접속
```bash
$ docker container exec -it kafka bash
```

#### Kafka 토픽 리스트 확인
```bash
$ kafka-topics.sh --list --bootstrap-server localhost:9092
```

#### Kafka 토픽 생성
```bash
$ kafka-topics.sh --create --bootstrap-server localhost:9092 --topic doki-reserve
```

#### Kafka 토픽 삭제
```bash
$ kafka-topics.sh --delete --bootstrap-server localhost:9092 --topic doki-reserve
```

<br />

#### 📌 reserve-service와 Kafka 연결

제일 먼저 GCP 방화벽에서 TCP 9092 인바운드를 허용해주었다.

그리고 [요 레퍼](https://dkswnkk.tistory.com/705)를 참고해서 테스트 코드를 작성했는데..

```
20:59:02.335[org.springframework.kafka.KafkaListenerEndpointContainer#0-0-C-1] WARN  o.apache.kafka.clients.NetworkClient - [Consumer clientId=consumer-doki-1, groupId=doki] Connection to node 1001 (/127.0.0.1:9092) could not be established. Node may not be available.
```

뭐 호스트 설정이 잘못된 것 같은데,

생각해보니까 compose 스크립트에서 `KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1`이 생각남.

아 설마 이거 GCP 인스턴스 엔드포인트로 세팅해야되는건가? 하고 다시 설정해서 compose up 해줬더니

```
21:09:06.733[kafka-producer-network-thread | reserve-service-producer-1] WARN  o.apache.kafka.clients.NetworkClient - [Producer clientId=reserve-service-producer-1] Error while fetching metadata with correlation id 1 : {doki-reserve=LEADER_NOT_AVAILABLE}
```

?

SSH 접속해서 카프카 컨테이너를 확인해보니 `doki-reserve` 토픽은 생성되어있었다. 그럼 연결은 된건데? 뭐지?

*-작동은 잘 되었다고 한다-*

</details>

### 📆 25-02-28

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/28](https://github.com/ssginc-be/DOKI/issues/28)

</details>