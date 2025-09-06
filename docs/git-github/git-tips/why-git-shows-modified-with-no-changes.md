---
title: '수정된 내용이 없는데 Git이 modified로 인식한다면'
eng_title: "Why Git shows modified with no changes"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '수정된 내용이 없는데 Git이 modified로 인식한다면'
sidebar_position: 3
created_date: 2025-09-06
---

# 수정된 내용이 없는데 Git이 modified로 인식한다면

## 🤷 뭐가 바뀐거지?

간혹 git을 사용하다가 status를 확인해보면, 추적 변경사항은 있는데 정작 GUI 상에서 diff를 보면 똑같은 경우가 있다.

```sh
qriosity@server:~/Desktop/DOKI$ git status
On branch feature/139
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   common-service/src/main/resources/application-local.yml
        modified:   gradlew

no changes added to commit (use "git add" and/or "git commit -a")
```

![vscode_diff](https://velog.velcdn.com/images/qriosity/post/7c7ff0fc-5cf0-4dec-9c69-26c2e37a63fd/image.png)

이렇게 말이다.

<br />

### 범인 1: 파일 권한이 바뀜

이 때 가장 흔한 원인으로는 파일 권한 변경이 있다.

이 경우 CLI diff에서 mode change 항목을 살펴보면 된다.

```sh
qriosity@server:~/Desktop/DOKI$ git diff --summary gradlew
 mode change 100644 => 100755 gradlew
```

```sh
qriosity@server:~/Desktop/DOKI$ git diff gradlew
diff --git a/gradlew b/gradlew
old mode 100644
new mode 100755
```

예시의 케이스에선 644에서 755로 권한이 변경된 것을 알 수 있다.

해당 경우 그냥 commit하면 스냅샷되고, 다른 환경에서 clone해도 실행 비트(`+x`)가 적용된다.

다만 git은 전체 permission이 아닌 실행 비트만 저장한다.

<br />

### 범인 2: 파일 인코딩이 바뀜

1번보다는 덜 흔한 케이스인데, 파일 인코딩이 바뀌면 diff 상으론 첫 줄에만 변경점이 뜨게 된다.

하지만 아무리 봐도 실질적 변경 사항이 없어서 의문이 들 때가 있다.

![](https://velog.velcdn.com/images/qriosity/post/cdf4497e-5223-460a-bac1-6ebb68acd691/image.png)

이 경우에는 `git diff`로도 변경 정보가 나오지 않아서 커밋 메시지 처리를 잘 해놔야 한다.