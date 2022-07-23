import { React, useState, useEffect} from 'react'
import config from '../config.js'

import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
    dialog: {margin: "1rem"},
    lyricRow: {verticalAlign: 'top'},
    lyricCell: {padding: '0px', overflowX: 'clip'},
    lyricScroll: {maxHeight: '70vh', overflow: 'auto', padding: '16px'},
    lyricText: {whiteSpace: 'pre-line'}
}));

function Lyrics(props) {
    const c = useStyles();
    const [mode, setMode] = useState(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if(props.rec != null) {
            setMode('compare')
        } else {
            setMode('lyrics')
        }
    }, [props.rec]);

    return (
        <Dialog className={mode} open={props.open} className={c.dialog} onClose={props.handleClose}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableCell><h2>
                            {props.track.title} by {props.track.artist}</h2>
                        </TableCell>
                        {props.rec != null && (
                            <TableCell><h2>
                                {props.rec.title} by {props.rec.artist}
                            </h2></TableCell>
                        )}
                    </TableHead>
                    <TableBody>
                        <TableRow className={c.lyricRow}>
                            <TableCell className={c.lyricCell}>
                                <Box className={c.lyricScroll}>
                                    <Typography className={c.lyricText}>{props.track.lyrics}</Typography>
                                </Box>
                            </TableCell>
                            
                            {props.rec != null && (
                                <TableCell className={c.lyricCell}>
                                    <Box className={c.lyricScroll}>
                                        <Typography className={c.lyricText}>{props.rec.lyrics}</Typography>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Dialog>
    )
}

export default Lyrics;