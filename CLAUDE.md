# Tones

Автоматизированный стейнер для иммуногистохимической окраски клеток. Юзер собирает
протокол (реагенты, промывки, инкубации, температуры), ставит образцы в слоты и
запускает с планшета — прибор проводит окраску сам.

## Система состоит из трёх процессов в трёх репозиториях

| Слой | Где | Стек | Порт |
|---|---|---|---|
| Приложение | `frontend_native/` (этот репозиторий) | Expo 54, RN 0.81, React 19, TS, gluestack-ui | — |
| Backend | `../backend` → `TonesTeam/backend` | Rust, axum, sqlx, SQLite | `0.0.0.0:8080` |
| Контроллер железа | `../controller_v2-master` → `TonesTeam/controller_v2` | Rust, serialport, CAN | `127.0.0.1:3000` |

Поток: планшет → backend (`:8080`) → controller_v2 (`:3000`) → Klipper по HTTP на
`tonespi.local:7125` (G-code), насосы и клапаны по serial, датчики по CAN.
Слои 2 и 3 живут на одной машине (Raspberry Pi, `tonespi.local`).

Соседние репозитории уже доступны через `additionalDirectories` в
`.claude/settings.local.json`. Если их нет на диске — склонировать рядом с `tones-ui`:
`git clone https://github.com/TonesTeam/backend.git` и то же для `controller_v2`.

## Модули этого репозитория

- `frontend_native/` — приложение. Ключевое: `Pages/ProtocolConstructor/` (конструктор
  протоколов, главная фича), `Pages/LaunchPage/` (мастер запуска), `Pages/Jobs/`,
  `Pages/LiquidLibrary/`, `common/util.ts` (HTTP-слой и автопоиск бэкенда).
- `common/` — общие TS-типы (DTO, енумы), подключён как `file:../common`.
- `backend/` — **мёртвый** NestJS+Prisma. Исходники удалены коммитом `c4b02b9`,
  остался только `dist/`. Не использовать, не восстанавливать.

## Запуск

```bash
# бэкенд (из ../backend)
cargo run --bin seed      # один раз, наполнить БД
cargo run --bin backend

# фронтенд (из корня tones-ui)
npm install
npm run frontend
```

Контроллер локально не поднимается: требует COM-порты, CAN-датчики и приватные
зависимости по SSH. Без него работает всё, кроме запуска задач и `/hardware/slot-states`.

`npm run backend` из корневого `package.json` **сломан** (зовёт Prisma от мёртвого
бэкенда). Ключ `backend` в `workspaces` — тоже наследие, папки-воркспейса нет.

## Модель данных (SQLite, `../backend/src/database/schema.rs`)

`users`, `liquid_types`, `liquids`, `protocols`, `step_groups`, `steps`, `batches`, `jobs`.
Схема создаётся кодом при старте (`CREATE TABLE IF NOT EXISTS`), миграций нет.

- Правка протокола не меняет строку: создаётся новая версия с тем же `history_id` и
  увеличенным `version`. Списки показывают только последние версии.
- Один запуск = один `batch` + по одному `job` на каждый занятый слот. `jobs.id`
  тождественен `task_id` в контроллере — на этом держатся pause/resume/abort.
- У `batches` нет FK на протокол: по завершённому запуску нельзя узнать, какой
  протокол исполнялся.

## Как приложение находит бэкенд

`common/util.ts` сканирует всю подсеть запросами `GET /health` с таймаутом 500 мс.
Маска зашита как `255.255.254.0` и подходит не всякой сети — если поиск не срабатывает,
присвоить `foundIP` реальный адрес вручную после `scanNetwork`.

## Что нужно знать перед правками

- **Иммутабельность обязательна.** `Constructor.tsx` определяет несохранённые изменения
  через `JSON.stringify(stepGroups) !== JSON.stringify(originalStepGroups)`. Мутация
  массива на месте не вызовет перерисовку.
- **Типы в `common/` отстали от API.** Писались под мёртвый NestJS: например,
  `ProtocolDto` объявляет `author_first_name`/`author_last_name`, которых Rust не отдаёт.
  Проверять по `../backend/src/handlers/`, а не по DTO.
- **Температура — обычные градусы Цельсия** (10–90). Комментарий `celsius * 100` в
  `schema.rs` устарел, умножать не надо.
- **Термоконтроль в контроллере отключён**: `mod temperature_control` закомментирован в
  `main.rs`. Целевая температура доезжает до железа и игнорируется.
- **Формат `/data` между бэкендом и контроллером расходится** в текущих копиях: бэкенд
  шлёт массив плоских объектов, `controller_v2-master` ждёт один объект с вложенным
  `commands[]` плюс обязательные `requested_start_ts_ms` и `is_toxic`. Перед правками в
  этой области проверить, какая сборка контроллера стоит на приборе.

## Соглашения

- Prettier: 4 пробела, одинарные кавычки (`.prettierrc`).
- Актуальная документация API — `../backend/NEW_ENDPOINTS.md`, не README этого репозитория
  (он описывает мёртвый NestJS и `docker-compose`, которого нет).
- Ветки: работа идёт в тематических ветках от `main`, в origin много старых `Arina-*` и
  `copilot/*`.
