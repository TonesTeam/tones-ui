import { SnakeNamingStrategy } from "typeorm-naming-strategies"

export = {
   "type": "sqlite",
   //    "host": "localhost",
   //    "port": 3306,
   //    "username": "test",
   //    "password": "test",
   "namingStrategy": new SnakeNamingStrategy(),
   "database": "./testdb",
   "synchronize": false,
   "logging": true,
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