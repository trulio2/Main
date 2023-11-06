import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

export const Consumers: ClientsModuleOptions = [
  {
    name: 'AUTH_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  },
  {
    name: 'CATS_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'cats',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'cats-consumer',
      },
    },
  },
];
