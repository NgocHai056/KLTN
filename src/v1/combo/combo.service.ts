import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Combo } from './combo.entity/combo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { ComboDto } from './combo.dto/combo.dto';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { ComboType } from 'src/utils.common/utils.enum/combo-type.enum';

@Injectable()
export class ComboService extends BaseService<Combo> {
    constructor(
        private readonly productService: ProductService,
        @InjectModel(Combo.name) private readonly comboRepository: Model<Combo>
    ) {
        super(comboRepository);
    }

    async getCombo() {
        const products = await this.productService.findAll();

        const combos = await this.findAll();

        return [
            ...products.map(({ _id, name, description, price }) => ({ _id, name, description, price, type: ComboType.ITEM })),
            ...combos.map(({ _id, name, description, price }) => ({ _id, name, description, price, type: ComboType.COMBO }))
        ]
    }

    async creaetCombo(comboDto: ComboDto) {
        const products = await this.productService.findByIds(comboDto.combo_items.flatMap(product => product.product_id));

        if (products.length !== comboDto.combo_items.length)
            UtilsExceptionMessageCommon.showMessageError("Create combo failed!");

        let name: string;
        let description: string;

        const comboMap = {};
        comboDto.combo_items.forEach(combo => {
            comboMap[combo.product_id] = combo.quantity;
        })

        /** Map name and description base on name and quantity of request */
        products.forEach(product => {
            name = name ? (name + ' + ' + product.name) : product.name;
            description = description ? (description + ', ' + comboMap[product.id] + ' ' + product.name) : comboMap[product.id] + ' ' + product.name;
        });

        const data = { name, description, ...comboDto };

        return await this.create(data);
    }
}