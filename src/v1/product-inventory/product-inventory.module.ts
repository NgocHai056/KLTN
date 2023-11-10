import { Module } from '@nestjs/common';
import { ProductInventoryController } from './product-inventory.controller';
import { ProductInventoryService } from './product-inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductInventory, ProductInventorySchema } from './product-inventory.entity/product-inventory.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductInventory.name, schema: ProductInventorySchema }])
  ],
  controllers: [ProductInventoryController],
  providers: [ProductInventoryService]
})
export class ProductInventoryModule { }
