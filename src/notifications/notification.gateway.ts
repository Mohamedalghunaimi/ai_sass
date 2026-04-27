/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,  WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "@prisma/client";
import { Server, Socket } from 'socket.io';
@WebSocketGateway(
    {
        cors:{
            origin:"*"
        }
    }
)
export class NotificationGateway implements OnGatewayConnection,OnGatewayInit,OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    handleDisconnect(client: Socket) {
        console.log(`socket ${client.id} is not connected`);

    }
    afterInit(server: Server) {
        console.log(server)

    }
    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if(userId) {
            client.join(`user-${userId}`)
        }


    }

    sendToUser(userId: string, data: Notification) {
        this.server.to(`user-${userId}`).emit('notification', data);
    }

}