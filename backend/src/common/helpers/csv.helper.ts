export const formatCapacity = (capacityString) => {
  if (capacityString.includes('MB')) {
    const number = parseFloat(capacityString.replace('MB', ''));
    return number / 1000;
  }
  const number = parseFloat(capacityString.replace('GB', ''));
  return number;
};

export const formatPrice = (priceString) => {
  priceString.replace(',', '');
};
