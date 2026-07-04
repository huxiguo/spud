import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppBaseConfig } from './config/config.types'

@Controller()
export class AppController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    getHello(): string {
        const env = this.configService.get<AppBaseConfig['env']>('env')

        return `Siuuuuuuuu! The environment is ${env}`
    }
}
