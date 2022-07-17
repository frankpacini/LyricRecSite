import { React, useState, useEffect, useCallback } from 'react'
import config from '../config.js'

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Lyrics(props) {
    const [mode, setMode] = useState(null);
    // const elementRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if(props.rec != null) {
            setMode('compare')
        } else {
            setMode('lyrics')
        }
    }, [props.rec]);

    const elementRef = useCallback(node => {
        console.log(node);
        if (node !== null) {
            var newHeight = Math.round((node.parentNode.clientHeight - node.clientHeight) / node.parentNode.clientHeight);
            setHeight(newHeight);
        }
      }, [props.open]);

    // useEffect(() => {
    //     console.log(elementRef);
    //     if(elementRef.current?.clientHeight != undefined) {
    //         var newHeight = Math.round((elementRef.current.parent.clientHeight - elementRef.current.clientHeight) / elementRef.current.parent.clientHeight);
    //         console.log(newHeight);
    //         setHeight(newHeight);
    //     }
    // }, [elementRef]);

    return (
        <Dialog className={mode} open={props.open} style={{margin: "1rem"}} onClose={props.handleClose}>
            <TableContainer>
            {/* <TableContainer style={{maxHeight: "100%", height: "100%"}}> */}
                <Table stickyHeader>
                    <TableHead>
                        <TableCell><h2>{props.track.title} by {props.track.artist}</h2></TableCell>
                        {props.rec != null && (
                            <TableCell><h2>{props.rec.title} by {props.rec.artist}</h2></TableCell>
                        )}
                    </TableHead>
                    <TableBody>
                        <TableRow style={{verticalAlign: 'top'}}>
                        {/* <TableRow> */}
                            <TableCell style={{padding: '0px', overflowX: 'clip'}}>
                            {/* <TableCell> */}
                                <Box style={{maxHeight: '70vh', overflow: 'auto', padding: '16px'}}>
                                    <Typography style={{whiteSpace: 'pre-line'}}>{props.track.lyrics}</Typography>
                                </Box>
                            </TableCell>
                            
                            {props.rec != null && (
                                <TableCell style={{padding: '0px', overflowX: 'clip'}}>
                                {/* <TableCell> */}
                                    <Box style={{maxHeight: '70vh', overflow: 'auto', padding: '16px'}}>
                                        <Typography style={{whiteSpace: 'pre-line'}}>{props.rec.lyrics}</Typography>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableBody>
                </Table>
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