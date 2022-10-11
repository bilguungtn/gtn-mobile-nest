import { ProfileDto } from 'src/modules/profile/dto/response/profile.dto';

/**
 * Mapper => To UserDetailsResponseDto from user.
 * @param data user data.
 * @returns {ProfileDto} UserDetailsResponseDto.
 */
export const toProfileResponseDto = (data: any): ProfileDto => {
  const dto: ProfileDto = {
    gtn_id: data.id,
    name: data.name,
    name_kana: data.name_kana,
    birthdate: data.birthday,
    contact_phone_number: data.contact_phone_number,
    cell_phone_number: data.cell_phone_number,
    postal_code: data?.addresses[0]?.postal_code,
    address: data?.addresses[0]?.address,
    visa_classification_code: data?.visas[0]?.classification_code,
    visa_period_of_validity_date:
      data?.visas[0]?.period_of_validity_date || null,
  };
  return dto;
};
