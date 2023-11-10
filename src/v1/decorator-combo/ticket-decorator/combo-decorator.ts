import { MovieTicket } from "../decorator.entity/movie-ticket.entity";
import { TicketDecorator } from "./ticket-decorator";

export class ComboDecorator extends TicketDecorator {

    constructor(movieTicket: MovieTicket, private itemPrice: number) {
        super(movieTicket);
    }

    public getPrice(): number {
        return this.movieTicket.getPrice() + this.itemPrice;
    }

}