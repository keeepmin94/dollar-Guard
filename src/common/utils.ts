export const getDateDiff = (date1: Date, date2: Date): number => {
  const diffDate = date1.getTime() - date2.getTime();

  return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
};

export const arrayToObject = (array: object[]): object => {
  const resultObject = {};
  array.forEach((item) => {
    const category = item['category'];
    const total_price = parseInt(item['total_price']); // 문자열을 숫자로 변환

    // 객체에 키가 이미 존재하면 더하고, 없으면 새로 생성
    resultObject[category] = (resultObject[category] || 0) + total_price;
  });
  return resultObject;
};

export const truncationWon = (won: number, truncation: number): number => {
  return Math.floor(won / truncation) * truncation;
};

export const calculatePercentage = (part, whole): number => {
  if (!whole) return -100;
  return Math.round((part / whole) * 100);
};

export const amountForm = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getRandom = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
