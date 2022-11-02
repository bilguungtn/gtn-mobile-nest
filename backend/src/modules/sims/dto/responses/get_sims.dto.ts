import { ApiProperty } from '@nestjs/swagger';

export class SimResponseDto {
  sim_number: string;
  happiness_id: string;
  canceled_at?: Date | null;
  created_at: Date;
}

export class SimsFullDto {
  id: number;
  sim_number: string;
  happiness_id: string;
  canceled_at?: string | null;
  profile_id: number;
  created_at: Date;
  updated_at: Date;
}
