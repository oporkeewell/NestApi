import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  async all() {
    return this.userModel.find();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    const { username, name, password, role } = createUserDto;
    const hash = await bcrypt.hash(password, +process.env.SALT_ROUND);
    return await this.userModel.create({
      username,
      name,
      password: hash,
      role,
    });
  }
  async register(createUserDto: CreateUserDto) {
    const { username, password, confirmpassword } = createUserDto;
    if (password !== confirmpassword) {
      throw new HttpException(
        'confirm password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
    const chkdata = await this.findByUsername(username);
    if (chkdata) {
      throw new HttpException(
        'username is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.create(createUserDto);
    return { message: 'created successfully' };
  }

  async viewOrder(req: any) {
    const config = {
      headers: {
        Authorization: `${req.headers.authorization}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any[any]>(`${process.env.ORDER_API_URL}/order/me`, config)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return {
      payload: data.payload,
    };
  }
}
