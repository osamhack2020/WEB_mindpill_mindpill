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
          authority: 3
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
          authority: 3
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
          authority: 3
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
        authority: 3
      },
      {
        id: 222222,
        email: 'second@gmail.com',
        name: '김두울',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 3
      },
      {
        id: 333333,
        email: 'third@gmail.com',
        name: '김세엣',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 3
      },
      {
        id: 444444,
        email: 'fourth@gmail.com',
        name: '김네엣',
        sv_number: '12-34567890',
        phone_number: '010-1234-5678',
        authority: 3
      }
    ]
  },

  API_AUTHENTICATE_USER: [
    {
      id: 123456,
      email: 'standardUser@gmail.com',
      name: '김서비스관리자',
      sv_number: '12-34567890',
      phone_number: '010-1234-5678',
      authority: 1
    },
    {
      id: 123456,
      email: 'standardUser@gmail.com',
      name: '김부대관리자',
      sv_number: '12-34567890',
      phone_number: '010-1234-5678',
      authority: 2
    },
    {
      id: 123456,
      email: 'standardUser@gmail.com',
      name: '김상담관',
      sv_number: '12-34567890',
      phone_number: '010-1234-5678',
      authority: 3
    },
    {
      id: 123456,
      email: 'standardUser@gmail.com',
      name: '김지휘관',
      sv_number: '12-34567890',
      phone_number: '010-1234-5678',
      authority: 4
    },
    {
      id: 123456,
      email: 'standardUser@gmail.com',
      name: '김일반',
      sv_number: '12-34567890',
      phone_number: '010-1234-5678',
      authority: 5
    },
    null
  ],

  API_COUNSELOR_PREVIOUS_MEMOS: [
    {
      title: '첫번째 메모입니다.',
      content:
        '민주평화통일자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 국가는 건전한 소비행위를 계도하고 생산품의 품질향상을 촉구하기 위한 소비자보호운동을 법률이 정하는 바에 의하여 보장한다. 중앙선거관리위원회는 법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며, 법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다.',
      timestamp: '2020년 10월 10일 토요일'
    },
    {
      title: '두번째 메모입니다.',
      content:
        '대통령은 국가의 원수이며, 외국에 대하여 국가를 대표한다. 선거운동은 각급 선거관리위원회의 관리하에 법률이 정하는 범위안에서 하되, 균등한 기회가 보장되어야 한다.',
      timestamp: '2020년 10월 11일 일요일'
    }
  ],

  API_COUNSELOR_COMMANDERS: [
    {
      id: 123456,
      name: '김지휘'
    },
    {
      id: 122342,
      name: '이지휘'
    },
    {
      id: 443256,
      name: '박지휘'
    }
  ],

  API_MANAGE_USER: [
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '김이름',
      classification: '육군',
      phone_number: '010-1234-5678',
      authority: 3
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '박이름',
      classification: '해군',
      phone_number: '010-1234-5678',
      authority: 5
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '신이름',
      classification: '육군',
      phone_number: '010-1234-5678',
      authority: 4
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '최이름',
      classification: '공군',
      phone_number: '010-1234-5678',
      authority: 5
    }
  ],

  API_MANAGE_NEW: [
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '김신입',
      classification: '육군',
      phone_number: '010-1234-5678'
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '박신입',
      classification: '해군',
      phone_number: '010-1234-5678'
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '신신입',
      classification: '육군',
      phone_number: '010-1234-5678'
    },
    {
      sv_number: '19-12345678',
      email: 'email@email.com',
      name: '최신입',
      classification: '공군',
      phone_number: '010-1234-5678'
    }
  ],

  API_MANAGE_RECORD: [
    {
      counselor: '김상담',
      user: '김유저',
      date: '2020년 10월 17일',
      message_id: null
    },
    {
      counselor: '이상담',
      user: '이유저',
      date: '2020년 10월 17일',
      message_id: '1234567'
    },
    {
      counselor: '박상담',
      user: '박유저',
      date: '2020년 10월 17일',
      message_id: '1234567'
    },
    {
      counselor: '김상담',
      user: '김유저',
      date: '2020년 10월 17일',
      message_id: null
    },
    {
      counselor: '이상담',
      user: '이유저',
      date: '2020년 10월 17일',
      message_id: '1234567'
    },
    {
      counselor: '박상담',
      user: '박유저',
      date: '2020년 10월 17일',
      message_id: '1234567'
    }
  ]
}
export default database
