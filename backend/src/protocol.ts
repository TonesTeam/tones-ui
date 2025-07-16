import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';

type ExternalLiquid = {
    id: number;
};

type InternalLiquid = {
    x: number;
    y: number;
};

type LiquidType = { Internal: InternalLiquid } | { External: ExternalLiquid };

type WashType = { Custom: string } | { Sys: string };

interface ReagentStep {
    type: 'Reagent';
    id: number;
    params: {
        liquid: {
            type: LiquidType;
            used_cold: boolean;
            toxic: boolean;
        };
        incubation: number;
        temperature: number;
    };
}

interface WashingStep {
    type: 'Washing';
    id: number;
    params: {
        wash: {
            type: WashType;
            used_cold: boolean;
            toxic: boolean;
        };
        iters: number;
        incubation: number;
        temperature: number;
    };
}

interface TemperatureChangeStep {
    id: number;
    type: 'TemperatureChange';
    params: {
        target: number;
    };
}

type ProtocolStep = ReagentStep | WashingStep | TemperatureChangeStep;

class ProtocolManager {
    private protocol: {
        id: number;
        steps: ProtocolStep[];
    };

    constructor() {
        this.protocol = {
            id: 0,
            steps: [],
        };
    }

    addReagent(
        liquidType: LiquidType,
        usedCold: boolean,
        toxic: boolean,
        incubation: number,
        temperature: number,
        id: number = 0,
    ): void {
        const step: ReagentStep = {
            type: 'Reagent',
            id,
            params: {
                liquid: {
                    type: liquidType,
                    used_cold: usedCold,
                    toxic,
                },
                incubation,
                temperature,
            },
        };
        this.protocol.steps.push(step);
    }

    addWashing(
        washType: WashType,
        usedCold: boolean,
        toxic: boolean,
        iters: number,
        incubation: number,
        temperature: number,
        id: number = 1,
    ): void {
        const step: WashingStep = {
            type: 'Washing',
            id,
            params: {
                wash: {
                    type: washType,
                    used_cold: usedCold,
                    toxic,
                },
                iters,
                incubation,
                temperature,
            },
        };
        this.protocol.steps.push(step);
    }

    addTemperatureChange(target: number, id: number = 10): void {
        const step: TemperatureChangeStep = {
            id,
            type: 'TemperatureChange',
            params: {
                target,
            },
        };
        this.protocol.steps.push(step);
    }

    build(filename: string = 'protocol.json'): void {
        const jsonData = JSON.stringify(this.protocol, null, 4);
        try {
            fs.writeFileSync(filename, jsonData);
            console.log(`Protocol saved to ${filename}:`);
            console.log(jsonData);
        } catch (err) {
            console.error(
                `Error writing to file ${filename}:`,
                (err as Error).message,
            );
        }
    }

    save(filename: string = 'protocol.json'): void {
        const jsonData = JSON.stringify(this.protocol, null, 4);
        const databasePath = path.join(__dirname, 'database');
        const filePath = path.join(databasePath, filename);

        // Ensure the /database folder exists
        if (!fs.existsSync(databasePath)) {
            fs.mkdirSync(databasePath);
        }

        try {
            fs.writeFileSync(filePath, jsonData);
            console.log(`Protocol saved to ${filePath}:`);
            console.log(jsonData);
        } catch (err) {
            console.error(
                `Error writing to file ${filePath}:`,
                (err as Error).message,
            );
        }
    }

    async send(destination: string, port: number = 8081): Promise<void> {
        try {
            await sendJSONOverPort(destination, port);
            console.log(`Protocol sent to ${destination}`);
        } catch (err) {
            console.error(`Error sending protocol to ${destination}:`, err);
        }
    }
}

/**
 * Отправляет JSON-файл по порту 8081.
 *
 * @param {string} filePath - Путь к JSON-файлу.
 * @returns {Promise<string>} - Сообщение об успехе или ошибке.
 */
async function sendJSONOverPort(
    filePath: string,
    port: number = 8081,
): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Ошибка чтения файла: ${(err as Error).message}`);
                return;
            }

            try {
                const jsonData = JSON.parse(data); // Проверяем, что файл содержит валидный JSON
            } catch (err) {
                reject(`Ошибка парсинга JSON: ${(err as Error).message}`);
                return;
            }

            const client = new net.Socket();
            client.connect(port, '192.168.31.111', () => {
                console.log('Connected');
                client.write(data);
            });

            client.on('data', (data) => {
                console.log('Received: ' + data);
                client.destroy(); // Закрываем соединение после получения ответа
                resolve('JSON-файл успешно отправлен.');
            });

            client.on('close', () => {
                console.log('Connection closed');
            });

            client.on('error', (err) => {
                reject(`Ошибка отправки данных: ${(err as Error).message}`);
            });
        });
    });
}

export default ProtocolManager;

// // Пример использования
// const manager = new ProtocolManager();

// // Добавление шагов реагента
// manager.addReagent({ Internal: { x: 1, y: 5 } }, true, false, 10, 25);
// manager.addReagent({ External: { id: 1 } }, true, false, 10, 25);

// // Добавление шагов промывки
// manager.addWashing({ Custom: "Custom"}, true, false, 11, 27, 25);
// manager.addWashing({ Sys: "SysDefault" }, true, false, 11, 27, 25);

// // Добавление шага изменения температуры
// manager.addTemperatureChange(55);

// const protocol_name = "test1.json"

// // Создание JSON файла
// manager.build(protocol_name);

// // Сохранение протокола
// manager.save(protocol_name);

// // Отправка протокола (пример)
// manager.send(protocol_name, 8081);
