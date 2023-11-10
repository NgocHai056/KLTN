import { MovieTicket } from "../decorator.entity/movie-ticket.entity";

export abstract class TicketDecorator {
    protected movieTicket: MovieTicket;

    public TicketDecorator(movieTicket: MovieTicket) {
        this.movieTicket = movieTicket;
    }

    public abstract getPrice(): number;
}
