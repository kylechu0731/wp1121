# Homework 4

POSTGRESQL problems may be solved in ['https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199']

## Getting Started

```bash
# ./server
yarn

# ./web
yarn
```

Create a `.env` in `./server` and fill in

```bash
# ./server/.env
PORT=4000
```

### For Docker Users

```bash
# ./web
docker compose up -d
```

If you've used the port for another database, please run  

```bash
# ./web
docker compose down
```

at the database folder at first (If you are confident that changing the port number won't cause any problem you may feel free to change) (I once changed it and something unexplanable happened...)

then create a `.env.local` and fill in

```bash
# ./web/.env.local
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/messenger"
```

finally,

```bash
# ./web
yarn migrate
```

### For Neon Users

Since Neon requires Internet connection, please please please be patient for any lag.
If a `TIMEOUT` problem happens and page cannot be loaded, please `yarn dev` again to restart the app (and make sure your Internet connection is stable enough).

Create a `.env.local` and fill in your connection url

```bash
# ./web/.env.local
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
POSTGRES_URL=<your connection url>
```

then

```bash
# ./web
yarn migrate
```

### Perfect Implementation

I've implemented the additional functions 

1. Detect link in the message: whenever there is a link-like segment in the message, it will become a blue hyperlink which redirects you to the website after being click.

2. Whether he/she has read: You will see whether your message sent has been read by the other just like the usual messenger. If you have unread messages, there will be some small red jumping block indicating "NEW!!!" on the chat list, which is cute and I hope that you can successfully run the app the see it :p