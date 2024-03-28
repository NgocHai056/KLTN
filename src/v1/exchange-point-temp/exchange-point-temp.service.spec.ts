import { Test, TestingModule } from "@nestjs/testing";
import { ExchangePointTempService } from "./exchange-point-temp.service";

describe("ExchangePointTempService", () => {
    let service: ExchangePointTempService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ExchangePointTempService],
        }).compile();

        service = module.get<ExchangePointTempService>(
            ExchangePointTempService,
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
