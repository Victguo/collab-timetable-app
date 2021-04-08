import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';

export default function NewTimetableDialog({refreshData, user}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleTitleChange = (title) => {
    setTitle(title.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (submit) => {
    setOpen(false);
    setTitle("");
    if (submit) {
      insertTimetable();
    }
  };

  const insertTimetable = async() => {
    const res = await fetch('/api/timetables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        userID: user.email
      }),
    });
    if (res.status === 200) {

      refreshData();

    } else {
      // some kinda error?
    }
  }

  return (
    <div>
      <ListItem button onClick={() => handleClickOpen()}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create Timetable" />
      </ListItem>
      <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Timetable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name for your new Timetable
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="filled-required"
            label="Name"
            fullWidth
            onChange={handleTitleChange}
            value={title}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(true)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}