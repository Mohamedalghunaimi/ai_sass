/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class AtGuard extends AuthGuard('at-jwt') {
    constructor(private reflector: Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride('is-public', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;
        return super.canActivate(context);
    }
}
