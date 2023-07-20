import { LiquidType, Prisma, PrismaClient, Protocol } from "@prisma/client";
import { StepType, UserRole } from "sharedlib/enum/DBEnums";
const prisma = new PrismaClient()

async function main() {
    /**
     * Users
     */
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

    /**
     * Liquid Types
     */
    const findOrCreateType = async (name: string) => {
        return await prisma.liquidType.upsert({ where: { name }, update: {}, create: { name } });
    };
    let alcoholType = await findOrCreateType("Alcohol");
    let washingType = await findOrCreateType("Washing");
    let antigenRetrievalType = await findOrCreateType("Antigen Retrieval")
    let chromoFlourType = await findOrCreateType("Chromogen/Fluorophore")
    let blockType = await findOrCreateType("Blocking Buffer")
    let amplificationType = await findOrCreateType("Signal Amplification System")
    let deparafType = await findOrCreateType("Deparaphinization")
    let dnaRnaType = await findOrCreateType("DNA/RNA Probes")
    let antiBodyType = await findOrCreateType("AntiBody Primary")

    /**
     * Liquids
     */
    const findOrCreateLiquid = async (name: string, type: LiquidType) => {
        let lid = (await prisma.permanentLiquid.findFirst({ where: { liquidInfo: {name}} }))?.id ?? -1;
        return await prisma.permanentLiquid.upsert({
            where: { id: lid }, update: {},
            create: {
                liquidInfo: {create: {
                  name,
                  type: {connect:{id: type.id}}  
                }},
                deleted: false,
                requiresCooling: false,
            }
        });
    };
    let alc1 = await findOrCreateLiquid("Alcohol 95%", alcoholType);
    let alc2 = await findOrCreateLiquid("Alcohol 99%", alcoholType);
    let alc3 = await findOrCreateLiquid("Alcohol 75%", alcoholType);
    let wash1 = await findOrCreateLiquid("Washing Buffer", washingType);
    let wash2 = await findOrCreateLiquid("H20", washingType);
    let antigenRet1 = await findOrCreateLiquid("pH6", antigenRetrievalType);
    let antigenRet2 = await findOrCreateLiquid("pH9", antigenRetrievalType);
    let antigenRet3 = await findOrCreateLiquid("pH10", antigenRetrievalType);
    let chromoFlour1 = await findOrCreateLiquid("ASD", chromoFlourType);
    let chromoFlour2 = await findOrCreateLiquid("Opal-540", chromoFlourType);
    let chromoFlour3 = await findOrCreateLiquid("Opal-620", chromoFlourType);
    let chromoFlour4 = await findOrCreateLiquid("Alexa-445", chromoFlourType);
    let chromoFlour5 = await findOrCreateLiquid("Eosin", chromoFlourType);
    let chromoFlour6 = await findOrCreateLiquid("Hematozylin", chromoFlourType);
    let chromoFlour7 = await findOrCreateLiquid("Vector Red", chromoFlourType);
    let chromoFlour8 = await findOrCreateLiquid("Vector Blue", chromoFlourType);
    let block1 = await findOrCreateLiquid("Horse Serum", blockType);
    let block2 = await findOrCreateLiquid("Albumin", blockType);
    let signalAmpl1 = await findOrCreateLiquid("Akoya Polymer System", amplificationType);
    let signalAmpl3 = await findOrCreateLiquid("ImmPress Red Polymer System", amplificationType);
    let signalAmpl4 = await findOrCreateLiquid("ImmPress Mal Polymer System", amplificationType);
    let deparaf1 = await findOrCreateLiquid("Xylene", deparafType);
    let deparaf2 = await findOrCreateLiquid("Xylene substitute", deparafType);

    /**
     * Protocols
     */
    let pid = (await prisma.protocol.findFirst({ where: { name: "Test Protocol 1" } }))?.id ?? -1;
    let p1: Protocol = await prisma.protocol.upsert({
        where: { id: pid }, update: {},
        create: {
            name: "Test Protocol 1",
            creationDate: new Date(),
            deleted: false,
            creator: {
                connect: {
                    username: "Jefferey"
                }
            },
            defaultWashing: {
                create: {
                    incubationTime: 5,
                    iter: 2,
                    permanentLiquid: { connect: { id: wash1.id } }
                }
            },
            steps: {
                create: [
                    {
                        sequenceOrder: 1,
                        stepType: StepType.LIQUID_APPL,
                        liquidApplication: {
                            create: {
                                liquidInfo: {
                                    connect: {
                                        id: antigenRet1.liquidInfoId
                                    }
                                },
                                incubationTemperature: 50,
                                liquidIncubationTime: 200
                            }
                        }
                    }
                ]
            },
            washingLiquid: {
                connect: {
                    id: wash2.id
                }
            }
        }
    })
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
