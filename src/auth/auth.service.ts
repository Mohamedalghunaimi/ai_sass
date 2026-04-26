/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable,  UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from "bcryptjs"
import { AccessPayload, RefreshPayload } from 'utils/type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/LoginDto';
import { Session, User } from '@prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma:PrismaService,
    private readonly jwt:JwtService,
    private readonly config:ConfigService

  ) {}

  public async signUp({email,name,password}:RegisterDto) {

    const existingUser = await this.prisma.user.findUnique({
      where:{email},
      select:{
        id:true,
      }
    });
    if(existingUser) {
      throw new BadRequestException("user is already exist")
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await this.prisma.user.create({
      data:{
        password:hashedPassword,
        email,
        name
      }
    })


    const result = await this.issueAuth(user)
    return result ;

  }
  public async signIn({email,password}:LoginDto) {
    const user = await this.prisma.user.findUnique({
      where:{
        email
      },
    })
    if(!user) {
      throw new UnauthorizedException("invalid inputs")
    }
    const isMatch = await bcrypt.compare(password,user.password as string);
    if(!isMatch) {
      throw new UnauthorizedException("invalid inputs")
    }

    const result = await this.issueAuth(user)
    return result ;

  }

  public async logout(refreshToken:string) {

    try {
    const payload:RefreshPayload = await this.jwt.verifyAsync(refreshToken,{
      secret:this.config.get<string>("RT_SECRET")
    });
    const {sessionId} = payload ;

    const existingSession = await this.verifyRefreshToken(sessionId,refreshToken)

    await this.prisma.session.update({
      where:{id:existingSession.id},
      data:{revoked:true}
    })

    return true
    } catch (error) {
      console.error(error)
      throw new UnauthorizedException();
      
    }
    
  }

  public async refresh(refreshToken:string) {

    try {
    const payload:RefreshPayload = await this.jwt.verifyAsync(
      refreshToken,
      {
        secret:this.config.get<string>("RT_SECRET")
      }
    );
    const {sessionId,id,name} = payload ;
    await this.verifyRefreshToken(sessionId,refreshToken)


    const newAccessToken = await this.generateAccessToken({id,name});
    const newRefreshToken = await this.generateRefreshToken({id,name,sessionId});
    await this.updateRefreshToken(sessionId,id,newRefreshToken);

    

    return {
      accessToken:newAccessToken,
      refreshToken:newRefreshToken
    }
    
    
    


    } catch (error) {
      console.error(error)
      throw new UnauthorizedException()
    }



  }

  private async verifyRefreshToken(sessionId:string,refreshToken:string) {
    const existingSession = await this.prisma.session.findFirst({
      where:{id:sessionId,revoked:false},
      select:{id:true,hashRefreshToken:true}
    });
    if(!existingSession) {
      throw new UnauthorizedException("session is denied")
    }
    const isMatch = await bcrypt.compare(refreshToken,existingSession.hashRefreshToken);
    if(!isMatch) {
      throw new UnauthorizedException("session is denied")
    }

    return existingSession
  }



  private async generateAccessToken (payload:AccessPayload) {

    const accessToken = await this.jwt.signAsync(payload,{
        secret: this.config.get<string>("AT_SECRET"),
        expiresIn:"15m"
    });

    return accessToken
    
  } 

  private async generateRefreshToken(payload:RefreshPayload) {
   const refreshToken = await this.jwt.signAsync(payload,{
        secret: this.config.get<string>("RT_SECRET"),
        expiresIn:"7d"
    });

    return refreshToken
    

  }

  private async createSession(userId:string) : Promise<Session>{
        const session = await this.prisma.session.create({
          data: {
            userId,
            hashRefreshToken: "", 
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        });
        return session
  }


  private async updateRefreshToken(id:string,userId:string,refreshToken:string) {
    const hashRefreshToken = await bcrypt.hash(refreshToken,10);
    await this.prisma.session.update({
      where:{id},
      data:{
        hashRefreshToken,
        userId,
        expiresAt:new Date(Date.now() + 1000*60*60*24*7)
      }
    })
  }

  private async issueAuth(user:User) {
    const session = await this.createSession(user.id)
    const accessToken = await this.generateAccessToken({id:user.id,name:user.name});
    const refreshToken = await this.generateRefreshToken({id:user.id,name:user.name,sessionId:session.id})
    await this.updateRefreshToken(session.id,user.id,refreshToken)

    return {accessToken,refreshToken}
  }


}
  
