import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import BaseService from "src/base.service/base.service";
import { Member } from "./entities/member.entity";
import { MemberLevel } from "src/utils.common/utils.enum/member-level.enum";

@Injectable()
export class MemberService extends BaseService<Member> {
    constructor(
        @InjectModel(Member.name)
        private readonly memberRepository: Model<Member>,
    ) {
        super(memberRepository);
    }

    async updatePoint(userId: string, point: number, nameHistory: string) {
        let member = (await this.findByCondition({ user_id: userId })).pop();

        if (!member) {
            await this.create({
                user_id: userId,
                rating_point: point,
                consumption_point: point,
                point_history: [
                    {
                        name: nameHistory,
                        used_point: point,
                        day_trading: new Date(),
                    },
                ],
            });
            return;
        }

        member.rating_point += point;
        member.consumption_point += point;
        member.point_history.push({
            name: nameHistory,
            used_point: point,
            day_trading: new Date(),
        });

        member = await this.updateLevelMember(member);

        await this.update(member.id, member);
    }

    async updateLevelMember(member: Member) {
        if (
            member.rating_point >= 3500 &&
            member.level === MemberLevel.MEMBER
        ) {
            member.level = MemberLevel.VIP;
            member.is_gift = 1;
        } else if (
            member.rating_point >= 8000 &&
            member.level === MemberLevel.VIP
        ) {
            member.level = MemberLevel.DIAMOND;
            member.is_gift = 1;
        }

        return member;
    }
}
