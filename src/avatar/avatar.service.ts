import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class AvatarService {
  private avatarDir = path.join(__dirname, '..', '..', 'assets', 'images'); // 저장 폴더 설정

  constructor() {
    if (!fs.existsSync(this.avatarDir)) {
      fs.mkdirSync(this.avatarDir); // 폴더가 없으면 생성
    }
  }

  async downloadGravatar(
    email: string,
    username: string,
  ): Promise<string | null> {
    const hash = crypto
      .createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex');
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

    try {
      const response = await axios.get(gravatarUrl, {
        responseType: 'arraybuffer',
      });

      // 파일 이름 바꾸자.
      const fileName = `default.png`;
      const userDir = path.join(this.avatarDir, username);

      // 폴더가 존재하지 않으면 생성
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, response.data);

      console.log(`Gravatar saved: ${filePath}`);
      return fileName;
    } catch (error) {
      console.error('Failed to download Gravatar:', error);
      return null;
    }
  }
}
