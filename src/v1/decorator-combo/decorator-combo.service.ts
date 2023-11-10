import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ComboService } from '../combo/combo.service';

@Injectable()
export class DecoratorComboService {
    constructor(
        private readonly productService: ProductService,
        private readonly comboService: ComboService
    ) { }

}
