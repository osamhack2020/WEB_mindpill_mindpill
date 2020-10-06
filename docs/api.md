# Mindpill Service API v1

## 개요

> API Endpoint: http://{{INSERT_DOMAIN_HERE}}/api/

| HTTP Response | Description                               |
| ------------- | ----------------------------------------- |
| 200           | 성공적으로 실행을 마쳤습니다.             |
| 400           | 요청이 잘못되었습니다.                    |
| 403           | 인증 토큰이 없거나 잘못되었습니다.        |
| 404           | 요청한 API를 찾지 못했습니다.             |
| 405           | 잘못된 HTTP 메소드로 요청했습니다.        |
| 500           | 서버에서 처리하던 중 오류가 발생했습니다. |

## 사용자 인증

### /api/auth/token

사용자의 인증 토큰을 발급받습니다.

| URI Parameter | Type                    | Description             |
| ------------- | ----------------------- | ----------------------- |
| request_type  | 'password' \| 'refresh' | 사용할 인증 방식입니다. |

| Parameter     | Type   | Description                                             |
| ------------- | ------ | ------------------------------------------------------- |
| email         | string | 사용자의 메일 주소입니다. `password` 인증에 필요합니다. |
| password      | string | 사용자의 비밀번호입니다. `password` 인증에 필요합니다.  |
| refresh_token | string | Refresh Token입니다. `refresh` 인증에 필요합니다.       |

**예시**

```
curl https://localhost:7080/api/auth/token?request_type=password --data '{"email": "recipient@example.com", "password": "1q2w3e4r!"}'
```
