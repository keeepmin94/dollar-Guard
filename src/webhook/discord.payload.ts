import { getRandom } from 'src/common/utils';

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

const lifeQuotes = [
  '저축은 미래에 대한 가장 확실한 투자입니다.',
  '적게 쓰고 많이 모으는 것이 부의 시작이다.',
  '돈은 작은 부분들의 합이다. 따라서 작은 부분들에 주의를 기울이자.',
  '절약은 지혜의 첫 번째 단계이다.',
  '소비자는 소비, 투자자는 투자, 그리고 저축자는 저축해야 한다.',
  '지출을 줄이고 저축을 늘리면서 돈을 모으세요.',
  '향후를 위해 오늘을 준비하세요.',
  '돈을 통제하는 것이 자유를 얻는 길이다.',
  '저축은 성공의 열쇠 중 하나이다.',
  '이익보다는 저축이 중요하다.',
  '가난은 잘못된 소비에서 비롯된다.',
  '저축은 지식을 늘리는 첫 번째 단계이다.',
  '오늘의 절약은 내일의 부의 시작이다.',
  '돈을 효율적으로 관리하면 시간과 에너지를 절약할 수 있다.',
  '돈을 무분별하게 쓰면, 그 속에는 언제나 불안이 따라다닌다.',
  '저축은 새로운 시작을 위한 토대이다.',
  '매일 조금씩 모으면 큰 저축이 된다.',
  '돈은 지식과 지혜를 가진 사람에게만 본질적인 가치를 발휘한다.',
  '어떤 돈도 너무 작아서 무시할 일은 없다.',
  '더 나은 미래를 위해 오늘 행동하세요.',
];

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
            text: lifeQuotes[getRandom(0, lifeQuotes.length - 1)],
          },
        },
      ],
    };
  },
};

//디스코드 웹 훅 페이로드 (오늘 지출 안내)
