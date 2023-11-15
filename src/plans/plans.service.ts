/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto) {
    const newPlan = await this.planRepository.create(createPlanDto);
    return await this.planRepository.save(newPlan);
  }

  async findAllPlans() {
    const allPlans = await this.planRepository.find({
      order: {
        price: 'ASC',
      },
    });
    return allPlans;
  }

  async findOne(id: string) {
    const planFound = await this.planRepository.findOne({
      where: { id },
    });
    if (!planFound) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }
    return planFound;
  }

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
    const updatedPlan = await this.planRepository.update(id, updatePlanDto);
    return updatedPlan;
  }

  async removePlan(id: string) {
    try {
      const deletedPlan = await this.planRepository.delete(id);
      return {
        message: 'Plan borrado con éxito.',
      };
    } catch (error) {
      return {
        error,
      };
    }
  }
}
