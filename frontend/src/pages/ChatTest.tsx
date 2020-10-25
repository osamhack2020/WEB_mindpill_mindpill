import React from 'react'
import ChatRoom from '../components/ChatRoom'

export default function ChatTestPage() {
  return (
    <div>
      <ChatRoom
        roomID={1}
        token={
          'eyJ0aWQiOjY3MjU2NTY2NzgxMzU0OTY3MDQsInVpZCI6MSwiZ3JvdXBzIjp7IjEiOnsiaWQiOjEsIm1hbmFnZXIiOnRydWUsImNvdW5zZWxlciI6ZmFsc2V9fSwiYWRtaW4iOnRydWUsInJlZnJlc2giOmZhbHNlLCJjYXQiOiIyMDIwLTEwLTI0VDE1OjM4OjI4LjcyNjkxMTMxMiswOTowMCJ9.sivA9aJzpyLwIWhOTK9UAZ-2z6ItwwwtugI40nd_Dec'
        }
      />
    </div>
  )
}
