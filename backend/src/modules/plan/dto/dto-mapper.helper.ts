import {
  AvailablePlanResponseDto,
  CurrentPlanResponseDto,
  PlanDto,
  PlanGroupResponseDto,
} from 'src/modules/plan/dto/response/plan.dto';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';

/**
 * Mapper => To UserDetailsResponseDto from user.
 * @param data user data.
 * @returns {PlanGroupResponseDto} UserDetailsResponseDto.
 */
export const toPlanGroupDto = (plan_groups) => {
  const dto: PlanGroupResponseDto = {
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

export const toCurrentPlanDto = (oldUser: UserResponseDto, plan: PlanDto) => {
  const dto: CurrentPlanResponseDto = {
    data: [
      {
        profile: {
          data: {
            user_name: oldUser?.user_name,
            user_name_kana: oldUser?.user_name_kana,
            contract_phone_number: oldUser?.phone,
            cell_phone_number: oldUser?.mobile_phone,
            email: oldUser?.e_mail,
            zip_code: oldUser?.zip_code,
            address:
              oldUser?.prefectures +
              oldUser?.address_1 +
              oldUser?.address_2 +
              oldUser?.address_3 +
              oldUser?.address_4 +
              oldUser?.address_5,
          },
        },
        main_plan: {
          data: {
            id: oldUser?.service_id,
            sim_number: oldUser?.sim_number,
            plan_name: oldUser?.plan,
            contract_start_date: oldUser?.use_start_dt,
            capacity: plan?.capacity,
            plan: plan?.price,
          },
        },
      },
    ],
  };
  return dto;
};

export const toAvailablePlanDto = (data: PlanDto) => {
  const plan: AvailablePlanResponseDto = {
    id: data.id,
    plan_name: data.name,
    plan_group_id: data.plan_group_id,
  };
  return plan;
};

// export const toPlanDto = (data: PlanDto) => {
//   const plan: PlanDto = {
//     id: data.id,
//     name: data.name,
//     happiness_name: data.happiness_name,
//     plan_group_id: data.plan_group_id,
//     capacity: data.capacity,
//     price: data.price,
//   };
//   return plan;
// };
