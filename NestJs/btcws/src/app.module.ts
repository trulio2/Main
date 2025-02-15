import { Module } from '@nestjs/common'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'

@Module({
  imports: [],
  providers: [
    AppGateway,
    AppService,
    {
      provide: 'BitMEXClient',
      useFactory: () => {
        const BitMEXClient = require('bitmex-realtime-api')
        return new BitMEXClient({
          maxTableLen: 2,
        })
      },
    },
  ],
})
export class AppModule {}
