import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { MemberService } from "./member.service";

@Controller("member")
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post()
    create(@Body() createMemberDto: CreateMemberDto) {
        return this.memberService.create(createMemberDto);
    }

    @Get()
    findAll() {
        return this.memberService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.memberService.find(id);
    }

    @Post(":id/update")
    update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto) {
        return this.memberService.update(id, updateMemberDto);
    }
}
