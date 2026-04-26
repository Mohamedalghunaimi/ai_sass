/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshPayload } from 'utils/type';

export const GetUserFromRt = createParamDecorator((
    data: keyof RefreshPayload | undefined,
    context:ExecutionContext

)=> {
    const request : Request = context.switchToHttp().getRequest();
    const user = request.user as RefreshPayload ;
    if(data) {
        return user[data]
    }
    return user


})
