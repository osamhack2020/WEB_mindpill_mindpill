# 채팅 라이브러리

> WIP

웹소켓을 이용한 채팅을 간편하게 구현할 수 있도록 하는 이벤트 기반의 라이브러리입니다.

본 라이브러리의 사용 예시는 다음과 같습니다.

```typescript
import { joinRoom, TextMessage, ImageMessage, AudioMessage, VideoMessage, UserChangedMessage } from './lib/chat'

// 채팅방을 요청합니다.
const room = await joinRoom('id')

// 텍스트 메시지를 받은 경우
room.on('text', message: TextMessage => {
  display.addImage(message.text)
})

// 이미지 메시지를 받은 경우
room.on('image', message: ImageMessage => {
  display.addElement(`<img src="/upload/image/${message.imageID}">`)
})

// 오디오 메시지를 받은 경우
room.on('audio', message: VideoMessage => {
  display.addElement(`<audio src="/upload/audio/${message.audioID}">`)
})

// 비디오 메시지를 받은 경우
room.on('video', message: VideoMessage => {
  display.addElement(`<video src="/upload/video/${message.videoID}">`)
})

// 메시지를 보내는 사용자가 바뀔 경우
room.on('user_changed', message: UserChangedMessage => {
  display.addElement(`<span class="user-indicator" data-userid="${message.userID}">`)
})

// 메시지를 보낸 시간(분)이 바뀔 경우
//
// 예를 들어, 10시 10분 10초와 10시 10분 59초 사이에는 이 이벤트가 발생하지 않지만
// 10시 11분 1초에는 이 이벤트가 발생함.
//
// timestamp의 단위는 초로, 1970년 1월 1일 00:00:00 UTC부터 몇 초 경과했는지를 나타냄.
room.on('time_changed', message: TimeChangedMessage => {
  display.addElement(`<span class="time-indicator" data-lasttime="${message.lastTimestamp}" data-timestamp="${message.timestamp}">`)
})
```
