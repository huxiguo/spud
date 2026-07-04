export type DatabaseConfig = {
    host: string
    port: number
    user: string
    password: string
    databaseName: string
}

export type AppBaseConfig = {
    env: string
    appPort: number
    tokenSecret: string
    selfDatabase: DatabaseConfig
}
