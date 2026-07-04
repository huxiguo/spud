import type { NestExpressApplication } from '@nestjs/platform-express'

import { NestFactory } from '@nestjs/core'
import compression from 'compression'

import { AppModule } from './app.module'
import { BusinessExceptionFilter } from './common/business-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    app.useGlobalFilters(new BusinessExceptionFilter())

    app.use(compression({ filter: () => true, threshold: 0 }))

    app.useBodyParser('json', { limit: '10mb' })

    app.enableCors({ origin: true })

    const port = process.env.PORT ?? 3000
    await app.listen(port, '0.0.0.0')
    console.log(`API server running on http://0.0.0.0:${port}`)
}
bootstrap()
