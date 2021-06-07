import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get('health-check')
  healthCheck(): { status: string } {
    return { status: 'Very health, yes' };
  }
}
