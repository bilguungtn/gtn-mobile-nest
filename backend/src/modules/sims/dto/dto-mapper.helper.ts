import { SimResponseDto } from './responses/get_sims.dto';

/**
 * Mapper => To UserDetailsResponseDto from user.
 * @param data user data.
 * @returns {ProfileDto} UserDetailsResponseDto.
 */
export const toSimsDto = (data): Promise<SimResponseDto> => {
  const dto: any = {
    sim_number: data.sim_number,
    happiness_id: data.happiness_id,
    canceled_at: data.canceled_at || null,
    created_at: data.created_at,
  };
  return dto;
};
