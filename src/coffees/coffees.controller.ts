import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.coffeeService.findOne("" + id);
    }

    @Get(":id/recommend")
    recommendCoffee(@Param("id") id: number) {
        return this.coffeeService.recommendCoffee(id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        (createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeeService.create(createCoffeeDto);
    }
    
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeeService.update(id, updateCoffeeDto);
    }

    @Delete(":id")
    delete(@Param("id") id: string,) {
        return this.coffeeService.delete(id);
    }
}
