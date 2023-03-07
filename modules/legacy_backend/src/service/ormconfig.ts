import { ConnectionOptions } from "typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

export const connectionOptions: ConnectionOptions = {
   "type": "sqlite",
   //    "host": "localhost",
   //    "port": 3306,
   //    "username": "test",
   //    "password": "test",
   "namingStrategy": new SnakeNamingStrategy(),
   "database": "./testdb",
   "synchronize": false,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   // "migrations": [
   //    "src/migration/**/*.ts"
   // ],
   // "subscribers": [
   //    "src/subscriber/**/*.ts"
   // ]
}