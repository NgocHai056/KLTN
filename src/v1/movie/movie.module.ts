import { Module, forwardRef } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { Movie, MovieSchema } from "./movie.entity/movie.entity";
import { GenreModule } from "../genre/genre.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FirebaseModule } from "src/firebase/firebase.module";
import { ShowtimeModule } from "../showtime/showtime.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
        GenreModule,
        forwardRef(() => ShowtimeModule),
        FirebaseModule,
        NotificationModule,
    ],
    providers: [MovieService],
    controllers: [MovieController],
    exports: [MovieService],
})
export class MovieModule {}
