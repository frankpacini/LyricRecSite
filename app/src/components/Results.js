import { React, useState, useEffect, useRef } from 'react'
import config from '../config.js'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

function Results(props) {
    const [resultsList, setResultsList] = useState([])
    let makeSearchRequest = (query) => {
        console.log(config['SERVER_URL'] + 'search/' + query + "/")
        fetch(config['SERVER_URL'] + 'search/' + query + "/")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setResultsList(data['results'])
        })
        // .then(response => setResultsList(response.json()));
    }

    const minWaitTime = 100
    const maxWaitTime = 800
    const resetTime = 200

    const [inputTrigger, setInputTrigger] = useState(false)
    const [requestTrigger, setRequestTrigger] = useState(false)

    const inputTimer = useRef(null);
    const requestTimer = useRef(null);
    const resetTimer = useRef(null)

    useEffect(() => {
        clearTimeout(inputTimer.current)
        if(props.query === "") {
            resetTimer.current = setTimeout(() => setResultsList([]), resetTime);
        }
        else {
            if(requestTimer.current === null) {
                requestTimer.current = setTimeout(() => setRequestTrigger(true), maxWaitTime);
            }
            inputTimer.current = setTimeout(() => setInputTrigger(true), minWaitTime);
        }
    }, [props.query]);

    useEffect(() => {
        if(inputTrigger === true || requestTrigger === true) {
            clearTimeout(inputTimer.current)
            clearTimeout(requestTimer.current)
            clearTimeout(resetTimer.current)
            if(inputTrigger === true)
                setInputTrigger(false)
            if(requestTrigger === true)
                setRequestTrigger(false)

            makeSearchRequest(props.query)

            let prevQuery = props.query
            requestTimer.current = setTimeout(() => {
                if(props.query === prevQuery) {
                    requestTimer.current = null
                }
                else {
                    setRequestTrigger(true)
                }
            }, maxWaitTime);
        }
    }, [inputTrigger, requestTrigger])


    return (
        <div style={{backgroundColor: 'rgb(229, 243, 250)'}}>
        <List style={{overflow: 'auto', maxHeight: "70vh"}}>
            {props.show && resultsList.length != 0 && resultsList.map(
                result => (
                    <ListItemButton 
                        key={result['id']} 
                        style={{backgroundColor: 'white', marginBottom: "1vh", paddingRight: '8px'}} 
                        onClick={() => props.onResultSelect(result['id'])}
                    >
                        <ListItemAvatar>
                            <img src={result['image_thumbnail_url']} style={{maxWidth: '75px'}} />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={(result['title']).replace(/(.{60})/g, "$1\n")}
                            secondary={
                                <Typography
                                    component="span"
                                    variant="body2"
                                    // className={classes.inline}
                                    color="textPrimary"
                                >
                                    {result['artist']}
                                </Typography>
                            }
                            style={{padding: "0.375rem 0.375rem 0.25rem 1rem"}}
                        />
                    </ListItemButton>
                )
            )}
        </List>
        </div>
        // <div>
        //     {resultsList.length != 0 && resultsList.map(
        //         result => 
        //         <div key={result['id']}> 
        //             {}
        //         </div> 
        //     )}
        // </div>
    )
}

export default Results;