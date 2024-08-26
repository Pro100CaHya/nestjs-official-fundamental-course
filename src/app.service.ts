import { Injectable } from '@nestjs/common';
import { CoffeesService } from './coffees/coffees.service';

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return `Hello World`
  }
}
