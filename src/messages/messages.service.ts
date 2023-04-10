import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { Message } from '../interfaces/message/message.interface';

@Injectable()
export class MessagesService {
  private messages: Message[] = [];

  async readFile(): Promise<Message[]> {
    const data = await fs.readFile('./src/messages/messages.json', 'utf-8');
    return JSON.parse(data);
  }

  async writeFile(data: Message[]): Promise<any> {
    try {
      await fs.writeFile('./src/messages/messages.json', JSON.stringify(data));
    } catch (err) {
      console.log(err);
      throw new Error('No se ha podido guardar');
    }
  }

  async getId() {
    let id = 1;
    const allMessages = await this.findAll();
    if (allMessages.length) {
      const ids = allMessages.map((message) => message.id);
      id = Math.max(...ids) + 1;
    }
    return id;
  }

  async create(item: Message) {
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
      console.log(`el mensaje no se ha podido guardar, ${err}`);
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return this.readFile();
    } catch (err) {
      console.log(err);
    }
  }

  async findById(id: number): Promise<Message> {
    try {
      const data = await fs.readFile('./src/messages/messages.json', 'utf-8');
      const parsedData = JSON.parse(data);
      const item = parsedData.find((item: Message) => item.id === id);
      if (!item) return {} as any;
      return item;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, item: Message): Promise<Message> {
    try {
      const data = await this.findAll();
      const oldItem = data.find((item: Message) => item.id === id);

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

  async delete(id: number): Promise<Message> {
    try {
      const data = await this.findAll();
      const oldItem = data.find((item: Message) => item.id === id);

      if (!oldItem) throw new Error('No se ha encontrado el elemento');

      const filteredData = data.filter((item) => item.id !== id);

      await this.writeFile(filteredData);

      return oldItem;
    } catch (err) {
      console.log(err);
    }
  }
}
