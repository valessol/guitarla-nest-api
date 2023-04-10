import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product/product.interface';
import { promises as fs } from 'fs';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  async readFile(): Promise<Product[]> {
    const data = await fs.readFile('./src/products/products.json', 'utf-8');
    return JSON.parse(data);
  }

  async writeFile(data: Product[]): Promise<any> {
    try {
      await fs.writeFile('./src/products/products.json', JSON.stringify(data));
    } catch (err) {
      console.log(err);
      throw new Error('No se ha podido guardar');
    }
  }

  async getId(): Promise<number> {
    let id = 1;
    const allProducts = await this.findAll();
    if (allProducts.length) {
      const ids = allProducts.map((product) => product.id);
      id = Math.max(...ids) + 1;
    }
    return id;
  }

  async create(item: Product) {
    try {
      const id = await this.getId();
      const itemToUpload = {
        ...item,
        id,
        timestamp: Date.now(),
      };

      const allItems = await this.readFile();
      const newItems = [...allItems, itemToUpload];
      await this.writeFile(newItems);
      return itemToUpload;
    } catch (err) {
      console.log(`el producto no se ha podido guardar, ${err}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.readFile();
    } catch (err) {
      console.log(err);
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const data = await this.readFile();
      const item = data.find((item: Product) => item.id === id);
      if (!item) return {} as any;
      return item;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, item: Product): Promise<Product> {
    try {
      const data = await this.readFile();
      const oldItem = data.find((item: Product) => item.id === id);

      if (!oldItem) throw new Error('No se ha encontrado el elemento');

      const newItem = { ...oldItem, ...item };
      const filteredData = data.filter((item) => item.id !== id);
      const newData = [...filteredData, newItem];

      await this.writeFile(newData);

      return newItem;
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const data = await this.findAll();
      const oldItem = data.find((item: Product) => item.id === id);

      if (!oldItem) throw new Error('No se ha encontrado el elemento');

      const filteredData = data.filter((item) => item.id !== id);

      await this.writeFile(filteredData);

      return oldItem;
    } catch (err) {
      console.log(err);
    }
  }
}
