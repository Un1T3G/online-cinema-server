import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'shared/decorators/auth.decorator';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post()
  @Auth('admin')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.fileService.saveFiles([file], folder);
  }

  @Post('avatar')
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.saveFiles([file], 'avatar');
  }
}
