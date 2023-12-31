import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/createPreference')
  async createPreference(@Body() req: CreatePaymentDto) {
    return this.paymentsService.createPayment(req);
  }
  @Post('paymentCreated')
  async paymentCreated(@Body() data) {
    return this.paymentsService.paymentCreated(data);
  }
  @Get(':userDNI')
  findAll(@Param('userDNI') userDNI: string) {
    return this.paymentsService.findAll(userDNI);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
