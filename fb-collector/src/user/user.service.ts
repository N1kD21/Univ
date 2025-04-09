import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface UserDb {
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary';
  country: string;
  city: string;
  source: 'facebook';
}

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(data: UserDb) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { userId: data.userId },
    });

    if (!existingUser) {
      return await this.prismaService.user.create({ data });
    }
  }
}
