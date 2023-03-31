import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getFilteredProducts(
    filterProductDTO: FilterProductDTO,
  ): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      );
    }

    // TODO: Implementar categorías para productos
    if (category) {
      products = products.filter((product) => product.description === category);
      // products = products.filter((product) => product.categoty === category);
    }

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(createProductDTO: CreateProductDto): Promise<Product> {
    const newProduct = await this.productModel.create(createProductDTO);
    return newProduct.save();
  }

  async updateProduct(
    id: string,
    createProductDTO: CreateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDTO,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }

  // async getId() {
  //   let id;
  //   const allProducts = await this.getAllProducts();
  //   if (!allProducts.length) {
  //     id = 1;
  //   } else {
  //     const ids = allProducts.map((product) => product._id);
  //     id = Math.max(...ids) + 1;
  //   }
  //   return id;
  // }

  // async create(product: IProduct) {
  //   try {
  //     const id = this.getId();
  //     const productToUpload = {
  //       ...product,
  //       id,
  //       timestamp: Date.now(),
  //     };
  //     await fs.promises.appendFile(
  //       './products.json',
  //       JSON.stringify(productToUpload),
  //     );
  //     return productToUpload;
  //   } catch (err) {
  //     console.log(`el producto no se ha podido guardar, ${err}`);
  //   }
  // }

  // async findAll(): Promise<IProduct[]> {
  //   try {
  //     const data = await fs.promises.readFile('./products.json', 'utf-8');
  //     return JSON.parse(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}
