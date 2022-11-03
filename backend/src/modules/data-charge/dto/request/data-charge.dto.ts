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
        id: data.data_charges.id,
        capacity: data.data_charges.capacity,
        price: data.data_charges.price,
        price_with_tax: data.data_charges.price * taxRate,
        available_count: data.data_charges.available_count,
      };
    }),
  };
  return dto;
};
