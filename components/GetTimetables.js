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

export default function GetTimetables({timetables, handleSelectTimetable}) {

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const getEvent = (title) => {
    return (
      [
        {
          start: moment().toDate(),
          end: moment()
            .add(1, "days")
            .toDate(),
          title: title
        }
      ]
    );
  }
  
  // console.log(timetables);

  const handleListItemClick = (event, index, events) => {
    setSelectedIndex(index);
    selectTimetable(events);
  };

  const selectTimetable = (events) => {

    handleSelectTimetable(
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={getEvent(events)}
        style={{ height: "80vh" }}
      />
    );
  }

  return (
  <List className={classes.root}>
    <ListSubheader disableSticky inset>Your Timetables</ListSubheader>
    {timetables.map((table) => (
      <ListItem 
        key={table._id} 
        button 
        selected={selectedIndex === table._id} 
        onClick={(event) => handleListItemClick(event, table._id, table.title)}
      >
        <DeleteDialog></DeleteDialog>
        <ListItemText primary={table.title} classes={{primary:classes.test}} className={classes.inline}/>
      </ListItem>
    ))}
    <ListSubheader disableSticky inset>Shared with you</ListSubheader>

  </List>);
};
