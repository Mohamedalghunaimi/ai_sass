/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Transform } from "class-transformer"
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator"

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(25)
    name!:string
    

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({value}:{value:string}):string=>value.trim())
    email!:string


    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
        'Password must contain at least one letter and one number',
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        {
        message:
            'Password must contain uppercase, lowercase, number and special character',
        },
    )
    @MinLength(8)
    password!:string
}