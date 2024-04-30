---
title: '자바 파일 입출력과 스트림'
eng_title: 'Java File Input/Output & Stream'
image: https://til.qriosity.dev/img/m_banner_background.jpg
sidebar_label: '파일 입출력과 스트림'
sidebar_position: 8
created_date: 2024-04-30
---

# 자바 파일 입출력과 스트림

## 파일 입출력 기본

### 파일/디렉토리 존재 여부 확인
```java
File file = new File("C:\\jdk-17\\bin");
System.out.println(file.exists());
```

### 파일/디렉토리 유형 확인
```java
File file = new File("C:\\jdk-17\\bin");
System.out.println(file.isFile());
System.out.println(file.isDirectory());
```

### 디렉토리 내부 확인
```java
File[] flist = file.listFiles();
System.out.println(flist.length);
for (File f : flist) {
    if (f.getName().endsWith(".exe"))
        System.out.println(f.getName());
}
```

### 경로 출력
```java
System.out.println(file.getPath());
System.out.println(file.getParent());
System.out.println(file.getAbsolutePath());
```

<br />

## 파일 입출력 스트림

### 파일 입력 스트림
`FileInputStream`: file --> ram
```java
try {
    InputStream is = new FileInputStream("c:/data/exe.txt");

    while (true) {
        int data = is.read();
        System.out.println(data);
        if (data == -1) break;
    }
    is.close();
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```

```java
try {
    InputStream is = new FileInputStream("c:/data/exe.txt");
    byte[] data = new byte[100];

    while (true) {
        int num = is.read(data);
        if (num == -1) break;

        for (int i = 0; i < num; ++i) {
            System.out.println(data[i]);
        }
    }
    is.close();
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```

### 파일 출력 스트림
`FileOutputStream`: ram --> file
```java

```