import { Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { DataSource } from 'typeorm';

class MockCoffeesService {
    findAll() {
        return [
          { id: 1, name: 'Mock Coffee', flavors: [] },
          { id: 2, name: 'Another Mock Coffee', flavors: [] },
        ];
      }
    
      findOne(id: string) {
        return { id: +id, name: `Mock Coffee ${id}`, flavors: [] };
      }
    
      create(createCoffeeDto) {
        return { id: Math.floor(Math.random() * 1000), ...createCoffeeDto };
      }
    
      update(id: string, updateCoffeeDto) {
        return { id: +id, ...updateCoffeeDto };
      }
    
      delete(id: string) {
        return { id: +id, deleted: true };
      }
}

@Module({
    controllers: [CoffeesController],
    providers: [
      CoffeesService,
      {
        provide: COFFEE_BRANDS,
        useFactory: async (dataSource: DataSource): Promise<string[]> => {
          const coffeeBrands = await Promise.resolve(["buddy brew", "nescafe"]);

          return coffeeBrands;
        },
        scope: Scope.TRANSIENT
      }
    ],
    imports: [TypeOrmModule.forFeature([
        Coffee,
        Flavor,
        Event
    ])],
    exports: [
      CoffeesService
    ]
})
export class CoffeesModule {}
