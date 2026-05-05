import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomersService } from '../customers/customers.service';
import { Role } from './enums/role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.customersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const customer = await this.customersService.createInternal({
      ...dto,
      password: hashed,
      role: Role.USER,
    });

    const { password, ...result } = customer;
    return result;
  }

  async login(dto: LoginDto) {
    const customer = await this.customersService.findByEmail(dto.email);
    if (!customer) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, customer.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: customer.id, email: customer.email, role: customer.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}