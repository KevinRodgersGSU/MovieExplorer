import './App.css';
import React, { useState, useRef } from 'react';

function App() {
  const args = (document.getElementById('data') == null) ? ({
    ratings_ids: [],
    username: 'Kevin',
  }) : JSON.parse(document.getElementById('data').text);
  const [ratings, updateRatings] = useState(args.ratings_ids);



  function onClickDelete(i) {
    const updatedArtists = [...ratings.slice(0, i), ...ratings.slice(i + 1)];
    console.log(updatedArtists)
    updateRatings(updatedArtists);
  }

  function onClickSave() {
    const requestData = { ratings_ids: ratings };
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        updateRatings(data.ratings_ids);
      });
  }

  const delButton = {
    backgroundColor: 'red',
    display: 'inline-block',
    fontSize: '15px',
    color: 'white',
    textAlign: 'center',
    align: 'center',
    border: 'none',
  };



  const gridStyle = {
    align: 'center',
    display: 'grid',
    marginLeft: '30%',
    marginRight: '30%',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '10px 5px',
  };

  const ratingsList = ratings.map((ratingID, i) => (
    <div style={gridStyle}>
      <p>Username:{args.username}</p>
      <p>Rating:{args.ratings[i]}</p>
      <p>Comments:{args.comments[i]}</p>
      <p>Movie ID:{args.movieids[i]}</p>
      <button type="button" style={delButton} onClick={() => onClickDelete(i)}>Delete</button>
    </div>
  ));

  return (
    <body>
      <a href="/logout">Log out</a>
      <h1>{args.username}'s Movie Explorer</h1>
      <h2>{args.title}</h2>
      <h3>{args.tagline}</h3>
      <p>Genres: {args.genre}</p>
      <div>
        <img src={args.poster_image} />
      </div>
      <a href={args.wiki_url}> Click here to see Wikipedia page! </a>
      <div class="feedback">
        <form method="POST" action="/rate">
          <p>
            <label for="movie_id">Movie ID</label>
            <input id="movie_id" type="text" name="movie_id" value={args.movie_id} readonly="readonly" />
            <label for="rating">Rating (out of 5)</label>
            <input id="rating" type="number" name="rating" min="1" max="5" />
          </p>
          <p>
            <textarea id="comment" name="comment" placeholder="Leave a comment"></textarea>
          </p>
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </div>
      <h1>Your Reviews:</h1>
      {ratingsList}
      <button type="button" onClick={onClickSave}>Save</button>
    </body>
  );
}

export default App;