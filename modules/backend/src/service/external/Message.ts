import { Maybe } from "@util/Maybe"
import * as CRC32 from "crc-32"

export enum MessageChannel {
    ERROR = 1,
    INFO = 2,
    COMMAND = 3,
    PROTOCOL_TRANSFER = 4,
}

const REVERSE_MAPPING = new Map([
    [1, MessageChannel.ERROR],
    [2, MessageChannel.INFO],
    [3, MessageChannel.COMMAND],
    [4, MessageChannel.PROTOCOL_TRANSFER],
])

export class Message {
    private constructor(
        public channel: MessageChannel,
        public body: string,
        public crc: number,
    ) { }

    static from(channel: MessageChannel, body: string): Message {
        return new Message(channel, body, CRC32.buf(Buffer.from(body), 0) >>> 0)
    }

    static parse(msg: string): Maybe<Message> {
        try {
            const parts = msg.split(',')
            return Maybe.fromValue(new Message(REVERSE_MAPPING.get(parseInt(parts[0]))!, parts[1], parseInt(parts[2], 16) >>> 0))
        } catch {
            return Maybe.none();
        }
    }

    public isValid() {
        return (CRC32.str(this.body, 0) >>> 0) === this.crc
    }

    public toString() {
        return `${this.channel},${this.body},${this.crc.toString(16)}`
    }

}
