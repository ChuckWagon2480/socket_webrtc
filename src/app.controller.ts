import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('home')
  home() {
    return;
  }

  @Get('/chat')
  @Render('chat')
  chat() {
    return;
  }

  @Get('/video')
  @Render('video')
  video() {
    return;
  }
}
