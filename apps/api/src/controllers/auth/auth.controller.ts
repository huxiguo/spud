import type { AuthContract } from '@spud/dto'

import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isNullOrEmptyString } from 'src/common/string-helper'
import { AuthGuard } from 'src/guards/auth.guard'
import { PrismaService } from 'src/services/prisma.service'
import { v7 as uuidv7 } from 'uuid'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 用户登录
     */
    @Post('login')
    async login(@Body() body: AuthContract.LoginRequest): Promise<AuthContract.LoginResponse> {
        // 逐项校验参数，所有校验失败都通过返回值表达，不抛异常
        if (isNullOrEmptyString(body.username)) {
            return { success: false, message: '用户名不能为空', data: null }
        }

        if (isNullOrEmptyString(body.password)) {
            return { success: false, message: '密码不能为空', data: null }
        }

        const id = uuidv7()

        const token = await this.jwtService.signAsync({
            id: id,
        })

        return {
            success: true,
            message: 'success',
            data: {
                id,
                token,
            },
        }
    }
}
