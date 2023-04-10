import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from '../dtos/create-message.dto';
import { Message } from 'src/interfaces/message/message.interface';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: MessageDto) {
    this.messagesService.create(createMessageDto);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findById(Number(id));
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() createMessageDto: MessageDto,
  ): Promise<Message> {
    return this.messagesService.update(Number(id), createMessageDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<Message> {
    return this.messagesService.delete(Number(id));
  }
}
