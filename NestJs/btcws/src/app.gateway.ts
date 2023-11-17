import { Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('BitMEXClient')
    private readonly bitMEXClient: any,
    private readonly appService: AppService,
  ) {
    this.appService.chartAnalysis();
    this.bitMEXClient.addStream('XBTUSD', 'trade', (data: any) => {
      const length = data.length - 1;
      const newTrade = `New trade: ${data[length].price} ${data[length].side} ${data[length].size}`;
      console.log(newTrade);
      // this.appService.handleNewData(newTrade, this.server);
    });
  }
}
