import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import BaseService from "src/base.service/base.service";
import { Member } from "./entities/member.entity";
import { MemberLevel } from "src/utils.common/utils.enum/member-level.enum";
import { SeatType } from "src/utils.common/utils.enum/seat-type.enum";
import { SeatPoint } from "src/utils.common/utils.enum/exchange-point.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ExchangePointTempService } from "../exchange-point-temp/exchange-point-temp.service";
import { Booking } from "../booking/booking.entity/booking.entity";

@Injectable()
export class MemberService extends BaseService<Member> {
    constructor(
        @InjectModel(Member.name)
        private readonly memberRepository: Model<Member>,
        private readonly exchangePointService: ExchangePointTempService,
    ) {
        super(memberRepository);
    }

    async usePoint(booking: Booking, seats, combos) {
        const member = (
            await this.findByCondition({ user_id: booking.user_id })
        ).pop();

        if (!member)
            UtilsExceptionMessageCommon.showMessageError(
                "You don't have points to redeem yet.",
            );

        let totalPoint: number = 0;
        let totalPriceUsed: number = 0;

        seats.forEach((seat) => {
            if (seat.seat_type === SeatType.NORMAL)
                totalPoint += SeatPoint.NORMAL;
            else if (seat.seat_type === SeatType.DOUBLE)
                totalPoint += SeatPoint.DOUBLE;

            totalPriceUsed += seat.price;
        });

        combos.forEach((combo) => {
            totalPoint += combo.exchange_point * combo.quantity;
            totalPriceUsed += combo.price * combo.quantity;
        });

        if (totalPoint > member.consumption_point)
            UtilsExceptionMessageCommon.showMessageError(
                "The number of converted points is less than your number of points!",
            );

        if (booking.total_amount - totalPriceUsed < 5000)
            UtilsExceptionMessageCommon.showMessageError(
                "Invalid transaction amount. Valid amount must be greater than 5,000 VNĐ",
            );

        this.exchangePointService.create({
            user_id: booking.user_id,
            theater_name: booking.theater_name,
            movie_id: booking.movie_id,
            used_point: totalPoint,
            point_history_name: booking.code,
            seats: seats,
            combos: combos,
            expireAt: new Date(),
        });

        return totalPriceUsed;
    }

    async minusPoint(userId: string, movieId: string) {
        const exchangePoint = (
            await this.exchangePointService.findByCondition({
                user_id: userId,
                movie_id: movieId,
            })
        ).pop();

        if (!exchangePoint) return;

        await this.updatePoint(
            userId,
            -exchangePoint.used_point,
            exchangePoint.point_history_name,
            exchangePoint.seats,
            exchangePoint.combos,
        );

        const seats = exchangePoint.seats;
        const combos = exchangePoint.combos;

        this.exchangePointService.delete(exchangePoint.id);

        return { seats, combos };
    }

    async updatePoint(
        userId: string,
        point: number,
        nameHistory: string,
        seats,
        combos,
    ) {
        let member = (await this.findByCondition({ user_id: userId })).pop();

        if (!member) {
            await this.create({
                user_id: userId,
                rating_point: Math.round(point * 0.05),
                consumption_point: Math.round(point * 0.05),
                point_history: [
                    {
                        name: nameHistory,
                        seats,
                        combos,
                        used_point: Math.round(point * 0.05),
                        day_trading: new Date(),
                    },
                ],
            });
            return;
        }

        if (point > 0) {
            if (member.level === MemberLevel.MEMBER)
                point = Math.round(point * 0.05);
            else if (member.level === MemberLevel.VIP)
                point = Math.round(point * 0.07);
            else if (member.level === MemberLevel.DIAMOND)
                point = Math.round(point * 0.1);
        }

        member.rating_point += point > 0 ? point : 0;
        member.consumption_point += point;
        member.point_history.push({
            name: nameHistory,
            seats,
            combos,
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
