import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService, FullProtocol, FullProtocols } from './db.service';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto'


@Injectable()
export class AppService {

    private readonly logger = new Logger(AppService.name);

    constructor(
        private readonly dbService: DatabaseService,
    ) {
    }

    async getProtocols() {
        let protocols: FullProtocols = await this.dbService.getProtocols();
        return protocols.map(p => this.protocolToDto(p))
    }

    private protocolToDto(p: FullProtocol): ProtocolDto {
        return {
            id: p.id,
            author: p.creator.username,
            creationDate: p.creationDate,
            description: p.description,
            name: p.name
        }
    }

}
