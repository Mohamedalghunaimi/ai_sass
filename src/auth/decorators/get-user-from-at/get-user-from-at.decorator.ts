/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessPayload } from 'utils/type';

export const GetUserFromAt = createParamDecorator((
    data: unknown,
    context:ExecutionContext

)=> {
    const request : Request = context.switchToHttp().getRequest();
    const user = request.user as AccessPayload ;

    return user


})
