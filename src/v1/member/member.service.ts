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
                "Point exchange failed",
            );

        let totalPoint: number = 0;
        let totalPriceUsed: number = 0;

        const seatData = seats.map((seat) => {
            if (seat.seat_type === SeatType.NORMAL)
                totalPoint += SeatPoint.NORMAL;
            else if (seat.seat_type === SeatType.DOUBLE)
                totalPoint += SeatPoint.DOUBLE;

            totalPriceUsed += seat.price;

            return { seat_number: seat.seat_number };
        });

        const comboData = combos.map((combo) => {
            totalPoint += combo.exchange_point * combo.quantity;
            totalPriceUsed += combo.price;

            return { name: combo.name, quantity: combo.quantity };
        });

        if (totalPoint > member.consumption_point)
            UtilsExceptionMessageCommon.showMessageError(
                "Point exchange failed",
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
            point_history: JSON.stringify([...seatData, ...comboData]),
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
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

        this.updatePoint(
            userId,
            -exchangePoint.used_point,
            exchangePoint.point_history,
        );

        this.exchangePointService.delete(exchangePoint.id);
    }

    async updatePoint(userId: string, point: number, nameHistory: string) {
        let member = (await this.findByCondition({ user_id: userId })).pop();

        if (!member) {
            await this.create({
                user_id: userId,
                rating_point: Math.abs(point),
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

        member.rating_point += point > 0 ? point : 0;
        member.consumption_point += point;
        member.point_history.push({
            name: nameHistory,
            used_point: point,
            day_trading: new Date(),
        });

        member = await this.updateLevelMember(member);

        this.update(member.id, member);
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
