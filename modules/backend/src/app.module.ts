import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './db.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, DatabaseService, Logger],
})
export class AppModule { }
