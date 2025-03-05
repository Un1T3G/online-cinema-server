import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'core/prisma/prisma.module';
import { ActorsModule } from 'modules/actors/actors.module';
import { AuthModule } from 'modules/auth/auth.module';
import { FilesModule } from 'modules/files/files.module';
import { GenresModule } from 'modules/genres/genres.module';
import { MoviesModule } from 'modules/movies/movies.module';
import { PaymentsModule } from 'modules/payments/payments.module';
import { ReviewsModule } from 'modules/reviews/reviews.module';
import { StatisticsModule } from 'modules/statistics/statistics.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ActorsModule,
    GenresModule,
    ReviewsModule,
    MoviesModule,
    FilesModule,
    StatisticsModule,
    PaymentsModule,
  ],
})
export class CoreModule {}
