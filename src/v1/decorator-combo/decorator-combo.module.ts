import { Module } from '@nestjs/common';
import { DecoratorComboService } from './decorator-combo.service';
import { ProductModule } from '../product/product.module';
import { ComboModule } from '../combo/combo.module';

@Module({
    imports: [
        ProductModule,
        ComboModule
    ],
    providers: [DecoratorComboService],
    exports: [DecoratorComboService]
})
export class DecoratorComboModule { }
