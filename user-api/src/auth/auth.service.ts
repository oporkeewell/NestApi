import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const data = await this.usersService.findByUsername(username);
    if (
      data &&
      (await this.usersService.comparePassword(pass, data.password))
    ) {
      return data;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      role: user?.role,
    };
    const token = this.jwtService.sign(payload);
    const expires_in: any = this.jwtService.decode(token);
    return {
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer',
    };
  }
}
