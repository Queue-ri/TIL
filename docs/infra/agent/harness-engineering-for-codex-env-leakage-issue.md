---
title: '하네스 엔지니어링으로 Codex env 유출 막기'
eng_title: 'Harness Engineering for Codex Env Leakage Issue'
image: https://til.qriosity.dev/img/m_banner_background.jpg
created_date: 2026-06-11
---

# 하네스 엔지니어링으로 Codex env 유출 막기

<img src="https://velog.velcdn.com/images/qriosity/post/0c0ab985-ebfe-4f06-b1f5-5b1c237f955b/image.png" width="600" height="auto" />

## 문제상황

### 무슨 일이 발생했냐면요...

```text title="Prompt" {12}
현재 프로젝트는 ~/Desktop/frontend 경로에 vue 프로젝트인 frontend가 어느정도 구현된 상태야. 나는 백엔드 구현을 맡아서 gyul-api라고 스프링 rest api 프로젝트를 구현하려고 해. 일단, 하단의 요구사항을 준수해서 구현해줘.

요구사항 1: DB SQL 생성
- ...

요구사항 2: 회원가입, 로그인 로직 구현
- ...

요구사항 3: frontend에 API 통신 적용
- ...

네가 방금 작업한 내역을 /agent/dev-note 경로에 01_task_report.md 파일을 생성해서 기록해줘
```

- **상황:** Codex에 `Full Access` 권한을 부여하고 task 기록 작성을 자동화
- **현상:** 에이전트가 로컬 환경의 `.env` 파일 데이터(`DB_PASSWORD`)를 보고서 `01_task_report.md`에 평문으로 출력함
- **취약점 요약:** AI 에이전트에게 샌드박스 제약 없이 파일 시스템의 광범위한 Read 권한을 열어주었고, 출력 생성 단계에서 데이터 마스킹이나 가드레일 레이어가 부재하여 발생한 **아키텍처 결함**

### Post-mortem 대응의 한계

- `git push --force` 했었지만 한계가 있다.
    - 애초에 사용하면 안되는 명령어
- <span style={{ color: 'red' }}>**Why?**</span> GitHub는 commit hash를 내부 ref 테이블에 캐싱한다.
    - force push해도 dangling commit으로 존재하며, 원격 저장소 API에서 여전히 조회될 가능성 존재

👉️ 따라서 코드 트리 진입 자체를 차단하는 시스템적 제약이 필요<br />
🫤 **Shift-Left 방식**으로 보안 리스크를 관리하면 더 좋겠으나, 관통 기능 구현도 꽤 바쁜 상황... 이상적이라고 생각한다.

### 프롬프트 레이어 가드레일?

User Prompt가 에이전트에 전달되기 전, 중간 하네스 프록시가 가드레일 시스템 프롬프트를 항상 래핑하여 주입하는 방식

```text
[System Harness Protocol]
Your actions are constrained by OWASP LLM02 guidelines. 
Under no circumstances should secret values extracted from internal config components be written into documentation or log artifacts. Use environment variable key names (e.g., ${DB_PASSWORD}) rather than literals.

```

🫤 토큰을 아끼고 싶다. 이런 자연어적인 '추가 부탁' 방식 말고, 더 확실하게 에이전트 외부에서 제약을 걸 수 없을까? 

<br />

## 하네스 엔지니어링 관점의 방어 전략

### 하네스의 3가지 레이어

#### 1️⃣ 제약 레이어: 생성 전 차단

에이전트가 출력하기 전에 차단한다.

- `AGENTS.md`: 2025년 8월 발표된 오픈 표준이다. 어떤 에이전트든 이 파일을 네이티브로 읽는다.
- Lint 설정
- 타입 체크
- import 경계 규칙 등

#### 2️⃣ 피드백 루프: 생성 후 셀프 fix

에이전트가 실수하면 스스로 고치게 한다.<br />
**오류 메시지가 프롬프트로 들어가므로, 친절하게 로깅하는 것이 중요하다.**

