const conditionType = {
  good: {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxODAzMTVfMTk2/MDAxNTIxMDc4NjgzNzcw.r3NmOE0xWmUiCdrJs1w0MC7Slh2EoBuJIfclWVObovcg.cQ2563Qx2lu-Rj6hrohI3MNfHj-7QyLvCs7GiklZk5cg.PNG.osy2201/16.png?type=w800',
    message: '아주 잘 아끼고 있습니다! 오늘도 화이팅!',
  },
  proper: {
    url: 'https://static.wikia.nocookie.net/supernaturalpowers/images/6/6d/%ED%8C%8C%EB%9E%80%EC%83%89_%EA%B7%B8%EB%A6%BC.png/revision/latest/scale-to-width-down/360?cb=20211005054435&path-prefix=ko',
    message: '충분히 잘 아끼고 있어요! 오늘도 열심히!',
  },
  warning: {
    url: 'https://static.wikia.nocookie.net/supernaturalpowers/images/3/3c/%EB%85%B8%EB%9E%80%EC%83%89_%EA%B7%B8%EB%A6%BC.png/revision/latest/scale-to-width-down/360?cb=20210111071044&path-prefix=ko',
    message: '하루 소비량이 기준치를 넘었어요! 오늘은 아껴쓰세요!',
  },
  danger: {
    url: 'https://static.wikia.nocookie.net/supernaturalpowers/images/d/d5/%EB%B9%A8%EA%B0%84%EC%83%89_%EA%B7%B8%EB%A6%BC.png/revision/latest?cb=20201209032858&path-prefix=ko',
    message: '소비량이 총 예산을 넘었어요! 절약!',
  },
};

export const payloads = {
  //디스코드 웹 훅 페이로드 (오늘 지출 추천)
  MORNING_CONSULTING: (data, type: string) => {
    return {
      username: 'Dollar-Guard',
      avatar_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-iSJeB0IxZw3ZEcLLx1ncQNnQWTBf1X4Pfg&usqp=CAU',
      content: '오늘도 열심히 아끼세요!',
      embeds: [
        {
          author: {
            name: '💰 오늘 지출 추천 💰',
          },
          description:
            '설정하신 예산을 기준으로 오늘 사용하면 좋을 금액을 추천드려요.',
          color: 15258703,
          fields: data,
          footer: {
            text: conditionType[type].message,
            icon_url: conditionType[type].url,
          },
        },
      ],
    };
  },

  //디스코드 웹 훅 페이로드 (오늘 지출 안내)
  EVENING_CONSULTING: (data) => {
    return {
      username: 'Dollar-Guard',
      avatar_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-iSJeB0IxZw3ZEcLLx1ncQNnQWTBf1X4Pfg&usqp=CAU',
      content: '오늘도 현명한 소비를 하셨나요?😉',
      embeds: [
        {
          author: {
            name: '💸 오늘 지출 안내 💸',
          },
          description: '오늘 지출하신 금액을 안내드립니다.',
          color: 15258703,
          fields: data,
          footer: {
            text: '매일 저축하는 작은 금액이 결국 큰 투자로 이어집니다.',
          },
        },
      ],
    };
  },
};

//디스코드 웹 훅 페이로드 (오늘 지출 안내)
