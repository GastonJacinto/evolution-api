/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import * as mercadopago from 'mercadopago';
import {
  CreatePreferencePayload,
  PreferenceBackUrl,
  PreferencePayer,
} from 'mercadopago/models/preferences/create-payload.model';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
@Injectable()
export class PaymentsService {
  async createPayment(req: CreatePaymentDto) {
    const client = new MercadoPagoConfig({
      accessToken: `${process.env.ACCESS_TOKEN_MP}`,
      options: { timeout: 5000 },
    });
    const localUrl = 'http://localhost:3000/profile';
    const preference = new mercadopago.Preference(client);
    const preferenceData: PreferenceCreateData = {
      body: {
        binary_mode: true,
        items: [
          {
            id: '',
            title: req.title,
            description: req.description,
            quantity: req.quantity,
            currency_id: req.currency_id,
            unit_price: req.unit_price,
            picture_url: req.image,
          },
        ],
        payer: {
          name: req.payer.name,
          email: req.payer.email,
        } as PreferencePayer,
        back_urls: {
          success: localUrl,
          failure: localUrl,
          pending: localUrl,
        } as PreferenceBackUrl,
        auto_return: 'approved',
      },
    };
    try {
      const { init_point } = await preference.create(preferenceData);
      return { init_point };
    } catch (error) {
      return { error: error.message };
    }
  }

  async paymentCreated(data) {
    return HttpStatus.OK;
  }
  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
