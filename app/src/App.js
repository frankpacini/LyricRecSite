import logo from './logo.svg';
import './App.css';

import { React, useState } from "react";
import Search from "./Search"

function App() {
  return (
    <div className="main">
      <h1>React Search</h1>
      <Search/>
    </div>
  );
}

export default App;
