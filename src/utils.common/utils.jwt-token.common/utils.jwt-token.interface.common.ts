
export interface JwtTokenInterFace {
    jti: string
    iat: number
    sub: number
    exp: number
    user_id: number,
    jwt_token: string
}