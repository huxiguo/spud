import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    /**
     * 从请求头提取 Bearer token 并验证 JWT
     *
     * 验证失败时抛出 UnauthorizedException，由全局 BusinessExceptionFilter 统一格式化为
     * `{ success: false, message }` 返回。验证通过后将 payload 挂载到 `request.user`。
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()

        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('未登录')
        }

        try {
            const payload = await this.jwtService.verifyAsync(token)
            request['user'] = payload
        } catch {
            throw new UnauthorizedException('登录已过期')
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}

export const Authorize = (value: string) => SetMetadata('auth', value)
