# MindPill

![MindPill Logo](./MindPill-Logo.png)

## 팀소개 및 프로젝트 설명 동영상

1. 김현우(clo3olb@gmail.com) - 팀장
2. 김용빈(iam@yongbin.kim)

### 우리나라를 지키는 자랑스러운 국군. 하지만 우리 국군에게도 누군가에게는 말못할 고민이 있지 않을까요?
용맹하고 자랑스러운 우리 국군 장병들에게도, 남에게는 말못할 고충과 힘든 일들이 있습니다. 그런 고민들을 모두 누군가와 대면하여 상담을 하기란 쉽지 않은 일입니다. 

### 마인드필을 사용해보는것은 어떨까요?
시간과 장소에 제약을 받지 않고, 원할 때 편하게 할 수 있는 상담. 
마인드필은 그런 상담 서비스를 국국 모두가 누릴 수 있도록 플랫폼으로 활성화 시킴과 동시에 실시간 채팅 기능을 갖춘 상담이 어떠한 규모에서도 쉽게 구축될 수 있도록 설계된 국군 상담 플랫폼입니다.

### 시연영상
<!-- 임시로 넣어놓은 링크입니다. 추후 영상을 촬영하여 링크를 변경해야 합니다. -->
[![Youtube Badge](https://img.shields.io/badge/Youtube-ff3333?style=for-the-badge&&logo=Youtube&link=https://youtu.be/ANlnm6GSKBA?t)](https://youtu.be/ANlnm6GSKBA?t=0s)

## 기능 설계
<!-- 임시로 넣어놓은 Oven Badge 입니다. 추후 정상적인 링크로 변경해야 합니다. -->
[![OVEN BADGE](https://img.shields.io/badge/Oven-eeeeee?style=for-the-badge&&logo=oven&link=https://ovenapp.io/view/AHcBoMRVeyWNMQCxalwQzFjiFoj1sWRS/)](https://ovenapp.io/view/AHcBoMRVeyWNMQCxalwQzFjiFoj1sWRS/)

### 사용자 및 기능 구성
#### 피상담자
자신이 원할 때에 자신을 상담해 줄 수 있는 상담관 목록을 손쉽게 볼 수 있고, 간편하게 상담을 시작할 수 있습니다.
#### 상담관
자신에게 요청된 상담을 채팅방 구조로 확인하여 상담을 진행할 수 있고, 필요하다고 판단될 때에는 피상담자의 해당부대 지휘관과 연락하여 적절한 조치를 요구할 수 있습니다.
#### 지휘관
자신의 부대에서 진행되는 상담 중, 필요한 조치가 있을 때에는 상담관과 논의하여 적절한 조치를 취할 수 있습니다.
#### 부대 관리자
부대의 신규 가입자를 관리하고, 지휘관과 상담관을 간편하게 임명할 수 있습니다.
#### 서비스 관리자
부대 생성 및 관리, 신규 부대 관리자 생성 및 관리를 손쉽게 할 수 있습니다.


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
