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
    console.log('uploadImage');
    const username = user.username;
    // 파일 저장을 위한 디렉토리 경로 설정
    const uploadDir = path.join(process.cwd(), 'assets', username); // process.cwd() 사용
    const randomName = uuidv4();

    // MIME 타입에 맞는 확장자 매핑
    console.log(file.mimetype);
    const [type, fileExtension] = file.mimetype.split('/');
    if (type !== 'image') {
      throw new BadRequestException('지원되지 않는 파일 형식입니다.');
    }

    // 파일 경로
    const filePath = path.join(uploadDir, `${randomName}${fileExtension}`);

    // 폴더가 없으면 생성 (중간 폴더도 생성)
    fs.mkdirSync(uploadDir, { recursive: true });

    // 메모리에서 파일을 디스크에 저장
    fs.writeFileSync(filePath, file.buffer);

    const fileRelativePath = path.join(
      'static',
      username,
      `${randomName}${fileExtension}`,
    );

    return { msg: 'ok', imagePath: fileRelativePath }; // 저장된 파일 경로 반환
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
