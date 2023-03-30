import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product/product.interface';
import fs from 'fs';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];

  async getId() {
    let id;
    const allProducts = await this.findAll();
    if (!allProducts.length) {
      id = 1;
    } else {
      const ids = allProducts.map((product) => product.id);
      id = Math.max(...ids) + 1;
    }
    return id;
  }

  async create(product: Product) {
    try {
      const id = this.getId();
      const productToUpload = {
        ...product,
        id,
        timestamp: Date.now(),
      };
      await fs.promises.appendFile(
        './products.json',
        JSON.stringify(productToUpload),
      );
      return productToUpload;
    } catch (err) {
      console.log(`el producto no se ha podido guardar, ${err}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const data = await fs.promises.readFile('./products.json', 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.log(err);
    }
  }
}
