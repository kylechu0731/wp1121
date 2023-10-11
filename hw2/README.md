# Web Programming HW#2 "WP Music"

Please ensure that your internet connection and mongodb is on.
There might be some issue due to 

## Run the app

Follow the instructions in this section to run the app locally.

#### 1. Setup `backend`

Start by copying the `.env.example` file to `.env`.

```bash
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this. If you don't want to use MongoDB Atlas, you can also run a local MongoDB server with Docker. You can find the instructions [here](https://hub.docker.com/_/mongo).

```bash
PORT=8000
MONGO_URL=<your connection string>
```

Then, install all the dependencies by

```bash
yarn
```

### 2. Setup `frontend`

Start by copying the `.env.example` file to `.env`.

```bash
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the port should be the same as the one you set in the backend `.env` file.

```bash
VITE_API_URL="http://localhost:8000/api"
```

Then, install all the dependencies by

```bash
yarn
```

### 3. Start the backend server

```bash
cd backend
yarn dev
```

### 4. start the frontend server

```bash
cd frontend
yarn dev
```

Visit `http://localhost:5173` to see the app in action. That's it, you're done! If you want to set up the whole project from scratch, you can follow the instructions below.

## Perfect

I implement two perfect requirements.

### 1. User Tips

When the user tries to create a list with empty name, an alert will occur. Any kind of mistake will be forbidden. E.g., edit the name of a list to be empty, or create a song without link.

### 2. Repeat Name Detect

When creating a list, it's borbidden to name the list by the name of other lists. This rule applies to editing names.
When creating a song, it's borbidden to create a song with the name and singer being the same as other songs in the list.