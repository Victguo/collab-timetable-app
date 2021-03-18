// TODO: 
// - add validation after beta?
// - autofill date of selected slot when creating new event


import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function NewEventDialog({open, handleCloseDialog, start, end}) {

  const [eventName, setEventName] = React.useState("");
  const [eventDescription, setEventDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(start);
  const [endDate, setEndDate] = React.useState(end);
  const [invalidName, setInvalidName] = React.useState(false);
  const [invalidDate, setInvalidDate] = React.useState(false);

  // set start and end dates based on user selection
  if (!startDate && start != startDate){
    setStartDate(start);
  }
  if (!endDate && end != endDate){
    setEndDate(end);
  }

  const handleEventNameChange = (name) => {
    setEventName(name.target.value);
  };

  const handleEventDescriptionChange = (description) => {
    setEventDescription(description.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const validateInput = (submit) => {

    // if the user chose to create
    if (submit){
      if (!eventName) {
        setInvalidName(true);
      }
      else if(startDate > endDate) {
        setInvalidDate(true);
        setInvalidName(false);
      }
      else {
        handleCloseDialog("create event", true);
  
        setEventName("");
        setEventDescription("");
        setInvalidName(false);
        setInvalidDate(false);
      }
    }
    // user chose to cancel
    else {
      handleCloseDialog("create event", false)
      setEventName("");
      setEventDescription("");
      setInvalidName(false);
      setInvalidDate(false);
      setStartDate(null);
      setEndDate(null);
    }
  }

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleCloseDialog(null, null)}         
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
        <DialogContent>
          <TextField
            required 
            id="filled-required" 
            label="Name of Event" 
            autoFocus
            fullWidth
            margin="normal"
            variant="outlined"
            error={invalidName}
            helperText={invalidName ? "Please enter a name": ""}
            value={eventName}
            onChange={handleEventNameChange}
          />          
          <TextField 
            id="filled-multiline-static" 
            label="Description of Event (Optional)" 
            multiline
            fullWidth
            rows={4}
            margin="normal"
            variant="outlined"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="start-date-picker"
                label="Start Date" 
                //disablePast - should we allow user to make event in the past?
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                error={invalidDate}
                helperText={invalidDate ? "Start date must be before end date": ""}
                autoOk
              />
              <KeyboardTimePicker
                margin="normal"
                id="start-time-picker"
                label="Start Time"
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                error={invalidDate}
                helperText={invalidDate ? "Start date must be before end date": ""}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="end-date-picker"
                label="End Date"
                disablePast
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                error={invalidDate}
                helperText={invalidDate ? "Start date must be before end date": ""}
                autoOk
              />
              <KeyboardTimePicker
                margin="normal"
                id="end-time-picker"
                label="End Time"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                error={invalidDate}
                helperText={invalidDate ? "Start date must be before end date": ""}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => validateInput(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => validateInput(true)} color="primary">
            Create
          </Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}