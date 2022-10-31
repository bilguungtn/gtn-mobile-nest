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
