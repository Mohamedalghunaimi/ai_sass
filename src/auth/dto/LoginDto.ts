/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString,  MinLength} from "class-validator"

export class LoginDto {

    

    @IsString()
    @IsNotEmpty()
    email!:string


    @IsString()
    @IsNotEmpty()

    @MinLength(8)
    password!:string
}