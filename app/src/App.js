import logo from './logo.svg';
import './App.css';

import { React, useState } from "react";
import Search from "./Search"
import TrackPage from "./TrackPage"

function App() {
  const [id, setId] = useState(null)

  return (
    <div className="main">
      <h1>Lyric&nbsp;&nbsp;Rec</h1>
      <Search onTrackSelect={setId}/>
      <TrackPage trackId={id}/>
    </div>
  );
}

export default App;
