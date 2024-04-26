---
title: 'Bash에서 커밋메시지 backticks 넣기'
eng_title: "How to put backticks in commit messages with bash"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: 'Bash에서 커밋메시지 backticks 넣기'
sidebar_position: 1
created_date: 2024-04-26
---

# Bash에서 커밋메시지 backticks 넣기

## 문제 상황

다음의 상황에서, 커밋 `009decc`의 커밋메시지를 수정하고 싶다.

`/pl/java`를 backticks로 감싸서 GitHub 상의 markdown syntax를 적용하고 싶기 때문이다.

![문제 상황](https://github.com/user-attachments/assets/885d43b5-f0da-4b99-8941-444cb512d024)

<br />

## 해결 방안

### 1️⃣ git reset

다음과 같이 reset한 후 다시 커밋할 수 있다. <br />
이 방식을 채택할 경우, vscode GUI 상에서 편하게 backticks를 커밋메시지에 넣을 수 있다.

```bash
$ git reset --soft HEAD~2
```

하지만 해당 방식을 사용할 경우 재커밋 과정에서 기존의 author date, committer date가 날라간다.

물론 date도 수정 가능하지만 귀찮다. 그래서 2번의 대안을 선택했다.

<br />

### 2️⃣ interactive rebase

다음의 명령어로 interactive rebase 모드에 들어가 `009decc`를 edit으로 수정하고 저장한다.

```bash
$ git rebase -i HEAD~2
```

그 다음 amend 옵션으로 커밋메시지를 수정하면 된다. <br />
다만, bash 상에서 커밋메시지에 backticks를 넣으려면 메시지 리터럴을 `"`로 감싸야 한다. <br />
`'`로 감싸면 에러가 발생한다.

![amend 하기](https://github.com/user-attachments/assets/61e5f8d9-4095-43e5-b774-1a00d73381fd)

<br />

## 결과

다음과 같이 수정되었다면 remote에 force push 하면 된다.

![결과](https://github.com/user-attachments/assets/696b3868-3167-4339-88c1-dc1cabbb1250)