import { React, useState, useEffect, useRef } from 'react'
import config from '../config.js'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

function Results(props) {
    const [resultsList, setResultsList] = useState([])
    let makeRequest = (query) => {
        console.log(config['SERVER_URL'] + 'search/' + query + "/")
        fetch(config['SERVER_URL'] + 'search/' + query + "/")
        .then(response => response.json())
        .then(data => setResultsList(data['results']))
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

            makeRequest(props.query)

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
        <List style={{overflow: 'auto', maxHeight: "70vh"}}>
            {resultsList.length != 0 && resultsList.map(
                result => (
                    <ListItem key={result['id']} style={{backgroundColor: 'white', marginBottom: "1vh"}}>
                        <ListItemAvatar>
                            <img src={result['header_image_thumbnail_url']} style={{maxWidth: '75px'}} />
                        </ListItemAvatar>
                        <ListItemText primary={(result['title']).replace(/(.{60})/g, "$1\n")}
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
                            style={{padding: "0.375rem 0.375rem 0.25rem"}}
                        />
                    </ListItem>
                )
            )}
        </List>
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