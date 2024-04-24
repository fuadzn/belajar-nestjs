import { Controller, Get, Post, Query, Param, Header, HttpCode, HttpRedirectResponse, Redirect, Res, Req, Inject, Optional, UseFilters, HttpException, ParseIntPipe, Body, ValidationPipe, UsePipes, UseInterceptors, UseGuards } from '@nestjs/common';
import { Response, Request, response } from 'express';
import { title } from 'process';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';

@Controller('/api/users')
export class UserController {
    // @Inject()
    // @Optional()
    // private service: UserService
    constructor(
        private service: UserService,
        private connection: Connection,
        private mailService: MailService,
        @Inject('EmailService') private emailService: MailService,
        private userRepository: UserRepository,
        private memberService: MemberService
    ) { }

    @Get('/current')
    @UseGuards(RoleGuard)
    @Roles(['admin', 'operator'])
    current(@Auth() user: User): Record<string, any> {
        return {
            data: `Hello ${user.first_name} ${user.last_name}`
        }
    } 

    // @UsePipes(new ValidationPipe(loginUserRequestValidation))
    @UseFilters(ValidationFilter)
    @Post('/login')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(TimeInterceptor)
    login(@Query('name') name: string, @Body() request: LoginUserRequest) {
        return {
            data: `Hello ${request.username}`,
        };
    }

    @Get('/connection')
    async getConnection(): Promise<string> {
        // this.userRepository.save();
        this.mailService.send();
        this.emailService.send();

        console.info(this.memberService.getConnectionName());
        this.memberService.sendEmail();
        return this.connection.getName();
    }

    @Get('/create')
    async create(
        @Query('first_name') firstName: string,
        @Query('last_name') lastName: string,
    ): Promise<User> {
        if (!firstName) {
            throw new HttpException({
                code: 400,
                errors: 'First Name is required'
            }, 400)
        }
        return this.userRepository.save(firstName, lastName);
    }

    @Get('/hello')
    // @UseFilters(ValidationFilter)
    async sayHello(
        @Query('name') name: string,
    ): Promise<string> {
        return this.service.sayHello(name);
    }

    @Get('/view/hello')
    viewHello(@Query('name') name: string, @Res() response: Response) {
        response.render('index.html', {
            title: 'Template Engine',
            name: name
        })
    }

    @Get('/set-cookie')
    setCookie(@Query('name') name: string, @Res() response: Response) {
        response.cookie('name', name);
        response.status(200).send('Success set cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request): string {
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

    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number): string {
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
