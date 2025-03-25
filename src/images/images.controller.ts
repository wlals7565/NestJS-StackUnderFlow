import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    return this.imagesService.uploadFile(file, user.username);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  // 이거랑
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
