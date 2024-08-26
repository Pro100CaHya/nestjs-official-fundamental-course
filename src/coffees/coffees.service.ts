import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>
    ) {}

    async findAll() {
        return await this.coffeeRepository.find({
            relations: [
                "flavors"
            ]
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: {
                id: +id
            },
            relations: [
                "flavors"
            ]
        });

        if (!coffee) {
            throw new NotFoundException(`Coffee with id ${id} not found`);
        }

        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const coffee = this.coffeeRepository.create(createCoffeeDto);

        return await this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto
        });

        if (!coffee) {
            throw new NotFoundException(`Coffee with id ${id} not found`);
        }

        return await this.coffeeRepository.save(coffee);
    }

    async delete(id: string) {
        const coffee = await this.findOne(id);

        return await this.coffeeRepository.remove(coffee);
    }
}
