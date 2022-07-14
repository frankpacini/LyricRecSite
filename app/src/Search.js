import {React, useState} from 'react';
import Results from "./components/Results"
import TextField from "@mui/material/TextField";
import './App.css';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function Search(props) {
    const [inputText, setInputText] = useState("");
    const [showResults, setShowResults] = useState(true);

    let searchInputHandler = (e) => {
        setShowResults(true);
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    let onResultSelect = (id) => {
        setShowResults(false)
        props.onTrackSelect(id)
    }
 
    return (
        <div className="search">
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment">Search</InputLabel>
                <OutlinedInput
                    id="outlined-adornment"
                    value={inputText}
                    label="Search"
                    onChange={searchInputHandler}
                    // onClick={searchSelectHandler}
                    endAdornment={
                    <InputAdornment position="end">
                        {inputText.length != 0 && ( 
                            <IconButton
                                aria-label="toggle show results"
                                onClick={() => setShowResults(!showResults)}
                                edge="end"
                            >
                                {showResults ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </IconButton>
                        )}
                    </InputAdornment>
                    }
                />
            </FormControl>
            {/* <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label="Search"
                onChange={searchInputHandler}
                onClick={searchSelectHandler}
            /> */}
            <Results query={inputText} onResultSelect={onResultSelect} show={showResults}/>
        </div>
    )
}

export default Search

{/* <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl> */}