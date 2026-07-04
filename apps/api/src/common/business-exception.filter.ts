import type { Response } from 'express'

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'

/**
 * 业务异常过滤器 — 拦截所有未捕获的异常，统一转换为 { success, message } 格式返回。
 *
 * - HttpException（含 NestJS 内置异常如 UnauthorizedException 等）：提取其中的
 *   message 文本，保留原始 HTTP 状态码，返回 `{ success: false, message }`。
 * - 其他未知异常：记录完整错误日志，返回 HTTP 500 及通用错误信息，避免内部
 *   细节泄露到前端。
 */
@Catch()
export class BusinessExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(BusinessExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = '服务器内部错误'

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            message = this.extractMessage(exception.getResponse())
        } else if (exception instanceof Error) {
            this.logger.error(`未捕获异常: ${exception.message}`, exception.stack)
        } else {
            this.logger.error(`未知异常: ${String(exception)}`)
        }

        response.status(status).json({ success: false, message })
    }

    /**
     * 从 HttpException.getResponse() 的返回值中提取可读的错误消息。
     *
     * NestJS 内置异常的 response 可能为：
     * - 字符串（直接作为消息）
     * - 对象，如 `{ message: '...', statusCode: 401, error: 'Unauthorized' }`
     * - 对象，message 为字符串数组（validator pipe 多错误场景），用分号拼接
     */
    private extractMessage(exceptionResponse: string | object): string {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse
        }

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resp = exceptionResponse as Record<string, unknown>
            if (typeof resp.message === 'string') {
                return resp.message
            }
            if (Array.isArray(resp.message)) {
                return (resp.message as string[]).join('; ')
            }
        }

        return '服务器内部错误'
    }
}
