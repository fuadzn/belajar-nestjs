import { Controller, Get, Post, Query, Param, Header, HttpCode, HttpRedirectResponse, Redirect, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('/api/users')
export class UserController {
    @Get('/set-cookie')
    setCookie(@Query('name') name: string, @Res() response: Response){
        response.cookie('name', name);
        response.status(200).send('Success set cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request): string{
        return request.cookies['name'];
    }

    @Get('/sample-response')
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    sampleResponse(): Record<string, string> {
        return ({
            data: 'Hello Json',
        });
    }

    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse {
        return {
            url: '/api/users/sample-response',
            statusCode: 301,
        }
    }

    @Get('/hello')
    async sayHello(
        @Query('first_name') firstName: string,
        @Query('last_name') lastName: string,
    ): Promise<string> {
        return `Hello ${firstName} ${lastName}`;
    }

    @Get('/:id')
    getById(@Param('id') id: string): string {
        return `GET ${id}`;
    }

    @Post()
    post(): string {
        return 'POST';
    }

    @Get('/sample')
    get(): string {
        return 'GET';
    }
}
