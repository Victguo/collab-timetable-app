import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ClearIcon from '@material-ui/icons/Clear';
import NewTimetableDialog from '../pages/NewTimetableDialog';
import DeleteDialog from '../pages/DeleteDialog';
import { makeStyles } from '@material-ui/core/styles';

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

export default function GetTimetables({timetables}) {

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
  <List className={classes.root}>
    <ListSubheader disableSticky inset>Your Timetables</ListSubheader>
    {timetables.map((table) => (
      <ListItem 
        key={table._id} 
        button 
        selected={selectedIndex === table._id} 
        onClick={(event) => handleListItemClick(event, table._id)}
      >
        <DeleteDialog></DeleteDialog>
        <ListItemText primary={table.title} classes={{primary:classes.test}} className={classes.inline}/>
      </ListItem>
    ))}
  </List>);
};
