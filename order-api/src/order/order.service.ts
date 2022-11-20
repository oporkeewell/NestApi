import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { Order, OrderDocument } from 'src/model/order.model';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userid: string) {
    const { product } = createOrderDto;
    await this.orderModel.create({ userid, product });
    return { message: 'created successfully' };
  }

  async cancel(id: string) {
    const data = await this.orderModel.findByIdAndUpdate(
      id,
      { status: 2 },
      { new: true },
    );
    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'update successfully' };
  }
  async findById(id: any): Promise<Order> {
    return await this.orderModel.findById(id);
  }

  async viewById(id: any, req: any) {
    const dataOrder: OrderDocument = await this.orderModel.findById(id).exec();
    if (!dataOrder) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }
    const config = {
      headers: {
        Authorization: `${req.headers.authorization}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any[any]>(`${process.env.PRODUCT_API_URL}/product/`, config)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    const product = dataOrder.product.map((p) => {
      const dtl = data.payload.find((x: any) => `${x._id}` === `${p.id}`);
      const { name, price } = dtl;
      return {
        id: p.id,
        qty: p.qty,
        name,
        price,
      };
    });
    const payload = {
      _id: dataOrder._id,
      name: req.user.name,
      product,
      status: dataOrder.status,
    };
    return {
      payload,
    };
  }
  async viewByUser(req: any) {
    const dataOrder = await this.orderModel.find({ userid: req.user.id });
    if (!dataOrder) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }
    const config = {
      headers: {
        Authorization: `${req.headers.authorization}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any[any]>(`${process.env.PRODUCT_API_URL}/product/`, config)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    const payload = dataOrder.map((d: any) => {
      const product = d.product.map((p: any) => {
        const dtl = data.payload.find((x: any) => `${x._id}` === `${p.id}`);
        const { name, price } = dtl;
        return {
          id: p.id,
          qty: p.qty,
          name,
          price,
        };
      });
      return {
        _id: d._id,
        name: req.user.name,
        product,
        status: d.status,
      };
    });
    return {
      payload,
    };
  }
}
