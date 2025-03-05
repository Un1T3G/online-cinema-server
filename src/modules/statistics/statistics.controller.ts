import { Controller, Get } from '@nestjs/common';
import { Auth } from 'shared/decorators/auth.decorator';
import { StatisticsService } from './statistics.service';

@Auth('admin')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main')
  async getMainStatistics() {
    return this.statisticsService.getMainStatistics();
  }

  @Get('middle')
  async getMiddleStatistics() {
    return this.statisticsService.getMiddleStatistics();
  }
}
