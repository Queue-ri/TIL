---
title: 'Git hard reset과 Git clean으로 날라간 파일 복구하기'
eng_title: "Restore Files After Git Hard Reset & Git clean"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_position: 4
created_date: 2026-06-18
---

# Git hard reset과 Git clean으로 날라간 파일 복구하기

:::danger 복구 불가능한 경우

commit 이력 없고, add 이력 없고, unstaged 상태의 신규 생성된 파일은 untracked 상태이며<br />
이러한 파일은 git이 내부적으로 저장을 한 적이 없기에 `git fsck --lost-found`로도 캐시를 찾을 수 없으며, 복구 가능성이 zero에 가깝다.

🤷‍♀️ **그럼 어캐 복구하는데?**: IDE, 에디터의 캐시나 히스토리를 찾아봐야 함

:::

## 문제 상황

### 잘못 들어간 커밋

예전 싸피컴에서 몇 번 TIL 작성했을 때, global config가 들어가면서 다른 동기의 git 정보로 TIL이 커밋된 것을 뒤늦게 확인했다. 매번 확인을 하는데 당시에 정신이 없어서 그랬던 것 같다.

보통 이런 경우에 필자는 interactive rebase로 하나하나 author이랑 date 바꾸고 마지막에 `--committer-date-is-author-date`로 commit date 까지 싹 맞춰서 새 커밋을 만든 뒤 force push 하는 식으로 해결해왔다.

<br />

### 제미나이로 rebase 돌림

그런데 이게 한두 개가 아니고 꽤 히스토리가 내려가있는데다 당장은 프로젝트 작업을 해야 하기에 많은 시간을 쓰고 싶지 않은 것이다... 그래서 제미나이 CLI를 돌렸다.

