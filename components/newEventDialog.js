import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function NewEventDialog({open, handleCloseDialog}) {

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleCloseDialog(null, null)}         
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Enter the name of your event
          </DialogContentText>
          <TextField
            required 
            id="filled-required" 
            label="Name" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog("create event", false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseDialog("create event", true)} color="primary">
            Create
          </Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}