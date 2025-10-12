import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './db.service';
import { ProtocolDeploymentService } from './protocol-deployment.service';
import { ProtocolSavingService } from './protocol-saving.service';
import { ProtocolStepsResolver } from './protocol-steps-resolver.service';
import { EmbeddedControllerService } from './embedded-controller.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        DatabaseService,
        Logger,
        ProtocolSavingService,
        ProtocolDeploymentService,
        ProtocolStepsResolver,
        EmbeddedControllerService,
    ],
})
export class AppModule {}
