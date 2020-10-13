const database = {
  // URL: /api/counsel/self
  API_COUNSEL_SELF: {
    counselRooms: [
      {
        friend: {
          id: 111111,
          email: 'first@gmail.com',
          name: '김하나',
          sv_number: '12-34567890',
          phone_number: '010-1234-5678',
          authority: 4
        },
        id: 111111,
        last_message: {
          text: '무슨일이 있었나요?',
          timestamp: new Date(2020, 10, 25, 2, 3, 45)
        }
      },
      {
        friend: {
          id: 222222,
          email: 'second@gmail.com',
          name: '김두울',
          sv_number: '12-34567890',
          phone_number: '010-1234-5678',
          authority: 4
        },
        id: 222222,
        last_message: {
          text: '편하게 말씀하세요.',
          timestamp: new Date(2020, 10, 25, 2, 3, 45)
        }
      },
      {
        friend: {
          id: 333333,
          email: 'third@gmail.com',
          name: '김세엣',
          sv_number: '12-34567890',
          phone_number: '010-1234-5678',
          authority: 4
        },
        id: 333333,
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
      },
      {
        id: 222222,
        email: 'second@gmail.com',
        name: '김두울',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 4
      },
      {
        id: 333333,
        email: 'third@gmail.com',
        name: '김세엣',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 4
      },
      {
        id: 444444,
        email: 'fourth@gmail.com',
        name: '김네엣',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 4
      }
    ]
  }
}
export default database
