import type { AppBaseConfig } from './config.types'

export default (): AppBaseConfig => ({
    env: 'production',
    appPort: 3000,
    tokenSecret: 'pqksncedcijn777lll',
    selfDatabase: {
        host: '127.0.0.1',
        port: 3333,
        user: 'root',
        password: '123456',
        databaseName: 'siu',
    },
})
