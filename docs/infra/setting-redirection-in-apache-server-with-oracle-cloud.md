---
title: '오라클 클라우드로 리디렉션용 아파치 서버 만들기'
eng_title: 'Setting Redirection in Apache Server with Oracle Cloud'
image: https://til.qriositylog.com/img/m_banner_background.jpg
created_date: 2021-11-23
updated_date: 2021-11-25
---

# 오라클 클라우드로 리디렉션용 아파치 서버 만들기

## 오라클 클라우드 인스턴스 생성

1. 클라우드 콘솔 로그인
2. 콘솔 메인에서 Launch Resources -> Create a VM instance 클릭
3. `Always Free-eligible`한 Ubuntu 인스턴스 생성

<br />

## 고정 외부 아이피 설정 (선택)

인스턴스를 재시작하면 외부 아이피가 변경되는데, 이 부분이 SSH 접속 시 번거롭기도 하고

웹 서버의 경우 가용성이 떨어질 위험도 있기 때문에 대부분 고정 아이피를 추가로 발급받아 설정합니다.

### 📌 고정 외부 아이피 발급

Oracle Cloud의 Reserved IPs는 AWS의 Elastic IP같은 서비스입니다.

---

- 좌상단 메뉴 -> Networking -> IP Management -> Reserved IPs 클릭

- Reserve Public IP Address 버튼 클릭해 아이피 발급받기

---

### 📌 인스턴스에 고정 외부 아이피 적용

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

```bash
$ sudo apt-get update
$ sudo apt install apache2
```

<br />

## TCP 80번 포트 개방 (선택)

AWS EC2에서 설정할땐 AWS 콘솔에서 HTTP 포트를 추가한 것 만으로 끝났던 것 같은데,

이번에 오라클 클라우드에서 다시 설정하려 보니 단순 인바운드 룰 설정으로는 HTTP 접속이 불가했습니다.

이 경우, 인스턴스 내부에서 `iptables` 명령어를 이용하여 추가 설정을 해줍니다.

```bash
$ sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
$ sudo iptables -I OUTPUT -p tcp --sport 80 -j ACCEPT
```

이 단계가 끝나면, 브라우저로 `http://{외부아이피주소}` 접속이 가능해야 합니다.

성공적으로 접속되었다면 아파치 서버의 디폴트 index.html이 뜹니다.

<br />

## DNS 레코드 설정 (선택)

개인 도메인 주소가 있다면, DNS 설정을 통해 해당 도메인을 인스턴스 ip와 연결해줍니다.

<br />

## AllowOverride 설정

`/var/www/` 에 대한 AllowOverride 옵션만 All로 수정해줍니다.

```apacheconf title=/etc/apache2/apache2.conf
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
```

<br />

## .htaccess 설정

.htaccess 파일은 index.html이 있는 `/var/www/html` 경로에 생성합니다.

```apacheconf title=/var/www/html/.htaccess
RewriteEngine On

RewriteCond %{HTTP_HOST} ^qriositylog.com [NC]
RewriteRule ^(.*)$ https://blog.naver.com/hirit808/$1 [L,R=301,NC]

RewriteCond %{HTTP_HOST} ^www.qriositylog.com [NC]
RewriteRule ^(.*)$ https://blog.naver.com/hirit808/$1 [L,R=301,NC]
```

<br />

## Rewrite 모듈 활성화 & 아파치 재시작

매우 중요합니다. 이 과정을 빠뜨리면 리디렉션이 동작하지 않을 확률이 매우 높습니다.

하단의 명령어를 입력하여 rewrite 모듈을 활성화하고, 아파치 서버를 재시작합니다.

그동안의 설정 중 syntax error 등 잘못된 부분이 있으면 재시작 후 500 Internal Server Error가 뜨니 주의하세요.

```bash
$ sudo a2enmod rewrite
$ sudo systemctl restart apache2
```

<br />

## 테스트하기

모든 설정이 끝났습니다! 이제 리디렉션이 제대로 작동하는지 테스트해보세요.

http://qriositylog.com

상단의 링크는 제 네이버 블로그로 리디렉션됩니다.
