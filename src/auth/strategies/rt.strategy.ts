/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import {  Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshPayload } from 'utils/type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                const cookies = req.cookies as Record<string, string>;
                const token = req.headers.authorization?.split(" ")[1] || cookies?.refreshToken  ;
                return token as string | null;
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("RT_SECRET") as string,
        });
    }

    validate(payload: RefreshPayload) {
        return payload;
    }

}