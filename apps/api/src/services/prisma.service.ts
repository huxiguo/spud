import { Global, Injectable, Module, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import type { DatabaseConfig } from '../config/config.types'

import { PrismaClient } from '../generated/prisma/self/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService: ConfigService) {
        const config = configService.get<DatabaseConfig>('selfDatabase')

        if (config == null) {
            throw new Error('database config is none')
        }

        const adapter = new PrismaMariaDb({
            host: config.host,
            port: config.port,
            database: config.databaseName,
            user: config.user,
            password: config.password,
            connectionLimit: 10,
        })

        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect()
        console.log('prisma is initialized')
    }

    async onModuleDestroy() {
        await this.$disconnect()
        console.log('prisma is destroyed')
    }
}

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
    imports: [ConfigModule],
})
export class PrismaModule {}
