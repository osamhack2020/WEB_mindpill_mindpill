# Mindpill Service API v1

## 개요

> API Endpoint: http://{{INSERT_DOMAIN_HERE}}/api/

| HTTP Response | Description                               |
| ------------- | ----------------------------------------- |
| 200           | 성공적으로 실행을 마쳤습니다.             |
| 400           | 요청이 잘못되었습니다.                    |
| 403           | 인증 토큰이 없거나 잘못되었습니다.        |
| 404           | 요청한 API 혹은 리소스를 찾지 못했습니다. |
| 405           | 잘못된 HTTP 메소드로 요청했습니다.        |
| 500           | 서버에서 처리하던 중 오류가 발생했습니다. |

> 아래 API의 예시에는 Authorization 헤더가 생략되어 있습니다.
>
> 실제 API 실행시에는 사용자 인증을 위하여 Access Token을 함께 전송해주시기 바랍니다.

## Authentication API

### /api/create_token

사용자의 인증 토큰을 발급하기 위한 엔드포인트입니다.

**URL Parameter**

| Parameter    | Type                    | Description             |
| ------------ | ----------------------- | ----------------------- |
| request_type | `password` \| `refresh` | 사용할 인증 방식입니다. |

**Request**

| Parameter     | Type   | Description                                             |
| ------------- | ------ | ------------------------------------------------------- |
| email         | string | 사용자의 메일 주소입니다. `password` 인증에 필요합니다. |
| password      | string | 사용자의 비밀번호입니다. `password` 인증에 필요합니다.  |
| refresh_token | string | Refresh Token입니다. `refresh` 인증에 필요합니다.       |

**Response**

| Parameter     | Type   | Description                                               |
| ------------- | ------ | --------------------------------------------------------- |
| access_token  | string | 서비스 접근에 사용하는 Access Token입니다.                |
| refresh_token | string | 새롭게 토큰을 발급받기 위해 사용하는 Refresh Token입니다. |

**Note**

- Access Token은 발급 시점부터 24시간동안 유효합니다.
- Refresh Token은 만료되지 않지만 1회용입니다.
  이를 사용해 새 토큰을 발급받을 경우 사용된 Refresh Token은 물론 연결된 Access Token 역시 사용할 수 없게 됩니다.

**Examples**

```
curl https://localhost:7080/api/create_token?request_type=password --data '{"email": "recipient@example.com", "password": "1q2w3e4r!"}'
```

## User API

### /api/create_user

새 사용자를 만들기 위한 엔드포인트입니다.

**Request**

| Parameter    | Type       | Description                                                            |
| ------------ | ---------- | ---------------------------------------------------------------------- |
| email        | string     | 사용자의 메일 주소. 이 필드는 반드시 필요합니다.                       |
| password     | string     | 사용자의 비밀번호. 이 필드는 반드시 필요합니다.                        |
| name         | string     | 사용자의 이름. 이 필드는 반드시 필요합니다.                            |
| sv_number    | string     | 사용자의 군번. 군번은 중복될 수 있습니다. 이 필드는 반드시 필요합니다. |
| gender       | `m` \| `f` | 사용자의 성별. 이 필드는 반드시 필요합니다.                            |
| phone_number | string     | 사용자의 연락처. 전화번호 혹은 군 VoIP 번호입니다.                     |
| rank_id      | int        | 사용자가 속한 계급 ID. 이 필드는 반드시 필요합니다.                    |
| group_id     | int        | 사용자가 속한 그룹(부대)의 ID. 이 필드는 반드시 필요합니다.            |

**Response**

| Parameter | Type | Description               |
| --------- | ---- | ------------------------- |
| user_id   | int  | 가입된 사용자의 id입니다. |

**Examples**

```
curl https://localhost:7080/api/create_user --data '{"email": "recipient@example.com", "password": "1q2w3e4r!", "name": "Example", "sv_number": "00-00000000", "gender": "m", "phone_number": "000-0000", "rank_id": 0, "group_id": 0}'
```

## Group APIs

### POST /api/create_group

새 그룹을 생성합니다.

인증이 필요하며, 관리자 권한으로만 실행할 수 있습니다.

**Request**

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| name      | string | true     | 그룹의 이름입니다. |

**Response**

| Parameter | Type | Description               |
| --------- | ---- | ------------------------- |
| user_id   | int  | 만들어진 그룹의 ID입니다. |

**Examples**

```
curl -X POST https://localhost:7080/api/create_group --data '{"name": "Group Name"}'
```

### GET /api/describe_group

그룹의 정보를 받아옵니다.

**Query**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| group_id  | int  | true     | 그룹의 ID.  |

**Response**

| Parameter  | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| name       | string | 그룹의 이름입니다.                                           |
| created_at | time   | 그룹이 만들어진 시각입니다.                                  |
| updated_at | time   | 그룹의 데이터가 변경된 시각입니다. (관리자 추가 등은 미포함) |

**Examples**

```
curl -X GET https://localhost:7080/api/describe_group?group_id=1
```

### POST /api/create_manager

그룹에 매니저를 추가합니다.

이 API를 실행하기 위해서는 관리자 권한이 필요합니다.

**Request**

| Parameter | Type | Required | Description                  |
| --------- | ---- | -------- | ---------------------------- |
| group_id  | int  | true     | 그룹의 ID.                   |
| user_id   | int  | true     | 매니저로 추가할 사용자의 ID. |

**Examples**

```
curl -X GET https://localhost:7080/api/create_manager --data '{"group_id":1,"user_id":1}'
```

### POST /api/delete_manager

그룹의 매니저를 삭제합니다.

이 API를 실행하기 위해서는 관리자 권한이 필요합니다.

**Request**

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| group_id  | int  | true     | 그룹의 ID.          |
| user_id   | int  | true     | 매니저의 사용자 ID. |

**Examples**

```
curl -X GET https://localhost:7080/api/delete_manager --data '{"group_id":1,"user_id":1}'
```

### POST /api/create_counselor

그룹에 상담관을 추가합니다.

이 API를 실행하기 위해서는 관리자 권한이 필요합니다.

**Request**

| Parameter | Type | Required | Description                    |
| --------- | ---- | -------- | ------------------------------ |
| group_id  | int  | true     | 그룹의 ID.                     |
| user_id   | int  | true     | 상담관으로 추가할 사용자의 ID. |

**Examples**

```
curl -X GET https://localhost:7080/api/create_counselor --data '{"group_id":1,"user_id":1}'
```

### POST /api/delete_counselor

그룹의 상담관을 삭제합니다.

이 API를 실행하기 위해서는 관리자 권한이 필요합니다.

**Request**

| Parameter | Type | Required | Description           |
| --------- | ---- | -------- | --------------------- |
| group_id  | int  | true     | 그룹의 ID.            |
| user_id   | int  | true     | 상담관으로 사용자 ID. |

**Examples**

```
curl -X GET https://localhost:7080/api/delete_counselor --data '{"group_id":1,"user_id":1}'
```
