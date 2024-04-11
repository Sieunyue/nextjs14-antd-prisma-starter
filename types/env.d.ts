declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string
    JWT_TOKEN_SECRET: string
    JWT_TOKEN_EXPIRE: number
  }
}
