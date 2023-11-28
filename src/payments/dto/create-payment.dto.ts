import { Currency } from 'mercadopago/shared/currency';

export class CreatePaymentDto {
  id: string;
  description: string;
  title: string;
  quantity: number;
  unit_price: number;
  image: string;
  currency_id: Currency;
  credits: number;
  payer: {
    name: string;
    surname: string;
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}
