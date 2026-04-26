/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller,  Post, Body, Res, UseGuards, Get, Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import express from "express"
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';
import { AtGuard } from './guards/at-guard/at-guard.guard';
import { GetUserFromAt, } from './decorators/get-user-from-at/get-user-from-at.decorator';
import * as type from 'utils/type';
import { RtGaurd } from './guards/rt-gurad/rt-gurad.guard';
import { GetUserFromRt } from './decorators/get-user-from-rt/get-user-from-rt.decorator';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register") 
  public async register(
    @Body() registerDto:RegisterDto,
    @Res({passthrough:true}) res:express.Response,
  ) {

    const {accessToken,refreshToken} = await this.authService.signUp(registerDto);
    this.setRefreshCookie(res,refreshToken)


    return {accessToken}
    
    
  }

  @Post("login")
  public async login(
    @Body() loginDto:LoginDto,
    @Res({passthrough:true}) res:express.Response,
  ) {
    const {accessToken,refreshToken} = await this.authService.signIn(loginDto);
    this.setRefreshCookie(res,refreshToken)

    return {accessToken}
  }
  @Post("logout")
  public async logout(
    @Req() req:express.Request,
    @Res({passthrough:true}) res:express.Response
  ) {
    const refreshToken = req.cookies?.refreshToken as string   ;
    if(!refreshToken) {
      throw new UnauthorizedException("unauthorized")
    }
    await this.authService.logout(refreshToken );
    res.clearCookie("refreshToken")
    return { success: true };
  }

  @Post("refresh")
  @UseGuards(RtGaurd)
  public async refresh(

    @Req() req:express.Request,
    @Res({passthrough:true}) res:express.Response

  ) {
    const refreshToken = req.cookies?.refreshToken as string   ;
    if(!refreshToken) {
      throw new UnauthorizedException("unauthorized")
    }
    const result = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res,refreshToken)


  return {
    accessToken:result.accessToken
  }



  }
private setRefreshCookie(res: express.Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

  
}
