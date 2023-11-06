import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import {
  AuthController,
  AuthService,
  CatsController,
  CatsService,
} from './features';
import { JwtStrategy } from './strategies';
import { configValidationSchema } from './config.schema';
import { Consumers } from './consumers';

@Module({
  imports: [
    ClientsModule.register(Consumers),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [AuthController, CatsController],
  providers: [AuthService, CatsService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class ApiGatewayModule {}
