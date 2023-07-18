import { PrismaClient } from "@prisma/client";
import { UserRole } from "sharedlib/enum/DBEnums";
const prisma = new PrismaClient()
async function main() {
    await prisma.user.upsert({
        where: { username: "Admin" }, update: {},
        create: {
            username: "Admin",
            role: UserRole.ADMIN
        }
    });
    await prisma.user.upsert({
        where: { username: "Jefferey" }, update: {},
        create: {
            username: "Jefferey",
            role: UserRole.NORMAL
        }
    });
    let type1 = await prisma.liquidType.upsert({
        where: { name: "Liquid Type 1" }, update: {},
        create: {
            name: "Liquid Type 1",
        }
    });
    let lid = (await prisma.liquid.findFirst({where: {name: "Test Liquid 1"}}))?.id ?? -1;
    await prisma.liquid.upsert({
        where: { id: lid }, update: {},
        create: {
            name: "Test Liquid 1",
            shortname: "test1",
            type: {
                connect: {
                    id: type1.id
                }
            },
            deleted: false,
            requiresCooling: false,
            maxTemp: 100
        }
    });
    // await prisma.protocol.create({data: {
    //     name: "Test Protocol 1",
    //     creationDate: new Date(),

    // }})
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
