import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Member, MemberSchema } from "./entities/member.entity";
import { ExchangePointTempModule } from "../exchange-point-temp/exchange-point-temp.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Member.name, schema: MemberSchema },
        ]),
        ExchangePointTempModule,
    ],
    controllers: [MemberController],
    providers: [MemberService],
    exports: [MemberService],
})
export class MemberModule {}
