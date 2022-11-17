import { PlanGroupDto } from 'src/modules/plan/dto/response/plan.dto';

/**
 * Mapper => To UserDetailsResponseDto from user.
 * @param data user data.
 * @returns {PlanGroupDto} UserDetailsResponseDto.
 */
export const toPlanGroupDto = (plan_groups): Promise<any> => {
  const dto: any = {
    data: [
      {
        plans: plan_groups.map((data) => {
          return {
            id: data?.plan_groups?.id,
            deadline_day: data?.plan_groups?.deadline_day,
            deadline_time: data?.plan_groups?.deadline_day,
          };
        }),
      },
    ],
  };
  return dto;
};

export const toCurrentPlanDto = (profile, plan): Promise<any> => {
  const dto: any = {
    data: [
      {
        profile: {
          data: {
            user_name: profile.user_name,
            user_name_kana: profile.user_name_kana,
            contract_phone_number: profile.phone,
            cell_phone_number: profile.mobile_phone,
            email: profile.e_mail,
            zip_code: profile.zip_code,
            address:
              profile.prefectures +
              profile.address_1 +
              profile.address_2 +
              profile.address_3 +
              profile.address_4 +
              profile.address_5,
          },
        },
        main_plan: {
          data: {
            id: profile.service_id,
            sim_number: profile.sim_number,
            plan_name: profile.plan,
            contract_start_date: profile.use_start_dt,
            capacity: plan.capacity,
            plan: plan.price,
          },
        },
      },
    ],
  };
  return dto;
};
