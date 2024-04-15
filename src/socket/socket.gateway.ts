import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { ShowtimeResponse } from "src/v1/showtime/showtime.response/showtime.response";
import { ShowtimeService } from "src/v1/showtime/showtime.service";

@WebSocketGateway()
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(SocketGateway.name);

    @WebSocketServer() io: Server;

    constructor(private readonly showtimeService: ShowtimeService) {}

    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: any) {
        const { sockets } = this.io.sockets;

        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    @SubscribeMessage("showtime")
    async handleShowtime(client: any, payload: any) {
        const showtime = await this.showtimeService.find(payload.showtime_id);

        if (!showtime) return;

        const showtimeResponse = new ShowtimeResponse(showtime);

        showtimeResponse.mapArraySeat(showtime.seat_array);

        this.io.emit(showtime.id, showtimeResponse);
    }
}
