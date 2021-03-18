import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import NewTimetableDialog from './NewTimetableDialog';
import DeleteDialog from './DeleteDialog';
import { makeStyles } from '@material-ui/core/styles';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '85vh',
  },
  inline: {
    display: 'inline',
  },
  test: {
    fontSize: '1.1em',
  }
}));

export const mainListItems = (
  <div>
    {/* <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Create new Timetable" onClick={} />
    </ListItem> */}
    <NewTimetableDialog>
      
    </NewTimetableDialog>
  </div>
);

export let timetables;

export default function GetTimetables({timetables, handleTimetableSelect, handleSelectedEvent, handleSelectedSlot}) {

  const classes = useStyles();
  const [selectedTimetable, setSelectedTimetable] = React.useState(1);

  let test = (
    [
      {
        start: moment().toDate(),
        end: moment()
          .add(1, "days")
          .toDate(),
        title: "title"
      }
    ]
  );

  const getEvents = (title) => {

    // get the events from the database
    return test;
  }

  const setEvent = (start, end, title, timetable) => {

    let events = getEvents(timetable);

    events.push({
      start,
      end,
      title
    })

    selectTimetable(events);

    // push it to the database

  };

  const handleListItemClick = (event, timetableID, events) => {
    setSelectedTimetable(timetableID);
    selectTimetable(events);
  };

  const handleSlotSelect = (slotInfo) => {

    // clicked on one day
    if (slotInfo.box) {
      handleSelectedSlot(slotInfo.box.x, slotInfo.box.y, slotInfo.start, slotInfo.end);
    } 
    // clicked on more than one day
    else if (slotInfo.bounds) {
      handleSelectedSlot(slotInfo.bounds.x, slotInfo.bounds.y, slotInfo.start, slotInfo.end);
    }

  };

  const handleEventSelect = (event, e) => {

    handleSelectedEvent(e.pageX, e.pageY);

  }

  // const handleEventClose = () => {
  //   //setAnchorEl(null);
  // };

  const selectTimetable = (events) => {

    let timetable = (
      <div>
        <Calendar
          selectable
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={getEvents(events)}
          style={{ height: "80vh" }}
          onSelectSlot={handleSlotSelect}
          onSelectEvent={(event, e) => handleEventSelect(event, e)}
        />
      </div>
    )
    handleTimetableSelect(timetable);
  }

  return (
  <List className={classes.root}>
    <ListSubheader disableSticky inset>Your Timetables</ListSubheader>
    {timetables.map((table) => (
      <ListItem 
        key={table._id} 
        button 
        selected={selectedTimetable === table._id} 
        onClick={(event) => handleListItemClick(event, table._id, table.title)}
      >
        <DeleteDialog type="timetable"></DeleteDialog>
        <ListItemText primary={table.title} classes={{primary:classes.test}} className={classes.inline}/>
      </ListItem>
    ))}
    <ListSubheader disableSticky inset>Shared with you</ListSubheader>

  </List>);
};
