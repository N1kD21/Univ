import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookUser, FacebookEngagement } from '../types/events';

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

  async createUser(data: {
    user: FacebookUser;
    engagement: FacebookEngagement;
  }) {
    const userData: UserDb = {
      userId: data.user.userId,
      name: data.user.name,
      age: data.user.age,
      gender:
        data.user.gender === 'non-binary' ? 'non_binary' : data.user.gender,
      country: data.user.location.country,
      city: data.user.location.city,
      source: 'facebook',
    };
    const existingUser = await this.prismaService.user.findUnique({
      where: { userId: userData.userId },
    });

    if (!existingUser) {
      return await this.prismaService.user.create({ data: userData });
    }
  }
}
