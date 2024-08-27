import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService } from '@nestjs/config';

@Injectable({
    scope: Scope.REQUEST
})
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async findAll(paginationQuery: PaginationQueryDto) {
        const {
            limit,
            offset
        } = paginationQuery;

        return await this.coffeeRepository.find({
            relations: [
                "flavors"
            ],
            skip: offset,
            take: limit,
            order: {
                id: "ASC"
            }
        });
    }

    async findOne(id: string) {
        console.log("Hi from coffee service method")
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
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name))
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        });

        return await this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && (await Promise.all(
            updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name))
        ));

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });

        if (!coffee) {
            throw new NotFoundException(`Coffee with id ${id} not found`);
        }

        await this.coffeeRepository.save(coffee);

        return await this.findOne(id);
    }

    async delete(id: string) {
        const coffee = await this.findOne(id);

        return await this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        const coffee = await this.findOne("" + id);

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new Event();

            recommendEvent.name = "recommend_coffee";
            recommendEvent.type = "coffee";
            recommendEvent.payload = {
                coffeeId: coffee.id
            };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();

            return await this.findOne("" + id);
        } catch (error) {
            console.log(error);

            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({
            where: {
                name
            }
        });

        if (existingFlavor) {
            return existingFlavor;
        }

        return this.flavorRepository.create({
            name
        })
    }
}
