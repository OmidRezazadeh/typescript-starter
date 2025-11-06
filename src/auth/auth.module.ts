import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}

