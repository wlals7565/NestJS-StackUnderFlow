import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImagesService {
  private readonly baseUploadPath = path.join(process.cwd(), 'assets');

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  async uploadFile(file: Express.Multer.File, username: string) {
    const uploadDir = path.join(this.baseUploadPath, 'images', username);
    const randomName = uuidv4();
    const [type, fileExtension] = file.mimetype.split('/');

    if (type !== 'image') {
      throw new BadRequestException('지원되지 않는 파일 형식입니다.');
    }

    const filePath = path.join(uploadDir, `${randomName}.${fileExtension}`);

    // 디렉토리 생성
    fs.mkdirSync(uploadDir, { recursive: true });

    // 파일 저장
    fs.writeFileSync(filePath, file.buffer);

    const fileRelativePath = path.join(
      'static',
      'images',
      username,
      `${randomName}.${fileExtension}`,
    );

    return { msg: 'ok', imagePath: fileRelativePath };
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
