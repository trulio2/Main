import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('blocking')
  blocking() {
    return this.appService.blocking();
  }

  @Get('nonBlocking')
  nonBlocking() {
    return this.appService.nonBlocking();
  }

  @Get('count')
  count() {
    return this.appService.count();
  }

  @Get('nCount')
  nCount() {
    return this.appService.nCount();
  }

  @Get('promises')
  promises() {
    return this.appService.promises();
  }

  @Get('promisesParallel')
  promisesParallel() {
    return this.appService.promisesParallel();
  }
}
