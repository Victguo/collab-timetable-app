import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default function DeleteDialog({setTimetable, currTimetable, type, tableID, refreshData}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (submit) => {
    setOpen(false);
    // if the user chose to delete the timetable
    if (submit){
      deleteTimetable();
    }
  };

  const deleteTimetable = async() => {
    const res = await fetch('/api/timetables', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableID: tableID,
      }),
    });
    if (res.status === 200) {

      // edge case of deleting currently selected timetable
      if (tableID == currTimetable) {
        setTimetable(null);

      }
      refreshData();      

    } else {
      // some kinda error?

      // make an alert saying something went wrong
    }
  }

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleClose(false)}         
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Delete " + type + "?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete this {type}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(true)} color="primary">
            Delete
          </Button>
        </DialogActions>
        </Dialog>
        <Tooltip title="Delete" arrow>
            <IconButton onClick={() => handleClickOpen()} aria-label="delete">
                <DeleteIcon/>
            </IconButton>
        </Tooltip>
    </div>
  );
}