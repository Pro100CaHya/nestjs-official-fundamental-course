import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, SetMetadata } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IS_PUBLIC_KEY, Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Get()
    @Public()
    async findAll(@Protocol("https") protocol: string, @Query() paginationQuery: PaginationQueryDto) {
        console.log(protocol);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        console.log("Hi from coffee controller method")
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
