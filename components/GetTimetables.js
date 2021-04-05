// TODO: add description field to the event object

import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DeleteDialog from './DeleteDialog';
import ShareDialog from './ShareDialog';
import { makeStyles } from '@material-ui/core/styles';
import "react-big-calendar/lib/css/react-big-calendar.css";

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


export default function GetTimetables({setTimetable, currTimetable, timetables, handleTimetableSelect, refreshData}) {

  const classes = useStyles();

  const handleListItemClick = (event, timetableID, events) => {
    
    handleTimetableSelect(timetableID, events);

  };

  return (
  <List className={classes.root}>
    <ListSubheader disableSticky inset>Your Timetables</ListSubheader>
    {timetables.map((table) => (
      <ListItem 
        key={table._id} 
        button 
        selected={currTimetable === table._id} 
        onClick={(event) => handleListItemClick(event, table._id, table.events)}
      >
        <DeleteDialog setTimetable={setTimetable} currTimetable={currTimetable} type="timetable" tableID={table._id} refreshData={refreshData}></DeleteDialog>
        <ListItemText primary={table.title} classes={{primary:classes.test}} className={classes.inline}/>
        <ShareDialog tableName={table.title} tableID={table._id} refreshData={refreshData}></ShareDialog>
      </ListItem>
    ))}
    <ListSubheader disableSticky inset>Shared with you</ListSubheader>

  </List>);
};