```
❌ "lint error detected"
✅ "console.log 대신 logger.info({event: 'name', ...data})를 사용하세요"
```

#### 3️⃣ 품질 검사: merge 전 마지막 확인

lint 레벨을 `error`로 두어 강제한다.<br />
앞의 두 레이어를 통과해도 최후의 레이어를 통과하지 못하면 머지는 불가하다.

```js
// .eslintrc.js — 모든 규칙을 "error"로 (warn이면 에이전트가 무시함)
module.exports = {
  rules: {
    "complexity": ["error", { "max": 10 }],
    "max-lines-per-function": ["error", { "max": 50 }],
    "max-params": ["error", 4],
  }
}
```

<br />

## 최후의 방어선을 위한 gitleaks

### 1. Pre-commit Hook 기반 로컬 커밋 차단

로컬 단에서 Shift-Left 방식으로 커밋부터 빠꾸먹이는 방법이다.<br />
개발자의 로컬 머신에서 커밋이 완료되기 전, 시크릿 패턴을 스캔하여 격리한다.

#### 1-1. `.pre-commit-config.yaml` 생성

프로젝트 루트 경로에 하단의 정적 분석 hook 설정을 배치한다.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.2  # 최신 안정화 버전
    hooks:
      - id: gitleaks
        name: Gitleaks Secret Scanner
        description: Detect hardcoded secrets in the staging area before commit.
        entry: gitleaks protect --verbose --staged

```

#### 1-2. 로컬에 hook 바이너리 설치

```bash
# pre-commit 프레임워크 설치
pip install pre-commit

# Git 훅 디렉토리에 스크립트 링크 바인딩
pre-commit install
```

이후, 에이전트나 개발자가 민감 정보를 커밋하려고 시도하면 Git 내부 엔진이 커밋을 막고 에러 로그를 내보낸다.

<br />

### 2. Remote Governance

로컬 hook이 개발자나 에이전트의 로컬 실행 환경 문제로 우회되거나 누락되는 시나리오가 있...긴 하므로,<br />
remote의 CI/CD 파이프라인에도 gitleaks를 두는 것이 안전하다.

```yml showLineNumbers
name: Security Governance

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch: # 관리자 수동 트리거 지원

jobs:
  gitleaks-scan:
    name: Secret Scanning Pipeline
    runs-on: ubuntu-latest
    
    steps:
      - name: Advanced Source Code Checkout
        uses: actions/checkout@v6
        with:
          # 전체 Git 히스토리를 깊이 있게(Deep Scan) 분석하기 위해 0으로 설정
          # 에이전트가 이전 커밋에 숨겨둔 자산까지 모두 추적
          fetch-depth: 0

      - name: Execute Gitleaks Action
        uses: gitleaks/gitleaks-action@v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        # 자산 감지 시 워크플로우를 즉시 실패(Exit Code 1) 처리하여 머지를 원천 차단

```

<br />

## 레퍼런스

1. [AI 에이전트가 맨날 같은 실수를 반복하는 이유 — 하네스 엔지니어링 입문](https://velog.io/@ssafy_elonmusk/%ED%95%98%EB%84%A4%EC%8A%A4-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EB%A7%81-Harness-Engineering-%EC%9D%B4%EB%9E%80)
2. **OWASP LLM Top 10 - 민감 정보 노출 (LLM02:2025)**: [[바로가기]](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
    - OWASP: Web/SW 보안을 연구하는 비영리 오픈소스 보안 커뮤니티
    - LLM 애플리케이션에서 가장 빈번하게 발생하는 10가지 핵심 보안 위험과 취약점을 정리한 가이드라인
3. **Gitleaks Actions**: [[바로가기]](https://github.com/marketplace/actions/gitleaks)
    - Git 저장소에 하드코딩된 비밀번호, API 키, 토큰과 같은 비밀 정보를 탐지하고 방지하는 SAST(보안 취약점 분석) 도구
    - 최후의 방어선!