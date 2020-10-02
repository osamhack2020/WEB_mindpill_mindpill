# mindpill

국군 상담 플랫폼

# MindPill

TODO: (INSERT_LOGO_HERE)

<!-- ![MindPill Logo]() -->

## 팀소개 및 프로잭트 설명 동영상

TODO

## 기능 설계

<!--
    어떤 내용을 쓰라는건지 잘 이해가 안되네요.
    일단 다른 프로젝트 올라오는 거 보고 작업해야 할 것 같습니다.
-->

TODO

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

- Hyunwoo Kim (clo3olb@gmail.com) Github ID: @clo3olb
- Yongbin Kim (iam@yongbin.kim) Github ID: @ybkimm

## 저작권 및 사용권 정보 (Copyleft / End User License)

- [MIT License](./LICENSE)
