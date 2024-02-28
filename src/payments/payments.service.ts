/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  HttpStatus,
  forwardRef,
  Inject,
  Injectable,
  HttpException,
} from '@nestjs/common';
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
import { UsersService } from 'src/users/users.service';
@Injectable()
export class PaymentsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createPayment(req: CreatePaymentDto) {
    const client = new MercadoPagoConfig({
      accessToken: `${process.env.ACCESS_TOKEN_MP}`,
      options: { timeout: 5000 },
    });
    const returnUrl = 'http://localhost:3000/profile';
    // const returnUrl = 'https://evolution-client.vercel.app/profile';
    const preference = new mercadopago.Preference(client);
    const preferenceData: PreferenceCreateData = {
      body: {
        binary_mode: true,
        items: [
          {
            id: req.id,
            title: req.title,
            description: req.description,
            quantity: req.quantity,
            currency_id: req.currency_id,
            unit_price: req.unit_price,
            picture_url: req.image,
          },
        ],
        payer: {
          first_name: req.payer.name,
          last_name: req.payer.surname,
          email: req.payer.email,
          identification: {
            type: req.payer.identification.type,
            number: req.payer.identification.number,
          },
        } as PreferencePayer,
        additional_info: `User ${req.payer.identification.number}`,
        back_urls: {
          success: returnUrl,
          failure: returnUrl,
          pending: returnUrl,
        } as PreferenceBackUrl,
        auto_return: 'approved',
        external_reference: `User ${req.payer.identification.number}/Credits ${req.credits}`,
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
    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${data.data.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`,
          },
        },
      );
      const paymentData = await response.json();

      if (paymentData.status === 'approved') {
        //Hago split() a la propiedad external_reference donde viene el ID del usuario y los creditos a agregar.
        const creditsPart = paymentData.external_reference.split('/')[1];
        const userIdPart = paymentData.external_reference.split('/')[0];
        //Obtengo los datos y ejecuto la función para agregar los créditos al usuario.
        const credits = creditsPart.split(' ')[1];
        const userId = userIdPart.split(' ')[1];
        await this.usersService.addRemainingClasses(userId, +credits);
      }
      return HttpStatus.OK;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
  async findAll(userDNI: string) {
    const userFound = await this.usersService.findWithDni(userDNI);
    return userFound;
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
