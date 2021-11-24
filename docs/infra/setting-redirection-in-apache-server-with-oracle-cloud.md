---
title: '오라클 클라우드로 리디렉션용 아파치 서버 만들기'
eng_title: 'Setting Redirection in Apache Server with Oracle Cloud'
image: https://til.qriositylog.com/img/m_banner_background.jpg
created_date: 2021-11-23
updated_date: 2021-11-24
---

# 오라클 클라우드로 리디렉션용 아파치 서버 만들기

## 오라클 클라우드 인스턴스 생성

1. 클라우드 콘솔 로그인
2. 콘솔 메인에서 Launch Resources -> Create a VM instance 클릭
3. `Always Free-eligible`한 Ubuntu 인스턴스 생성

<br />

## 고정 외부 아이피 설정 (선택)

인스턴스를 재시작하면 외부 아이피가 변경되기 때문에, 웹 서버의 경우 

### 고정 외부 아이피 발급

AWS의 Elastic IP같은 서비스입니다.

---

- 좌상단 메뉴 -> Networking -> IP Management -> Reserved IPs 클릭

- Reserve Public IP Address 버튼 클릭해 아이피 발급받기

---

### 인스턴스에 고정 외부 아이피 적용

---

- 좌상단 메뉴 -> Compute -> Instances 클릭

- 인스턴스 Name 클릭 -> 사이드바의 Attached VNICs -> VNIC Name 클릭

- 사이드바의 IPv4 Addresses -> 항목 Edit

- Public IP Type -> Reserved public IP -> 이전 단계에서 발급받은 고정 외부 아이피 선택 -> Update

---

처음에 Public IP Type이 Ephemeral public IP로 되어있고, Reserved public IP가 비활성화 되어있을텐데

우선 No public IP로 설정해서 Update 한 뒤 다시 Edit에 들어가면 Reserved public IP 옵션이 활성화됩니다.

<br />

## 인바운드 룰 설정

오라클 인스턴스는 생성 시 기본으로 SSH 룰이 설정되어 있으나, HTTP/HTTPS는 별도로 설정해주어야 합니다.

이를 위해 다시 Instance details로 들어갑니다.

---
- 좌상단 메뉴 -> Compute -> Instances 클릭

- 인스턴스 Name 클릭

- Instance information에서 Primary VNIC -> Subnet 클릭

- Security Lists -> 항목 Name 클릭

- Ingress Rules -> Add Ingress Rules 클릭 -> 하단 내용대로 설정 후 Add Ingress Rules 클릭

:::info HTTP Ingress Rule

**Source Type:** CIDR <br />
**Source CIDR:** 0.0.0.0/0 <br />
**IP Protocol:** TCP <br />
**Destination Port Range:** 80 <br />
**Description:** 자유롭게 작성

:::

---

<br />

## 인스턴스 SSH 접속 및 아파치 설치

SSH 클라이언트는 자유롭게 선택하세요. 저는 putty를 사용했습니다.

ubuntu로 로그인한 뒤, 다음의 명령어로 아파치 서버를 설치합니다.

```shell
$ sudo apt-get update
$ sudo apt install apache2
```

<br />

## TCP 80번 포트 개방 (선택)

AWS EC2에서 설정할땐 AWS 콘솔에서 HTTP 포트를 추가한 것 만으로 끝났던 것 같은데,

이번에 오라클 클라우드에서 다시 설정하려 보니 단순 인바운드 룰 설정으로는 HTTP 접속이 불가했습니다.

이 경우, 인스턴스 내부에서 `iptables` 명령어를 이용하여 추가 설정을 해줍니다.

```shell
$ sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
$ sudo iptables -I OUTPUT -p tcp --sport 80 -j ACCEPT
```
<br />

