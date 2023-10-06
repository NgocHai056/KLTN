
export interface JwtTokenInterFace {
    jti: string
    iat: number
    sub: number
    exp: number
    user_id: string,
    jwt_token: string
}