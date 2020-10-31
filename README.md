# mindpill

국군 상담 플랫폼

# MindPill

![MindPill Logo](./MindPill-Logo.png)

## 팀소개 및 프로젝트 설명 동영상

1. 김현우(clo3olb@gmail.com) - 팀장
2. 김용빈(iam@yongbin.kim)

[![Youtube Badge](https://img.shields.io/badge/Youtube-ff3333?style=for-the-badge&&logo=Youtube&link=https://youtu.be/ANlnm6GSKBA?t)](https://youtu.be/ANlnm6GSKBA?t=0s)

## 기능 설계
[![OVEN BADGE](https://img.shields.io/badge/Oven-eeeeee?style=for-the-badge&&logo=oven&link=https://ovenapp.io/view/AHcBoMRVeyWNMQCxalwQzFjiFoj1sWRS/)](https://ovenapp.io/view/AHcBoMRVeyWNMQCxalwQzFjiFoj1sWRS/)

### 페이지 구성
#### 상담 페이지
#### 상담 페이지


## 컴퓨터 구성 / 필수 조건 안내 (Prerequisites)

최신 크롬 브라우저를 권장하지만, 다음 브라우저도 지원합니다.

<!-- TODO: 임시로 작성하였고, 추후 다시 작성해야 함! -->

- Internet Explorer 11
- chrome 49 이상
- edge 18 이상
- firefox 35 이상
- safari 10.1 이상

서버는 다음 OS를 지원합니다. MariaDB 10.5 이상이 설치되어 있어야 합니다.

- linux
- macOS

## 기술 스택 (Technique Used)

<!-- TODO: 보기 좋은 이미지 만들기 -->

### Server(back-end)

- Go 1.15
- MariaDB 10.5

### front-end

- React
- TypeScript
- Webpack
- Babel
- 기타 수많은 라이브러리들. [package.json](./package.json)을 참조하세요.

## 설치 안내 (Installation Process)

설정 파일들은 `backend/configs`에 있습니다.

빌드 과정에서 이 설정 파일들이 바이너리에 포함되기 때문에 설치하기 전에 수정해야 합니다.

```bash
make build
```

위 명령을 실행하면 `dist/mindpill` 파일이 생성됩니다.

다음 명령으로 데이터베이스 초기 세팅을 할 수 있습니다.

```bash
./mindpill -setup-database
```

이후 복잡한 구성 없이, 이 파일을 **어디에든** 두고 실행하면 서버가 실행됩니다.

## 프로젝트 사용법 (Getting Started)

다음 명령을 통해 서버를 실행합니다.

```bash
./mindpill -serve
```

사이트는 다음 주소를 통해 접속 가능합니다. (기본값)

- http://localhost:7080/

또한 초기 세팅한 데이터베이스의 경우 최고 관리자 ID/PW는 다음과 같습니다.

- `admin` / `admin`

TODO: 실제 실행 화면 추가

## 팀 정보 (Team Information)

- Hyeonwoo Kim (clo3olb@gmail.com) Github ID: @clo3olb
- Yongbin Kim (iam@yongbin.kim) Github ID: @ybkimm

## 저작권 및 사용권 정보 (Copyleft / End User License)

- [MIT License](./LICENSE)
