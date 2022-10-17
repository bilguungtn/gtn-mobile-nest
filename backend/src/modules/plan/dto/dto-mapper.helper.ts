import { PlanGroupDto } from 'src/modules/plan/dto/response/plan.dto';

/**
 * Mapper => To UserDetailsResponseDto from user.
 * @param data user data.
 * @returns {PlanGroupDto} UserDetailsResponseDto.
 */
export const toPlanGroupDto = (data): PlanGroupDto => {
  const dto: any = {
    id: data.id,
    deadline_day: data.deadline_day,
    deadline_time: data.deadline_day,
  };
  return dto;
};