![](https://velog.velcdn.com/images/qriosity/post/dd1d428f-488b-480d-9173-b6fa0af06a1e/image.png)

그리고 다른 작업 하려 auto accept를 걸어놓고 갔다오니

![](https://velog.velcdn.com/images/qriosity/post/57a9f485-c2f5-4b5f-aab5-c10820c4fe82/image.png)

ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ<br />
아니 2주간 쓰고 있는 내 개발노트가 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

<img src="https://velog.velcdn.com/images/qriosity/post/4f2a4958-3ceb-4859-af26-2e8c9a2e406b/image.png" width="120" height="auto" />

<br /><br />

## 어떻게 복구했나요

### 1. VSCode 탭 상에 남아있음

<img src="https://velog.velcdn.com/images/qriosity/post/12d7e920-d061-456c-886e-9fd61029a5e1/image.png" width="600" height="auto" />

개발 노트는 다행히도 한창 수정중이라 탭에 둘 다 띄워진 상태였다. 이 경우 삭제 마킹만 뜨지 내용은 그대로라서, 가장 간단히 복구할 수 있다.

하지만 싸피 강의 노트는 띄워두지 않은 상태라서, 하단의 2번 방법을 사용해야 했다.

### 2. VSCode Timeline

![](https://velog.velcdn.com/images/qriosity/post/1e7d2260-8a73-4440-bc8c-2221a166e667/image.png)

해당 파일 우클릭 - `Open Timeline`에서 파일 히스토리를 확인하고 restore 할 수 있다.<br />
대부분 untracked 파일은 신규 생성 파일이라 clean 당하면 사라지는데, 이 경우 동일 파일명으로 다시 생성해서 우클릭하면 타임라인이 뜬다 (그래서 파일명은 어떻게든 로그 뒤져서 알아내야 됨)

<br />

## 예방 및 Git 원리

복구는 되었지만 앞으로 하드리셋+클린 테러에 대비해서 몇가지 git 원리와 팁을 소개한다.

### untracked 까지 stash 하기

`git stash`는 새로 생성된 untracked 파일을 stash 하지 않는다.<br />
따라서 `git stash -u` 옵션으로 untracked 파일까지 stash 할 것을 권장한다.

제미나이는 그냥 `git stash` 하더라... 이런 부분 학습이 약한듯

![](https://velog.velcdn.com/images/qriosity/post/fe17ae62-314f-4f97-9094-8ce5d7de3496/image.png)

<br />

### 어떻게든 git에 흔적을 남기자

#### 1. `git add`를 하는 순간 일어나는 일

새로 만든 파일(untracked)을 `git add` 하는 순간, Git은 내부적으로 그 파일의 데이터를 압축해서 `.git/objects/`에 Blob 으로 저장한다.

#### 2. `restore` 후 hard reset이나 clean 하면?

그 상태에서 `git restore --staged`로 내려버리면, Git은 아 다음 커밋에 안쓰려나보네? 하고 Blob은 유지한 채 인덱스 연결만 끊어버린다. 이는 hard reset 과 clean에도 남아있다.

👉️ 이것이 **Dangling Blob**이고, `git fsck --lost-found` 명령어로 조회할 수 있다.

<br />

## 직접 실험하기

:::warning

따라하다 파일 날라가도 책임 안집니다. 명령어를 알고 실행하시기 바랍니다.

:::

### (선택) git GC 실행

reflog 까지는 건드리지 않기 때문에 (건드리면 stash 한거 날라감) 일부 dangling commit 등이 남아있을 순 있으나, 그래도 보기 좀 용이하게 쓸데없는 캐시를 우선 삭제하도록 한다.

```bash
qriosity@server:~/Desktop/TIL$ git gc --prune=now
```

```bash
Enumerating objects: 8351, done.
Counting objects: 100% (8351/8351), done.
Delta compression using up to 16 threads
Compressing objects: 100% (2688/2688), done.
Writing objects: 100% (8351/8351), done.
Total 8351 (delta 4822), reused 8343 (delta 4821), pack-reused 0
```

<br />

### 파일 생성 및 add

신규 파일을 생성해서 stage에 올린다. **이 타이밍에 캐시가 생성된다.**

```bash
qriosity@server:~/Desktop/TIL$ echo "안녕하세용 저를 찾으셧나여" > add-test.md
qriosity@server:~/Desktop/TIL$ git add add-test.md
qriosity@server:~/Desktop/TIL$ git status
```

```bash
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   add-test.md
```

<br />

### 파일 restore

다시 stage에서 파일을 내린다.

```bash
qriosity@server:~/Desktop/TIL$ git restore --staged add-test.md
qriosity@server:~/Desktop/TIL$ git status
```

```bash
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        add-test.md

nothing added to commit but untracked files present (use "git add" to track)
```

<br />

### ⚠️ 핵폭탄 투하

`git reset --hard` (tracked 파일 삭제) 와 `git clean -fd` (untracked 파일 삭제)의 무친 조합으로 싸그리 다 날려버린다.

<p style={{ color: 'red' }}>**사실 `git clean -fd` 이런 명령어 함부로 쓰면 안되는데 에이전트들이 자주 던진다.**</p>

```bash
qriosity@server:~/Desktop/TIL$ git reset --hard && git clean -fd
HEAD is now at de622e8 ci(docs): Auto commit 2026-06-18.md
Removing add-test.md
```

로그에서 확인할 수 있듯, 우리의 `add-test.md` 씨가 사망했다.

<br />

### Blob grep 하기

기대한 것은 그래도 `add-test.md`를 한번 stage에 올렸다 내린 이력이 있기 때문에, git에서 캐시 생성해놨겠거니 하는 것이다.<br />
정말 캐시가 남아있는지 확인해보자. 타입이 `blob` 이면서, 내용에 `안녕하세용`이 들어있는 캐시를 서치한다.

```bash
qriosity@server:~/Desktop/TIL$ git fsck --lost-found | grep "blob" | awk '{print $3}' | xargs -I {} sh -c 'if git cat-file -p {} | grep -q "안녕하세용"; then echo "\n\033[1;32m찾은 hash:\033[0m {}"; echo "---------------------------------------"; git cat-file -p {}; echo "---------------------------------------"; fi'
```

```bash
Checking object directories: 100% (256/256), done.
Checking objects: 100% (8351/8351), done.
Verifying commits in commit graph: 100% (1438/1438), done.

찾은 hash: b7c473935decb994f1595935532d4412c7de47a8
---------------------------------------
안녕하세용 저를 찾으셧나여
---------------------------------------
```

<br />

### Blob 복구하기

hash를 알아냈다면 `cat-file`로 파일 저장해준다.

```bash
git cat-file -p b7c473935decb994f1595935532d4412c7de47a8 > add-test.md
```

<br />

## 결론

### 당신은 단 한번이라도 git에게 파일을 넘겨줘보았는가

이 글을 통해 알 수 있는 사실은, 진짜 add 만 해도 복구 확률이 많이 높아진다는 것이다.<br />
특히 VSCode의 경우 Changes 옆에 + 버튼만 딸깍해도 다 add 처리되어 캐시가 생성되니, 에이전트로 git 작업하기 직전이나 영 찝찝할 때 한번씩 눌러주도록 하자.

<br />

---

그럼 이 글이 순간의 대참사로 식은 땀을 쏟고있을 누군가에게 기적이 되길 바라며, 글을 마친다. 🙃