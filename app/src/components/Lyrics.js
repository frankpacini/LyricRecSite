import { React, useState, useEffect, useRef } from 'react'
import config from '../config.js'

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Lyrics(props) {
    const [mode, setMode] = useState(null);

    useEffect(() => {
        if(props.rec != null) {
            setMode('compare')
        } else {
            setMode('lyrics')
        }
    }, [props.rec]);

    return (
        <Dialog className={mode} open={props.open} style={{margin: "1rem"}} onClose={props.handleClose}>
            <TableContainer>
                <TableHead>
                    <TableCell><h2>{props.track.title} by {props.track.artist}</h2></TableCell>
                    {props.rec != null && (
                        <TableCell><h2>{props.rec.title} by {props.rec.artist}</h2></TableCell>
                    )}
                </TableHead>
                <TableBody>
                    <TableRow style={{verticalAlign: 'top'}}>
                        <TableCell style={{padding: '0px', overflowX: 'clip'}}>
                            <Box style={{maxHeight: '100vh', overflow: 'auto', padding: '16px'}}>
                                <Typography style={{whiteSpace: 'pre-line'}}>{props.track.lyrics}</Typography>
                            </Box>
                        </TableCell>
                        
                        {props.rec != null && (
                            <TableCell style={{padding: '0px', overflowX: 'clip'}}>
                                <Box style={{maxHeight: '100vh', overflow: 'auto', padding: '16px'}}>
                                    <Typography style={{whiteSpace: 'pre-line'}}>{props.rec.lyrics}</Typography>
                                </Box>
                            </TableCell>
                        )}
                    </TableRow>
                </TableBody>
            </TableContainer>
        </Dialog>

            // <Dialog open={props.open} style={{margin: "1rem"}} onClose={props.handleClose}>
            //     <div style={{display: 'flex', maxHeight: '20%'}}>
            //         <DialogTitle>
            //             {props.track.title} by {props.track.artist}
            //         </DialogTitle>
            //         {props.rec != null && (
            //             <DialogTitle>
            //                 {props.rec.title} by {props.rec.artist}
            //             </DialogTitle>
            //         )}
            //     </div>
            //     <hr></hr>
            //     <div style={{display: 'flex', maxHeight: '80%', overflow: 'hidden'}}>
            //         <div style={{overflow: 'hidden', maxHeight: '100%'}}>
            //             {/* <DialogTitle>
            //                 {props.track.title} by {props.track.artist}
            //             </DialogTitle>
            //             <hr></hr> */}
            //             <div style={{padding: '16px 24px', height: '85%', overflow: 'scroll', maxHeight: '100%'}}>
            //                 <Typography style={{whiteSpace: 'pre-line'}}>
            //                     {props.track.lyrics}
            //                 </Typography>
            //             </div>
            //         </div>
            //         {props.rec != null && (
            //             <div style={{borderRight: '1px solid black', height: '100%', position: 'absolute', left: '50%'}}></div>
            //         )}
            //         {props.rec != null && (
            //             <div style={{overflow: 'hidden', maxHeight: '100%'}}>
            //                 {/* <DialogTitle>
            //                     {props.rec.title} by {props.rec.artist}
            //                 </DialogTitle>
            //                 <hr></hr> */}
            //                 <div style={{padding: '16px 24px', height: '85%', overflow: 'scroll', maxHeight: '100%'}}>
            //                     <Typography style={{whiteSpace: 'pre-line'}}>
            //                         {props.rec.lyrics}
            //                     </Typography>
            //                 </div>
            //             </div>
            //         )}
            //     </div>
            // </Dialog>
    )
}

export default Lyrics;