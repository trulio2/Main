import { Inject, UsePipes, ValidationPipe } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { AppService } from './app.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AppGateway {
  @WebSocketServer()
  server: Server

  constructor(
    @Inject('BitMEXClient')
    private readonly bitMEXClient: any,
    private readonly appService: AppService,
  ) {
    setInterval(() => {
      this.bitMEXClient.socket.send('ping')
    }, 30 * 1000)

    this.bitMEXClient.addStream('XBTUSD', 'trade', (data: any) => {
      this.appService.handleCurrentPrice(data)
    })
  }
}
