## Web Programming Homework 1

### Launch
At first, please `git clone` this repository into your computer.

Then, rename the file `backend/.env.example` to `backend/.env`, and fill in 

```env
PORT = 8000

MONGO_URL = <your mongoose connection string>
```

Finally, activate the backend by

```bash
cd backend
yarn start # or yarn dev
```

And enjoy the website by opening `frontend/index.html`.

### Perfect

I've completed the implementation of these perfect requirement.

1. Filter: In the left-top side of the homepage, there are two selection lists for "tag" and "mood" of the diaries, which serves as a filter. I.e., only the diaries of the chosen tag and mood will be shown.
2. Changeable Date: Whenever you edit a (new) diary, you could modify its date. However, you can't assign an unexisting date to a diary, e.g., 2023.2.29 (because 2023 is not a leap year), 1945.6.31 (because june has only 30 days), 100.2.29 (because A.D.100 is not a leap year)
