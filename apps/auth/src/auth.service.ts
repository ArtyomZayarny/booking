import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    //Create token payload
    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    //set exp date for token
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    // Generate token
    const token = this.jwtService.sign(tokenPayload);

    //Set token to cookie
    response.cookie('Authorization', token, {
      httpOnly: true,
      expires,
    });
  }
}
