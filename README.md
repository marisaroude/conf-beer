# ConfBeer

Aplicacion mobile construida con Expo + React Native para visualizar conferencias cerveceras.

La app permite:

- ver el listado de conferencias
- abrir el detalle de cada conferencia
- ver la ubicacion de la conferencia en un mapa

## Stack

- Expo
- React Native
- TypeScript
- Expo Router (ruteo por archivos)
- Expo SQLite (base de datos local)
- React Native Maps

## Requisitos

- Node.js 18+
- npm
- Expo Go o emulador Android/iOS

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run start
```

Tambien disponibles:

```bash
npm run android
npm run ios
npm run web
```

## Estructura principal

```text
app/
   _layout.tsx            # Stack de navegacion
   index.tsx              # Listado de conferencias
   conference/[id].tsx    # Detalle de conferencia
   map.tsx                # Mapa con ubicacion

data/
   conferences.json       # Fuente de datos

database/
   database.ts            # Inicializacion SQLite + consultas + sync

types/
   conference.ts          # Tipo Conference

utils/
   utils.ts               # Formateo de fechas/horas
```

## Flujo de datos

1. Al abrir la pantalla principal, se ejecuta `initDatabase()`.
2. Se crea la tabla `conferences` si no existe.
3. Se sincroniza `data/conferences.json` con SQLite:
    - inserta nuevas conferencias
    - actualiza conferencias existentes
    - elimina conferencias que ya no estan en el JSON
4. La lista se consulta con `getAllConferences()`.
5. El detalle se consulta con `getConferenceById(id)`.

## Navegacion

- `/` -> listado de conferencias
- `/conference/[id]` -> detalle de una conferencia
- `/map` -> mapa con marcador de la conferencia

## Scripts

- `npm run start`: inicia Expo
- `npm run android`: abre en Android
- `npm run ios`: abre en iOS
- `npm run web`: abre en web
- `npm run lint`: ejecuta lint

## Notas

- La base de datos es local al dispositivo/simulador.
- Si modificas `data/conferences.json`, los cambios se aplican automaticamente al iniciar la app.
