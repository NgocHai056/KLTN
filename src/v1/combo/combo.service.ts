import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Combo } from './combo.entity/combo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { ComboDto } from './combo.dto/combo.dto';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { ComboType } from 'src/utils.common/utils.enum/combo-type.enum';
import { BookingComboDto } from '../booking/booking.dto/booking.dto';

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
            ...products.map(({ id, name, description, price }) => ({ id, name, description, price, type: ComboType.ITEM })),
            ...combos.map(({ id, name, description, price }) => ({ id, name, description, price, type: ComboType.COMBO }))
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

    async calculatePriceCombo(bookingComboDto: BookingComboDto[]) {

        const filteredCombos = bookingComboDto.filter(combo => combo.combo_type === ComboType.COMBO);

        const filteredItems = bookingComboDto.filter(item => item.combo_type === ComboType.ITEM);

        const comboMap = new Map(bookingComboDto.map(combo => [combo.combo_id, combo]));

        const comboDetails = (combos) => combos.map(({ id, name, description, price }) => ({
            name,
            description,
            price,
            quantity: comboMap.get(id).quantity,
        }));

        return [
            ...comboDetails(await this.findByIds(filteredCombos.flatMap(x => x.combo_id))),
            ...comboDetails(await this.productService.findByIds(filteredItems.flatMap(x => x.combo_id))),

        ];
    }
}