import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AppController } from './app.controller'
import configuration from './config/configuration'
import { PrismaModule } from './services/prisma.service'

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        JwtModule.register({
            global: true,
            secret: configuration().tokenSecret,
            signOptions: {},
        }),
        PrismaModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
