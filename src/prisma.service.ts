import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // FIX: The error "Property 'on' does not exist on type 'Process'" suggests a typing issue.
    // Using Prisma's built-in '$on' for shutdown hooks is the recommended practice and avoids this conflict.
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}