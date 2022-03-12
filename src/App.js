import './App.css';
import React, { useState, useRef } from 'react';

function App() {
  const args = (document.getElementById('data') == null) ? ({
    ratings_ids: [],
    username: 'Kevin',
  }) : JSON.parse(document.getElementById('data').text);
  const [ratings, updateRatings] = useState(args.ratings_ids);
  const form = useRef(null);

  function onClickAdd() {
    const val = form.current.value;
    const updatedArtists = [...ratings, val];
    updateRatings(updatedArtists);
    form.current.value = '';
  }

  function onClickDelete(i) {
    const updatedArtists = [...ratings.slice(0, i), ...ratings.slice(i + 1)];
    updateRatings(updatedArtists);
  }

  function onClickSave() {
    const requestData = { ratings_ids: ratings };
    fetch('/rate', {
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

  const deleteButtonStyle = {
    backgroundColor: 'red',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
  };



  const gridStyle = {
    align: 'center',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridGap: '10px 5px',
    marginLeft: '30%',
    marginRight: '30%',
  };

  const artistsList = ratings.map((artistID, i) => (
    <div style={gridStyle}>
      <p>{artistID}</p>
      <button type="button" style={deleteButtonStyle} onClick={() => onClickDelete(i)}>Delete</button>
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
      {artistsList}
    </body>
  );
}

export default App;