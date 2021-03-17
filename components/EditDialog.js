import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function EditDialog({open, handleCloseDialog}) {

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleCloseDialog(null, null)}         
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Edit Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog("delete", false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseDialog("delete", true)} color="primary">
            Delete
          </Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}