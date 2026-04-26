/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessPayload } from 'utils/type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
    constructor(config: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get<string>('AT_SECRET') as string,
    });
    }

    validate(payload: AccessPayload) {
        return payload;
    }

}