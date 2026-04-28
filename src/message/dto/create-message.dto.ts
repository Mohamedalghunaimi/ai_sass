import { IsNotEmpty, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateMessageDto {
    

    
    @IsString()
    @IsNotEmpty()
    content!:string
    
}
