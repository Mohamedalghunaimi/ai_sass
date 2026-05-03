/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,  WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "@prisma/client";
import { Server, Socket } from 'socket.io';
import { AccessPayload } from "utils/type";
@WebSocketGateway(
    {
        cors:{
            origin:"*"
        }
    }
)
export class NotificationGateway implements OnGatewayConnection,OnGatewayInit,OnGatewayDisconnect {

    constructor(
        private readonly jwt:JwtService,
        private readonly config:ConfigService
    ) {}
    @WebSocketServer()
    server!: Server;

    handleDisconnect(client: Socket) {
        console.log(`socket ${client.id} is not connected`);

    }
    afterInit(server: Server) {
    server.use(async(socket, next) => {
        const token = socket.handshake.auth.token; 
        if (!token) {
            return next(new Error('Unauthorized: No token provided'));
        }
        
        try {


            const payload = await this.jwt.verifyAsync<AccessPayload>(
                token,
                {
                    secret: this.config.get<string>('AT_SECRET')
                }
            )

            socket.data.userId = payload.id;


            next();
        } catch (err) {
            console.error(err)
            next(new Error('Unauthorized: Invalid token'));
        }
    })

    
    }
    handleConnection(client: Socket) {
        const userId = client.data.userId as string;
        if(userId) {
            client.join(`user-${userId}`)
        }


    }

    sendToUser(userId: string, data: Notification) {
        this.server.to(`user-${userId}`).emit('notification', data);
    
    }

}

/*
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "YOUR_JWT_TOKEN" // التوكن عشان الـ Middleware يوافق عليك
  },

});

// اسمع لإشعارات الحالة (الـ AI بيفكر)
socket.on('ai_status', (data) => {
    console.log(`Job ${data.jobId} is ${data.status}`); 
    // هنا تظهر Spinner أو كلمة "AI is thinking..."
});

// اسمع للإشعار النهائي (النتيجة وصلت)
socket.on('notification', (notification) => {
    console.log("New Notification:", notification);
    // هنا تشيل الـ Spinner وتحدث لستة الرسائل أو تظهر Alert
});
*/