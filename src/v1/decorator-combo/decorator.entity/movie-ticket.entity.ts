
export class MovieTicket {
    constructor(private movieName: string, private price: number) { }

    getDescription(): string {
        return this.movieName;
    }

    getPrice(): number {
        return this.price;
    }
}