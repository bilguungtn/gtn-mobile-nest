export class DataChargeRequestDto {
  plan_id: string;
  data_charge_id: number;
}

/**
 * Mapper
 * @param data data.
 * @returns {any} .
 */
export const toDataChargeList = (dataCharge: any): any => {
  const taxRate = 1.1;
  const dto = {
    data: dataCharge.map((data) => {
      return {
        id: data.id,
        capacity: data.capacity,
        price: data.price,
        price_with_tax: data.price * taxRate,
        available_count: data.available_count,
      };
    }),
  };
  return dto;
};
