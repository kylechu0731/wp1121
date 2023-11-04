# Homework 3

POSTGRESQL problems may be solved in ['https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199']

## Getting Started

```bash
yarn
```

### For Docker Users

```bash
docker compose up -d
```

If you've used the port for another database, please run  

```bash
docker compose down
```

at the database folder at first (If you are confident that changing the port number won't cause any problem you may feel free to change) (I once changed it and something unexplanable happened...)

then create a `.env.local` and fill in

```bash
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/joinme"
```

finally,

```bash
yarn migrate
```

### For Neon Users

Since Neon requires Internet connection, please please please be patient for any lag.
If a `TIMEOUT` problem happens and page cannot be loaded, please `yarn dev` again to restart the app (and make sure your Internet connection is stable enough).

Create a `.env.local` and fill in your connection url

```bash
POSTGRES_URL=<your connection url>
```

then

```
yarn migrate
```