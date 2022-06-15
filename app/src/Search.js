import {React, useState} from 'react';
import Results from "./components/Results"
import TextField from "@mui/material/TextField";
import './App.css';

function Search() {
    const [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    return (
        <div className="search">
            <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
            onChange={inputHandler}
            />
            <Results query={inputText}/>
        </div>
    )
}

export default Search
