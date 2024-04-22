import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermanentLiquidDTO } from 'sharedlib/dto/liquid.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async getProtocols() {
    return await this.prisma.protocol.findMany({
      where: {
        deleted: false,
      },
      include: {
        creator: true,
      },
    });
  }

  async getProtocolById(id: number) {
    return await this.prisma.protocol.findUnique({
      where: { id },
      include: {
        creator: true,
        defaultWashing: true,
        steps: {
          include: {
            liquidApplication: {
              include: {
                liquidInfo: {
                  include: {
                    permanentLiquid: true,
                  },
                },
              },
            },
            temperatureChange: true,
            washing: {
              include: {
                permanentLiquid: true,
              },
            },
          },
        },
      },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUser(username: string) {
    return await this.prisma.user.findFirst({
      where: { deleted: false, username },
    });
  }

  async getPermanentLiquids() {
    return await this.prisma.permanentLiquid.findMany({
      include: {
        liquidInfo: {
          include: {
            type: true,
          },
        },
      },
    });
  }

  async getLiquidTypes() {
    return this.prisma.liquidType.findMany();
  }

  async getCustomProtocolLiquids(id: number) {
    return await this.prisma.liquidInfo.findMany({
      where: {
        permanentLiquid: null,
        liquidApplication: {
          some: {
            step: {
              protocolId: id,
            },
          },
        },
      },
      include: {
        type: true,
      },
    });
  }

  async getLiquidInfo(id: number) {
    return await this.prisma.liquidInfo.findFirst({
      where: { id },
      include: {
        type: true,
      },
    });
  }

  async deleteProtocol(id: number) {
    try {
      await this.prisma.protocol.delete({ where: { id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log('Error code: ', error.code);
        if (error.code === 'P2003') {
          console.log('💀 foreign key');
        }
        console.log(error.message);
      } else {
        console.log(error);
      }
    }
  }

  async deleteLiquid(id: number) {
    await this.prisma.permanentLiquid.delete({
      where: { id },
    });
  }

  async saveLiquid(liquid: PermanentLiquidDTO) {
    return await this.prisma.permanentLiquid.upsert({
      where: { id: liquid.id },
      update: {
        toxic: liquid.toxic,
        requiresCooling: liquid.usedCold,
        liquidInfo: {
          update: {
            liquidTypeId: liquid.type.id,
            name: liquid.name,
          },
        },
      },
      create: {
        toxic: liquid.toxic,
        requiresCooling: liquid.usedCold,
        liquidInfo: {
          create: {
            name: liquid.name,
            type: {
              connect: {
                id: liquid.type.id,
              },
            },
          },
        },
      },
    });
  }
}

let a = new DatabaseService();
export type FullProtocols = Prisma.PromiseReturnType<typeof a.getProtocols>;
export type FullProtocol = FullProtocols[0];
export type SteppedProtocol = Prisma.PromiseReturnType<
  typeof a.getProtocolById
>;
export type ProtocolStep = SteppedProtocol['steps'][0];
