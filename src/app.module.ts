
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/post.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { ActivitiesModule } from './activities/activities.module';
import { RoutinesModule } from './routines/routines.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    EventsModule,
    ChatModule,
    ActivitiesModule,
    RoutinesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}