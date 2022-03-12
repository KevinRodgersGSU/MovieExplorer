import './App.css';
import React, { useState, useRef } from 'react';

function App() {
  const args = (document.getElementById('data') == null) ? ({
    ratings_ids: [],
    username: 'Kevin',
  }) : JSON.parse(document.getElementById('data').text);




  return (
    <div>
      <header>
        Fun Fact: {args.username}
      </header>

    </div>
  );
}

export default App;