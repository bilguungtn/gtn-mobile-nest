import ECarriers from '../enums/carrier.enum';

export const formatCapacity = (capacityString) => {
  if (capacityString.includes('MB')) {
    const number = parseFloat(capacityString.replace('MB', ''));
    return number / 1000;
  }
  const number = parseFloat(capacityString.replace('GB', ''));
  return number;
};

export const formatPrice = (priceString) => {
  const price = parseInt(priceString.replace(/円|,/g, ''));
  return price;
};

export const formatAvailableCount = (availableCountString) => {
  const replaceHead = availableCountString.replace('回目/最大', '');
  const replaceFoot = replaceHead.replace('回', '');
  return parseInt(replaceFoot);
};

export const carrierTypeCode = (carrierString) => {
  if (carrierString === 'SB') return ECarriers.SOFTBANK.code;
  if (carrierString === 'YM') return ECarriers.Y_MOBILE.code;
  if (carrierString === 'Ncom') return ECarriers.N_COM.code;
  return ECarriers.UNKNOWN.code;
};

export const deadlineFormat = (deadline: string) => {
  let deadlines = {
    deadline_day: null,
    deadline_time: null,
  };
  switch (deadline) {
    case '15日営業時間(18:30)まで':
      deadlines = {
        deadline_day: '15',
        deadline_time: '18:30',
      };
      break;
    case '月末の最終日以外なら翌月受付対応可能':
      deadlines = {
        deadline_day: '15',
        deadline_time: '18:30',
      };
      break;
    default:
      deadlines;
  }
  return deadlines;
};
