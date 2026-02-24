---
title: 'PAT로 GitLab 권한 설정하기'
eng_title: "How to use PAT for GitLab permission"
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: 'PAT로 GitLab 권한 설정하기'
sidebar_position: 4
created_date: 2026-02-24
---

# PAT로 GitLab 권한 설정하기

## 문제 상황

싸피 GitLab 클론이 안된다.

최초 시도땐 로그인 창이라도 떠서 거기 패스워드 칸에 PAT를 넣으면 됐는데, 요상하게 지금은 안뜬다.

GitHub의 경우 권한이 필요하면 로그인 창이 뜨면서 웹 로그인도 지원해주는데 GitLab은 좀... 쓰읍...

<br />

## 해결 방법

[이 스레드 글](https://forum.gitlab.com/t/how-to-git-clone-via-https-with-personal-access-token-in-private-project/43418/6)을 참고했다.

![](https://velog.velcdn.com/images/qriosity/post/e55787bc-134c-489d-9391-bc94beece674/image.png)

그냥 이렇게 프로토콜과 도메인 사이에 껴집어넣으면 된다.

<br />

## 결과

![](https://velog.velcdn.com/images/qriosity/post/590c752a-4ee7-40fd-9b4b-13cfe7ae60dd/image.png)

clone을 비롯하여 push도 자알 된다. ~~당연하지 풀액세스니까~~

<br />

### [Windows] 자격 증명 확인하기

![](https://velog.velcdn.com/images/qriosity/post/02e408bd-b8c2-4794-890d-6c64568fd3f0/image.png)

윈도우의 경우, PAT가 로컬에 잘 적용되었는지는 '자격 증명 관리자'의 **Windows 자격 증명**에서 확인할 수 있다.

...반대로 말하면 싸피에서 자리가 바뀌거나 본체를 바꾸기 전에 여기 있는 PAT를 삭제해놓아야 한다는 것이다.<br />
~~근데 다들 안삭제함~~&nbsp;&nbsp;&nbsp;~~*잘썻어요*~~

자격 증명을 보면 알겠지만 콜론을 기준으로 앞에 썼던게 뭐 파라미터명 이런게 아니라 그냥 사용자 이름 칸이다.

```bash title="명령어 형식"
git clone https://<사용자명>:<PAT>@도메인/경로/REPO이름.git
```

최종적으로 명령어는 이런 형태이다.

그래서 `gitlab-project-token` 말고 GitLab 사용자명을 쓰는 것이 더 깔끔하다.