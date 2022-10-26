import { Controller, Get } from '@nestjs/common';
import { DataTrafficService } from './data-traffic.service';

@Controller()
export class DataTrafficController {
  constructor(private readonly dataTrafficService: DataTrafficService) {}
}
