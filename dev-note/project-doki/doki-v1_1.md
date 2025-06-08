---
title: 'DOKI v1 (0304 ~ 0313)'
eng_title: 'DOKI v1 (0304 ~ 0313)'
image: https://til.qriositylog.com/img/m_banner_background.jpg
sidebar_position: 2
sidebar_label: 'DOKI v1 (0304 ~ 0313)'
created_date: 2025-06-08
---

:::note 내용 못알아먹겠음 주의

Dev note는 정식 회고록이 아닌 draft 입니다.<br />

:::

### 📆 25-03-04

2차 멘토링, 아키텍쳐 구성도 수정

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/34](https://github.com/ssginc-be/DOKI/issues/34)

<br/>

#### 📌 프로젝트 상황

금일 2차 멘토링 받음. 매우 유익했지만

불타는 제 프로젝트는 어쩔 수가 없네여

<br/>

#### ✨ 아키텍쳐 구성도 수정

멘토분께 보여드리기 위해 구성도를 변경사항에 맞추어 수정했다.

공간이 없어서 GCP 아이콘이 대충 붙어있는데,

FileBeat + ELK + Kafka는 인스턴스 자원이 중요해서 다 GCP에 올라가있음.

![아키텍쳐_구성도](https://velog.velcdn.com/images/qriosity/post/72295057-2c1d-4edd-bef5-6fbd9b269a1b/image.jpg)

</details>

### 📆 25-03-05

UI 디자인 완료, ERD 4차 수정, SSE 버그 패치, SSE UI↔API 연결

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/36](https://github.com/ssginc-be/DOKI/issues/36)

<br/>

#### 📌 프로젝트 상황

#### ✨ UI Design
오전 시간에 나머지 UI 페이지 디자인을 모두 마쳤다. 작고 소중함.

검색 결과 페이지나 카테고리/지점 필터 후 페이지는 뻔하니까 디자인 안함.

자잘한거 합치면 10페이지 쯤 하는데, 개인 1달에 요정도 볼륨이면 괜찮지? 않을까?

이 이상의 페이지를 추가하느니 그냥 당위성 있는 request UUID나 구현할란다.

<br/>

#### ✨ ER Diagram
ERD는 4차로 수정했다. 아니 언제까지 수정할거에요??

![ERD_4차_수정후](https://velog.velcdn.com/images/qriosity/post/59997928-1529-4562-90a9-c53d2357dedd/image.png)

<br/>

#### 🐞 Bug Patch
SSE 알림 수신 안되는거 패치했고, UI까지 연결했다. 처음 구현해보는건데 생각보다는 잘 풀렸다.

오히려 UI가 시간의 대부분을 잡아먹고 있다. 진짜 쪼끄만거 붙이는데도 시간이 많이 걸림.

하지만 장점이라면 레이아웃/스타일링 다 수작업이라서, 진짜 무서운 CSS 스파게티 코드는 볼 일이 없다는 것이다.

</details>

### 📆 25-03-06

토스트 UI, table CSS 마개조

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/38](https://github.com/ssginc-be/DOKI/issues/38)

<br/>

#### 📌 프로젝트 상황

운영자 -> 이용자 측의 SSE 토스트 UI가 얼추 끝났다.

<img src="https://velog.velcdn.com/images/qriosity/post/9b86b9cd-3be6-4f65-9b9e-45c9c278ed2b/image.png" alt="noti_toast_ui" width="600px" height="auto" />

<br /><br />

그런데 문제가 생겼다.

생긴게 영 마음에 들지 않는다 🤨

애니메이션은 맛있지만 도메인 생각하면 너무 통통 튀는것 같음.


<br />

#### 📌 스크립트 로딩 순서 고려하기

```java title=StoreController.java
// 비회원이거나 로그인한 이용자 (null 체크가 맨 위에 있어야 함)
if (role == null || role.equals("MEMBER")) {
    ...
    model.addAttribute("memberCode", code);

    return "index"; // 팝업스토어 목록 페이지로 이동
}
```

![thymeleaf_diff](https://velog.velcdn.com/images/qriosity/post/63ad84fb-c474-4f89-beea-2127ce1ce576/image.png)

index.html은 layout-member.html을 레이아웃으로 사용하고 있는데,

layout-member.js에서 접근하는 `memberCode`가 undefined<span style={{fontSize: '4px'}}><s><i>운데피네</i></s></span>로 찍히지 않으려면, 후자와 같이 스크립트 로딩 순서를 조정해야 한다.

<br />

#### 📌 의외로 근본 있는 `replaceChild`

놀랍게도 [레퍼런스](https://stackoverflow.com/questions/21627276/replacing-nodes-error-the-node-to-be-replaced-is-not-a-child-of-this-node)에 의거하면, `replaceChild`는 `(dest, src)` 형식의 근본을 따르고 있었다.

다시 말해 newNode가 2번째 인자로 들어간다는 뜻이다.

```js {19-21}
// 토스트 뷰 컨트롤
function showAlarmToast(message, dateTime) {
    // parent div (toast box)
    const notiToastBoxDiv = document.getElementById('noti-toast-box');

    // old div
    const notiToastDataDiv = document.getElementById('noti-toast-data');
    const notiToastDatetimeDiv = document.getElementById('noti-toast-datetime');

    // new div
    const newDataDiv = document.createElement("div");
    newDataDiv.classList.add('noti-toast-data');
    newDataDiv.appendChild(document.createTextNode(message));

    const newDatetimeDiv = document.createElement("div");
    newDatetimeDiv.classList.add('noti-toast-datetime');
    newDatetimeDiv.appendChild(document.createTextNode(dateTime));

    // div 교체
    notiToastBoxDiv.replaceChild(notiToastDataDiv, newDataDiv); // error
    notiToastBoxDiv.replaceChild(notiToastDatetimeDiv, newDatetimeDiv); // error

    // 토스트 박스 보여주기
    notiToastBoxDiv.classList.add("active");

    // 5초 후 토스트 박스 숨기기
    setTimeout(() =>{
        notiToastBoxDiv.classList.remove("active");
    }, 5000)
}
```

![client_console](https://velog.velcdn.com/images/qriosity/post/5735c87a-287b-4f05-bc05-23ee8aa8f7c9/image.png)

<br />

근데 결국엔 `replaceWith`라는 더 모던한 방식이 있어서 이를 채택했다.

그리고 새 노드에 id 지정하는거 까먹어서 (-> 최초 replace 이후 `getElementById` 호출시 터짐)

해당 코드도 추가했다.

```js {22-24}
// 토스트 뷰 컨트롤
function showAlarmToast(message, dateTime) {
    console.log('show toast'); // logging
    // parent div (toast box)
    const notiToastBoxDiv = document.getElementById('noti-toast-box');

    // old div
    const notiToastDataDiv = document.getElementById('noti-toast-data');
    const notiToastDatetimeDiv = document.getElementById('noti-toast-datetime');

    // new div
    const newDataDiv = document.createElement("div");
    newDataDiv.classList.add('noti-toast-data');
    newDataDiv.id = 'noti-toast-data';
    newDataDiv.appendChild(document.createTextNode(message));

    const newDatetimeDiv = document.createElement("div");
    newDatetimeDiv.classList.add('noti-toast-datetime');
    newDatetimeDiv.id = 'noti-toast-datetime';
    newDatetimeDiv.appendChild(document.createTextNode(dateTime));

    // div 교체
    notiToastDataDiv.replaceWith(newDataDiv);
    notiToastDatetimeDiv.replaceWith(newDatetimeDiv);

    // 토스트 박스 보여주기
    notiToastBoxDiv.classList.add("active");

    // 5초 후 토스트 박스 숨기기
    setTimeout(() =>{
        console.log('hide toast'); // logging
        notiToastBoxDiv.classList.remove("active");
    }, 5000)
}
```

![client_console](https://velog.velcdn.com/images/qriosity/post/fdd58fa9-6daa-43b2-917a-60091452be8b/image.png)

<br />

#### 📌 타임리프 동적 class 추가

[해당 방법](https://stackoverflow.com/questions/61877514/how-to-add-dynamically-a-class-with-thymeleaf)으로 가능하다고 한다.

<br />

#### 📌 눈물나는 `th` border-radius 적용하기

table에 지정한 `border-collapse: collapse;` 속성과 radius 속성이 충돌한다더라.

box-shadow와 선택자 노가다로 겨우 해결했는데

겨우 해결한게 스타일링이어서 현타가 왔다. CSS 표준이 많이 발전하길 바람...

```css {3-5} title="❌ 응 안먹히는 코드"
table {
    width: 100%;
    border-collapse: collapse;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin-bottom: 48px;
}
```

```css title="✔️ 먹히는 코드"
th {
    font-family: "Pretendard", sans-serif;
    color: #6C6C71;
    background-color: #FCFCFC;
    font-weight: 600;
    font-size: 13px;
    padding: 13px 16px;
    text-align: left;
}
th:first-child {
    border-top-left-radius: 6px;
    box-shadow: 0 0 0 1px #E2E2E9;
}
th:last-child {
    border-top-right-radius: 6px;
    box-shadow: 0 0 0 1px #E2E2E9;
}
th:not(:last-child) {
    border-right: 1px solid #E2E2E9;
}
th:not(:first-child):not(:last-child) {
    box-shadow: 0 -1px 0 #E2E2E9, 0 1px 0 #E2E2E9;
}
```

![table_result](https://velog.velcdn.com/images/qriosity/post/95b178eb-a841-4979-be22-4c13634f42f5/image.png)

<img src="https://velog.velcdn.com/images/qriosity/post/f319f2ec-ceb6-47c1-8baa-da287588b83f/image.png" alt="확대샷" width="400px" height="auto" />

</details>

### 📆 25-03-07

유사 배열의 forEach 미지원 문제

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/43](https://github.com/ssginc-be/DOKI/issues/43)

<br/>

#### 📌 프로젝트 상황

나는 대체 백엔드 개발자인가 퍼블리셔인가

<br />

#### 📌 forEach를 못쓰는 유사 배열

`getElementsByClassName`으로 가져온 객체에 왜 forEach가 안먹히나 했더니,

반환 타입이 `HTMLCollection`이었다. 슬프게도 이러한 [짭 배열은 forEach가 없다고 한다.](https://enchiridion.tistory.com/64)

해결 방법은 `Array.from()`을 이용해서 배열로 변환하면 된다.

```js title=admin_store_registration.js {6}
function setMethod(event) {
    const selectedButton = event;
    console.log(event);
    // 버튼 스타일 변경
    const methodButtons = document.getElementsByClassName('reserve-method-button');
    methodButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    selectedButton.classList.add('active');

    ...
}
```

![client_console](https://velog.velcdn.com/images/qriosity/post/74ed74de-a697-4ffa-a70b-b026bf11aea7/image.png)

</details>

### 📆 25-03-09

ERD 변경 사이드이펙트, @DynamicInsert, 팝업스토어 등록 API

<details>
<summary>내용 보기</summary>

#### 📌 Daily Report
> [https://github.com/ssginc-be/DOKI/issues/52](https://github.com/ssginc-be/DOKI/issues/52)

<br/>

#### 📌 프로젝트 상황

여전히 구현할 것이 산더미이고, 코드 리뷰가 들어와서 검토 후 리팩토링해야 하고, Kibana 인코딩 문제도 해결 못했다.

![task_목록](https://velog.velcdn.com/images/qriosity/post/62c4af0f-2058-463e-b869-7d1ffe0f5752/image.png)

ㅋㅋㅋㅋㅋㅋㅋㅋㅋ

놀랍게도 오늘 하고싶은 만큼 적어놓은 것이고, 실제로는 할 일 더 많음.

API Gateway와 https 설정을 막판에 마무리하면서 하려 했는데... 목요일부터 성능 테스트 보고서 작성하려면 코드 리뷰 검토까지만 하고 리팩토링을 후순위로 밀어야 할 듯 싶다.🙄

<br />

#### 📌 JS 비동기 처리 스코프

그동안 왜 `async`-`await` 붙여도 될때가 있고 안될때가 있는지 의문인 적이 몇 번 있었는데,

[이 레퍼런스](https://growing-jiwoo.tistory.com/74)에서 중요한 명언을 하나 남겨놓은 것 같다.

> "자바스크립트에서 async/await 사용 시 동일한 스코프에서 await하지 않으면 앞서 실행한 async를 기다려주지 않는다."

그러하다. 스코프...

왜 아무도 스코프에 대해서 얘기를 안했던거지? 이 세 글자로 이해가 바로 되는데.

<br />

#### 📌 ERD 4차 수정에 따른 사이드 이펙트

사건의 발단은 이러했다.

1. 팝업스토어 상세 페이지에 운영 시작 시간과 종료 시간이 들어갈 필요가 있음을 느낌
2. 어 근데 팝업스토어 테이블에 관련 칼럼이 없네? 추가해야지
3. 이미 운영 시작일을 `storeStart`, 종료일을 `storeEnd` 네이밍으로 두고 있음
4. 운영 시간을 추가하기 위해 운영 일자 칼럼명에 `Date`를 붙이고, 운영 시간은 뒤에 `Time`을 붙이기로 함
5. `Store` 엔티티 수정

![it_was_a_complete_disaster](https://velog.velcdn.com/images/qriosity/post/4ea59643-ef82-47b9-b510-54a38313555c/image.png)

<sup><b>그리고 사이드 이펙트를 크게 맞았다. ^0^</b></sup>

`data.sql` 파일 얘가 제일 큰 문제인데, 이렇게 칼럼 변경 등으로 테이블 스펙이 바뀌어서 파일 내의 INSERT가 제대로 동작하지 않아도, 아무런 로그를 남기지 않는다.

그래서 뚜까 맞으면서 알게 되는 부분인데 이미 전에 맞아봐서, 다행히 금방 눈치채긴 했다.

mock data 쿼리가 안날라가니까 ES 인덱싱이 안돌아가고 -> 인덱싱이 안되니까 메인화면에서 목록 조회가 안되더라.

INSERT 쿼리를 바뀐 테이블 스펙에 맞춰 수정하니 다시 인덱싱은 돌아가는데, 당연히 ES Document 스펙도 같이 수정했어야 했다. 이번에 추가된 칼럼이 인덱싱 대상은 아니었지만, 인덱싱하는 운영 일자 칼럼명이 바뀌었기 때문이다.

그렇게 수정해서 서버를 실행했는데, 타임리프가 터지더라. 최초 렌더링만 템플릿 엔진으로 하고 이후의 렌더링 변화는 axios 비동기 방식으로 처리하려 했는데 이 방식이... 별로인가?

아무튼 칼럼명 변경으로 flatpickr 설정까지 터져서 view단까지 싹 고쳐줘야 했음ㅜ

<br />

#### 📌 `@DynamicInsert`를 드디어 이해함

```java title=ReservationEntry.java
@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEntry {
    // ...

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer reservedCount; // 예약자 수

    // ...
}
```

```java title=StoreService.java
public class StoreService {
    // ... 

    // 5. ReservationEntry 생성
    List<ReservationEntry> reList = new ArrayList<>();
    LocalDate endDate = dto.getStoreEndDate();
    LocalTime endTime = dto.getStoreEndTime();

    int reserveGap = dto.getReserveGap();
    int capacity = dto.getCapacity();
    for (LocalDate curDate = dto.getStoreStartDate(); !curDate.isAfter(endDate); curDate = curDate.plusDays(1)) {
        for (LocalTime curTime = dto.getStoreStartTime(); curTime.isBefore(endTime); curTime = curTime.plusMinutes(reserveGap)) {
            reList.add(ReservationEntry.builder()
                    .store(store)
                    .entryDate(curDate)
                    .entryTime(curTime)
                    .capacity(capacity)
                    .entryStatus(ReservationEntry.EntryStatus.OPEN)
                    .build()
            );
        }
    }
    reRepo.saveAll(reList);

    // ...
}
```

```log
20:14:26.751[http-nio-9093-exec-1] DEBUG o.s.web.servlet.DispatcherServlet - Failed to complete request: org.springframework.dao.DataIntegrityViolationException: not-null property references a null or transient value: com.ssginc.commonservice.reserve.model.ReservationEntry.reservedCount
```

왜 `@ColumnDefault("0")`가 안먹히고 에러가 뜨는지 의문이었는데, [이 글](https://eocoding.tistory.com/71)을 참고해보면 `@DynamicInsert`를 엔티티에 명시하지 않았기에

INSERT 쿼리에서 `reserveCount`를 null로 넣으려 한 것 같다.

하지만 프로젝트의 경우 MySQL에서 디폴트 값 0을 지정했기 때문에 `@DynamicInsert`를 추가해서 아예 INSERT 쿼리에서 `reserveCount` 칼럼이 제외되어야 하는 것이 맞다.

...그런데 `@DynamicInsert` 넣어도 똑같이 오류 발생해서 일단 땜빵 처리해놓고 나중에 다시 디버깅해봐야 할 것 같다.

<br />

#### 📌 팝업스토어 등록 API 구현 완료

`Store` `StoreImage` `StoreCategory` `ReservationEntry`

얘네 처리 순서가 처음에 모호했다.

양방향 매핑관계때문에 Store를 저장하려면 StoreImage와 StoreCategory도 가지고 있어야 하는데

StoreImage와 StoreCategory 역시 Store를 가지고 있고...

누구를 먼저, 어떻게 생성해야 하는가? 라는 의문이 들었다.

그런데 코드 작성하다보니, Elasticsearch에서 Store를 인덱싱해야하고

인덱싱할때 StoreImage도 순회해서 MAIN_THUMBNAIL을 가져가고

StoreCategory도 CategoryNoDescDto로 재가공해서 가져가니까,

인덱싱하기 전에는 얘네가 메모리 상에 할당이 되어있어야 하는 것임.

정리하자면 이렇다.

---
1. StoreImage, StoreCategory만 할당 안된 Store 생성 -> 메모리 상에 존재
2. EntityManager로 Store를 persist -> INSERT 쿼리 날라감 (이 시점부터 auto increment된 id 값 접근 가능)
3. Store의 id 값으로 StoreImage와 StoreCategory 생성 -> 메모리 상에 존재
4. Store에 StoreImage, StoreCategory set하기 -> 메모리 상의 객체에 할당
5. StoreImage 저장 (당연히 StoreCategory는 저장 안함.) -> INSERT 쿼리 날라감
6. ReservationEntry 생성 및 저장 -> INSERT 쿼리 날라감
7. Elasticsearch 인덱싱 -> 메모리 상의 Store 객체로 처리함
8. `@Transactional`에 의해 COMMIT
---

결국엔, 메모리 상의 객체까지만 필요한 부분이 어느 지점인지,

그리고 DB에 쿼리가 날라가야 하는 지점이 어느 지점인지를 명확히 알고 있어야 했다.

Store는 대부분이 `@OneToMany`로 자식이 매핑된 부모 엔티티이고, 자식 정보가 DB에 INSERT 날릴 때는 딱히 필요 없으니까, Store를 persist해서 INSERT 쿼리를 먼저 날리는 것이 옳은 순서였던 것이다.

JPA에서 부모-자식 엔티티 한번에 처리하는 방법이 있다고는 하는데 이는 나중에 리팩토링해보기로 하고

무식하게 생각하자면 상단의 저 순서가 직관적이다.

<br />

#### ✨ 구현 결과

고생했다. 근데 resizing 옵션을 잘못 설정한듯 ㅋㅋㅋㅋ

버그 리포트... 추가요...

![store_image_table](https://velog.velcdn.com/images/qriosity/post/b224f828-2da5-4e7a-b312-b9d6e5d6755f/image.png)

![store_reservation_page](https://velog.velcdn.com/images/qriosity/post/686a68c6-ec3a-4bc6-9c58-c97ab31a7cee/image.png)

</details>