import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super();
        console.info('Create prisma service');
    }

    onModuleInit() {
        console.info('connect to prisma');
        this.$connect();
    }

    onModuleDestroy() {
        console.info('Destroy prisma service');
        this.$disconnect();
    }
}
