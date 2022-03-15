## Setup Instructions
1. `pip3 install -r requirements.txt`
2. Create a `.env` file in the top-level directory and enter the following as its contents:
```
export TMDB_API_KEY="<YOUR API KEY>"
export DATABASE_URL="<YOUR POSTGRESQL DB URL>"
```

## To run the app
1. Run `python3 app.py`

Three technical problems are described in detail
1. I couldn't get data to pass through to my react app.js from flask so I tried changing the name from routes to app.py to pass and moving the db model to the same file that didn't work and then I realized I was missing the line <script id="data" type="application/json">{{data|safe}}</script> from the index.html file which fixed the problem after adding it.
2. I had a problem with ratings map not printing out the right comments and ratings it was just blank but then I fixed it by instead of doing comments[ratingID] to comments[i]
3. Originally it wasn't redirecting to the right page and it was because I had an incorrect order with the login manager after the / route

Hardest part and most valuable learning of overall project is described
The hardest part of the overall project was getting data passed back and forth between react and flask. I think it was the most valuable learning different ways to manage data with flasksqlalchemy with stuff like jsondumps and objects etc.

