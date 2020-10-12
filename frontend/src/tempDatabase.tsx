const database = {
  // URL: /api/chat/self
  API_CHAT_SELF: {
    chatRooms: [
      {
        friend: {
          user_id: 111111,
          name: '김하나',
          authority: 4
        },
        chat_room_id: 111111,
        last_message: {
          text: '무슨일이 있었나요?',
          timestamp: new Date(2020, 10, 25, 2, 3, 45)
        }
      },
      {
        friend: {
          user_id: 222222,
          name: '김두울',
          authority: 4
        },
        chat_room_id: 222222,
        last_message: {
          text: '편하게 말씀하세요.',
          timestamp: new Date(2020, 10, 25, 2, 3, 45)
        }
      },
      {
        friend: {
          user_id: 333333,
          name: '김세엣',
          authority: 4
        },
        chat_room_id: 333333,
        last_message: {
          text: '걱정하지 마세요.',
          timestamp: new Date(2020, 10, 25, 2, 3, 45)
        }
      }
    ],
    friends: [
      {
        id: 111111,
        email: 'first@gmail.com',
        name: '김하나',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 4
      }
    ]
  }
}
export default database
