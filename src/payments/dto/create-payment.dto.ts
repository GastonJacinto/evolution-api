import { Currency } from 'mercadopago/shared/currency';

export class CreatePaymentDto {
  id: string;
  description: string;
  title: string;
  quantity: number;
  unit_price: number;
  image: string;
  currency_id: Currency;
  payer: {
    name: string;
    email: string;
    identification: {
      dni: string;
      number: string;
    };
  };
}
