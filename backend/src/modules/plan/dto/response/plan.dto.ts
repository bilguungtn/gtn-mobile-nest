import { ApiProperty } from '@nestjs/swagger';

export class PlanGroupDto {
  data: [
    {
      plans: TestDto[];
    },
  ];
}

export class TestDto {
  // @ApiProperty({ description: 'plan groud id', example: '1111' })
  id: number;
  deadline_day: string;
  deadline_time: string;
}
