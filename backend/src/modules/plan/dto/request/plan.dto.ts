import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlanRequestDto {
  @IsNotEmpty()
  @IsString()
  plan_id: string;

  @IsNotEmpty()
  @IsString()
  application_date: string;
}
