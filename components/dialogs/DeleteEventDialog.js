import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeleteEventDialog({selectedEvent, open, handleCloseDialog}) {

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleCloseDialog(null, null, null)}         
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Delete event?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog("delete", false, null)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseDialog("delete", true, selectedEvent)} color="primary">
            Delete
          </Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}