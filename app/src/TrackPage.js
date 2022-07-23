import {React, useState, useEffect} from 'react';
import './App.css';
import config from './config.js';
import Lyrics from "./components/Lyrics";

import { makeStyles } from "@material-ui/core/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
    trackPage: {display: 'flex', marginLeft: 'auto', marginRight: 'auto', position: 'fixed', marginTop: '25vh'},
    trackContainer: {display: 'flex', marginTop: '8vh', flexDirection: 'column', marginRight: '25px', justifyContent: 'flex-start', alignItems: 'center'},
    trackImg: {maxWidth: '20vh', display: 'block', marginLeft: 'auto', marginRight: 'auto'},
    trackTitle: {marginBottom: '5px', textAlign: 'center'},
    trackArtist: {marginTop: '0px', textAlign: 'center'},
    trackButton: {width: '80%'},
    recTable: {display: 'block', marginLeft: 'auto', marginRight: 'auto', marginLeft: '25px'},
    recImg: {maxWidth: '7vh'},
    recTableCell: {verticalAlign: "middle"},
    buttonCell: {padding: '0px', verticalAlign: "middle"}
}));

function TrackPage(props) {
    const c = useStyles();
    const [track, setTrack] = useState(null)
    const [trackRecs, setTrackRecs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [lyricsOpen, setLyricsOpen] = useState(false)
    const [selectedRec, setSelectedRec] = useState(null)
    // const [trackRecs, setTrackRecs] = useState([1,2,3,4,5])

    let handleLyricsOpen = (e) => {
        setSelectedRec(null)
        setLyricsOpen(true)
    }
    let handleLyricsClose = (e) => {
        setLyricsOpen(false)
        // setSelectedRec(null)
    }

    let handleLyricsCompareOpen = (e, i) => {
        setLyricsOpen(true)
        setSelectedRec(trackRecs[i])
    }

    useEffect(() => {
        if(props.trackId != null) {
            setIsLoading(true)
            console.log(config['SERVER_URL'] + 'song/' + props.trackId + "/")
            fetch(config['SERVER_URL'] + 'song/' + props.trackId + "/")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setIsLoading(false)
                setTrack(data['recommendations'][0])
                setTrackRecs(data['recommendations'].slice(1))
            })
            
        }
        else {
            setTrack(null)
            setTrackRecs([])
        }
    }, [props.trackId])

    if(track == null) {
        if(isLoading) {
            return <CircularProgress/>
        } else {
            return <div></div>
        }
    } else {

    }
    return (
        <div className={c.trackPage}>
            <Lyrics track={track} rec={selectedRec} open={lyricsOpen} handleClose={handleLyricsClose}/>
            <div className={c.trackContainer}>
                <img className={c.trackImg} src={track.thumbnail_url}/>
                <h2 className={c.trackTitle}>{track.title}</h2>
                <h3 className={c.trackArtist}>{track.artist}</h3>
                <Button 
                    variant="outlined" 
                    size="medium" 
                    className={c.trackButton}
                    onClick={handleLyricsOpen}
                >
                    View Lyrics
                </Button>
            </div>
            <TableContainer className={c.recTable}>
                <TableHead>
                    <TableCell>#</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Artist</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell></TableCell>
                </TableHead>
                <TableBody>
                {trackRecs.map((rec, i) => (
                    <TableRow key={i}>
                        <TableCell className={c.recTableCell}>{i+1}.</TableCell>
                        <TableCell className={c.recTableCell}>
                            <img className={c.recImg} src={rec.thumbnail_url}/>
                        </TableCell>
                        <TableCell className={c.recTableCell}>{rec.title}</TableCell>
                        <TableCell className={c.recTableCell}>{rec.artist}</TableCell>
                        <TableCell className={c.recTableCell}>
                            {Math.round((rec.similarity_score) * 1000) / 1000}
                        </TableCell>
                        <TableCell className={c.buttonCell}>
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={(e) => handleLyricsCompareOpen(e, i)}
                            >
                                Compare
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </TableContainer>
        </div>
    )
}

export default TrackPage
