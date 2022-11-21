export class PlanGroupResponseDto {
  data: [
    {
      plans: [
        {
          id: number;
          deadline_day: string;
          deadline_time: string;
        },
      ];
    },
  ];
}

export class PlanDto {
  id: number;
  name: string;
  happiness_name: string;
  plan_group_id: number;
  capacity?: number;
  carrier_type_code?: number;
  price?: number;
}

export class CurrentPlanResponseDto {
  data: [
    {
      profile: {
        data: {
          user_name: string;
          user_name_kana: string;
          contract_phone_number: string;
          cell_phone_number: string;
          email: string;
          zip_code: string;
          address: string;
        };
      };
      main_plan: {
        data: {
          id: string;
          sim_number: string;
          plan_name: string;
          contract_start_date: Date;
          capacity: number;
          plan: number;
        };
      };
    },
  ];
}

export class AvailablePlanResponseDto {
  id: number;
  plan_name: string;
  plan_group_id: number;
}
