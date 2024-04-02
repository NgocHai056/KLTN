import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UserModel } from "../user/user.entity/user.model";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { MemberService } from "./member.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/member" })
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post()
    create(@Body() createMemberDto: CreateMemberDto) {
        return this.memberService.create(createMemberDto);
    }

    @Get()
    @ApiOperation({ summary: "API get member history by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @GetUser() user: UserModel,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const member = (
            await this.memberService.findByCondition({
                user_id: user.id,
            })
        ).pop();

        if (!member)
            UtilsExceptionMessageCommon.showMessageError(
                "You don't have membership points yet.",
            );

        const pointHistory = member.point_history.slice(
            +pagination.page - 1,
            10,
        );

        response.setData({ ...member.toJSON(), point_history: pointHistory });

        return res.status(HttpStatus.OK).send(response);
    }

    @Post(":id/update")
    update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto) {
        return this.memberService.update(id, updateMemberDto);
    }
}
