import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { AuthModule, CatsModule } from './modules';
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
