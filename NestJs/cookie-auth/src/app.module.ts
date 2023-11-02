import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, CatsModule } from './modules';
import { configValidationSchema } from './config.schema';
@Module({
  imports: [
    AuthModule,
    CatsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
  ],
})
export class AppModule {}
