import {React, useState, useEffect} from 'react';
import './App.css';
import config from './config.js';
import Lyrics from "./components/Lyrics";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function TrackPage(props) {

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

    // return (
    //     track != null ? (
    //             <Dialog open={true} style={{margin: "1rem"}}>
    //                 <DialogTitle>
    //                     <img src={track['thumbnail_url']} style={{maxWidth: '75px'}} />
    //                     {track.title}
    //                 </DialogTitle>
    //                 {
    //                     trackRecs.map(rec => {
    //                         return <div>{rec.title}</div>
    //                     })
    //                 }
    //             </Dialog>
    //         ) : (
    //             <div></div>
    //         )
    // )
    if(track == null) {
        if(isLoading) {
            return <CircularProgress/>
        } else {
            return <div></div>
        }
    } else {

    }
    return (
        <div style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', position: 'fixed', marginTop: '25vh'}}>
            <Lyrics track={track} rec={selectedRec} open={lyricsOpen} handleClose={handleLyricsClose}/>
            <div style={{display: 'flex', marginTop: '8vh', flexDirection: 'column', marginRight: '20px', justifyContent: 'flex-start', alignItems: 'center'}}>
                <img src={track.thumbnail_url} 
                            style={{maxWidth: '20vh', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                <h2 style={{marginBottom: '5px', textAlign: 'center'}}>{track.title}</h2>
                <h3 style={{marginTop: '0px', textAlign: 'center'}}>{track.artist}</h3>
                <Button 
                    variant="outlined" 
                    size="medium" 
                    style={{width: '80%'}}
                    onClick={handleLyricsOpen}
                >
                    View Lyrics
                </Button>
            </div>
            <TableContainer style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginLeft: '20px'}}>
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
                        <TableCell style={{verticalAlign: "middle"}}>{i+1}.</TableCell>
                        <TableCell style={{verticalAlign: "middle"}}>
                            <img src={rec.thumbnail_url} 
                                style={{maxWidth: '7vh'}} />
                        </TableCell>
                        <TableCell style={{verticalAlign: "middle"}}>{rec.title}</TableCell>
                        <TableCell style={{verticalAlign: "middle"}}>{rec.artist}</TableCell>
                        {/* <TableCell>{Math.round((1 - rec.similarity_score / 15) * 1000) / 1000}</TableCell> */}
                        <TableCell style={{verticalAlign: "middle"}}>
                            {Math.round((rec.similarity_score) * 1000) / 1000}
                        </TableCell>
                        <TableCell style={{padding: '0px', verticalAlign: "middle"}}>
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
        
        {/* <Dialog open={true}>
            <DialogTitle style={{padding: "1rem"}}>
                
                Karma Police
            </DialogTitle>
            <TableContainer component={Paper} style={{padding: "1rem"}}>
                <TableHead>
                    <TableCell>#</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Artist</TableCell>
                    <TableCell>Score</TableCell>
                </TableHead>
                <TableBody>
                {
                    trackRecs.map((rec, i) => (
                        <TableRow>
                            <TableCell>{i+1}.</TableCell>
                            <TableCell>Climbing Up The Walls</TableCell>
                            <TableCell>Radiohead</TableCell>
                            <TableCell>0.9</TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
            </TableContainer>
        </Dialog> */}
        </div>
    )
}

export default TrackPage
