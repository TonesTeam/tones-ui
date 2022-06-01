import { inject, injectable } from "inversify";
import { provide } from "inversify-binding-decorators";
import { Logger } from "tslog";
import { Connection, createConnection, EntityTarget, ObjectType, Repository } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { connectionOptions  } from "./ormconfig";
@provide(DatabaseService)
export class DatabaseService {
    private static connection: Connection;

    @inject(Logger)
    logger: Logger;


    public async getConnection(): Promise<Connection> {
        if (DatabaseService.connection instanceof Connection) {
            return DatabaseService.connection;
        }

        try {
            DatabaseService.connection = await createConnection(connectionOptions);
            this.logger.info(`Connection established`);
            return DatabaseService.connection;
        } catch (e) {
            this.logger.error("Cannot establish database connection");
            this.logger.error(e);
            process.exit(1);
        }
    }

    public async getCustomRepository<T>(repository: ObjectType<T>): Promise<T> {
        const connection = await this.getConnection();
        return await connection.getCustomRepository<T>(repository);
    }

    public async getRepository<T>(tg: EntityTarget<T>): Promise<Repository<T>> {
        const connection = await this.getConnection();
        return await connection.getRepository<T>(tg);
    }
}