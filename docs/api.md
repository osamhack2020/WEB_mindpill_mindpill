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
| rank_id      | `Rank.id`  | 사용자가 속한 계급 ID. 이 필드는 반드시 필요합니다.                    |
| group_id     | `Group.id` | 사용자가 속한 그룹(부대)의 ID. 이 필드는 반드시 필요합니다.            |

**Response**

| Parameter | Type      | Description               |
| --------- | --------- | ------------------------- |
| user_id   | `User.id` | 가입된 사용자의 id입니다. |

**Examples**

```
curl https://localhost:7080/api/create_user --data '{"email": "recipient@example.com", "password": "1q2w3e4r!", "name": "Example", "sv_number": "00-00000000", "gender": "m", "phone_number": "000-0000", "rank_id": 0, "group_id": 0}'
```
