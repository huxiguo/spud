import type { AppBaseConfig } from './config.types'

export default (): AppBaseConfig => ({
    env: 'staging',
    appPort: 3000,
    tokenSecret: 'wudujiao-staging-jwt-secret-key',
    selfDatabase: {
        host: '127.0.0.1',
        port: 3333,
        user: 'root',
        password: '123456',
        databaseName: 'siu',
    },
})
