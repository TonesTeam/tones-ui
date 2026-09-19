# Tones UI

<img width="675" height="307" alt="Screenshot From 2025-10-05 17-37-34" src="https://github.com/user-attachments/assets/2386e1cc-081c-49e9-8e03-e2c993983d75" />

Автоматизированный стейнер для иммуногистохимической окраски клеток. Система состоит
из трёх процессов в трёх репозиториях:

| Слой | Где | Стек | Порт |
|---|---|---|---|
| Приложение | `frontend_native/` (этот репозиторий) | Expo 54, RN 0.81, React 19, TS, gluestack-ui | — |
| Backend | `../backend` → [TonesTeam/backend](https://github.com/TonesTeam/backend) | Rust, axum, sqlx, SQLite | `0.0.0.0:8080` |
| Контроллер железа | `../controller_v2-master` → [TonesTeam/controller_v2](https://github.com/TonesTeam/controller_v2) | Rust, serialport, CAN | `127.0.0.1:3000` |

Поток данных: планшет → backend (`:8080`) → controller_v2 (`:3000`) → Klipper по HTTP
на `tonespi.local:7125` (G-code), насосы и клапаны по serial, датчики по CAN. Слои 2 и 3
живут на одной машине (Raspberry Pi, `tonespi.local`).

> `backend/` в этом репозитории — **мёртвый** NestJS+Prisma, исходники удалены, остался
> только `dist/`. Не использовать. Актуальный backend — отдельный Rust-репозиторий,
> см. таблицу выше.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (LTS) и npm — для фронтенда
- [Rust toolchain](https://rustup.rs/) — для backend и контроллера
- Клонировать соседние репозитории рядом с `tones-ui`, если их ещё нет на диске:
  ```bash
  git clone https://github.com/TonesTeam/backend.git
  git clone https://github.com/TonesTeam/controller_v2.git controller_v2-master
  ```

## Как запустить backend

Из `../backend`:
```bash
cargo run --bin seed      # один раз, наполнить БД тестовыми данными
cargo run --bin backend
```

Поднимет REST API на `0.0.0.0:8080`. Актуальная документация эндпоинтов —
`../backend/NEW_ENDPOINTS.md`.

Контроллер (`controller_v2-master`) локально не поднимается: требует COM-порты,
CAN-датчики и приватные зависимости по SSH. Без него работает всё, кроме запуска
задач и `/hardware/slot-states`.

## Как запустить фронтенд

Из корня `tones-ui`:
```bash
npm install
npm run frontend
```

После сборки Expo покажет QR-код — отсканировать в приложении Expo Go (iOS/Android),
либо открыть веб-версию по ссылке из терминала.

Если приложение не находит backend в сети (автопоиск в `common/util.ts` сканирует
подсеть по `GET /health` с маской `255.255.254.0`, которая подходит не всякой сети),
можно прописать адрес вручную — присвоить `foundIP` реальный IP после вызова
`scanNetwork` в `common/util.ts`.

> `npm run backend` из корневого `package.json` **сломан** (зовёт Prisma от мёртвого
> NestJS-бэкенда) — используйте команды выше вместо него.

## Модули этого репозитория

- `frontend_native/` — приложение. Ключевое: `Pages/ProtocolConstructor/` (конструктор
  протоколов), `Pages/LaunchPage/` (мастер запуска), `Pages/Jobs/`,
  `Pages/LiquidLibrary/`, `common/util.ts` (HTTP-слой и автопоиск бэкенда).
- `common/` — общие TS-типы (DTO, енумы), подключён как `file:../common`.

Подробнее о модели данных, соглашениях и известных особенностях — см. [CLAUDE.md](CLAUDE.md).
