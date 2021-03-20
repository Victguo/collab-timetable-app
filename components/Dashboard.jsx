import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
// import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import GetTimetables from '../components/GetTimetables';
import NewTimetableDialog from './NewTimetableDialog';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteEventDialog from '../components/DeleteEventDialog';
import EventDialog from '../components/EventDialog';

const localizer = momentLocalizer(moment);

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const initialMessage = (
  <h1>
    Create or select a timetable on the left!
  </h1>
);

function Event({ event }) {
  return (
    <span>
      <em>{event.title}</em>
      {event.description && ':  ' + event.description}
    </span>
  )
}

function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: 'magenta' }}>{event.title}</em>
      <p>{event.description}</p>
    </span>
  )
}

export default function Dashboard({timetables, refreshData}) {

  const classes = useStyles();
  
  // drawer on the side
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  // clicking on timetables
  const [currTimetable, setTimetable] = React.useState(null);
  const [currTimetableEvents, setCurrTimetableEvents] = React.useState([]);

  const handleTimetableSelect = (timetableID, events) => {

    setTimetable(timetableID);
    setCurrTimetableEvents(events);
  }

  // clicking on events
  const [selectedEvent, setSelectedEvent] = React.useState({x: 0, y: 0, open: false, start: null, end: null, name: null, description: null});

  const handleEventSelect = (event, e) => {

    handleSelectedEvent(e.pageX, e.pageY, event.start, event.end, event.title, event.description);

  }

  const handleSelectedEvent = (x, y, start, end, title, description) => {
    setSelectedEvent({
      x: x,
      y: y,
      open: true,
      start: start,
      end: end,
      title: title,
      description: description
    });
  };

  const createEvent = async(inputs) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableID: currTimetable,
        title: inputs.eventName,
        start: inputs.startDate,
        end: inputs.endDate,
        description: inputs.eventDescription
      }),
    });
    if (res.status === 200) {

      // refreshData();
      refreshEvents();

    } else {
      // some kinda error?

      // make an alert saying something went wrong
    }
  }

  const refreshEvents = async() => {
    const res = await fetch('/api/events/' + currTimetable, {
      method: 'GET',
    });
    if (res.status === 200) {

      let returnedEvents = await res.json();
      setCurrTimetableEvents(returnedEvents);
    }
  }

  // clicking on calendar
  const [selectedSlot, setSelectedSlot] = React.useState({x: 0, y: 0, open: false});
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);

  const handleSelectedSlot = (mouseX, mouseY, start, end) => {
    setStart(start);
    setEnd(end);
    setSelectedSlot({
      x: mouseX,
      y: mouseY,
      open: true,
    });
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

  // what the user clicked on
  const handleCloseEvent = (choice) => {
    // if the user clicked on one of the options
    if (choice) {
      // open corresponding option's dialog
      handleOpenDialog(choice);
    } 
    else {
      setSelectedEvent({
        x: 0,
        y: 0,
        open: false,
        start: null,
        end: null,
        title: null,
        description: null
      });
    }

    setSelectedSlot({      
      x: 0,
      y: 0,
      open: false,
    });
    setStart(null);
    setEnd(null);
  }

  // dialogs
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [eventDialog, setEventDialog] = React.useState({type: "", open: false});

  const handleOpenDialog = (dialog) => {
    switch (dialog){
      // delete dialog
      case "delete":
        setDeleteDialog(true);
        break;
      case "edit":
        setEventDialog({type: "edit", open: true});
        break;
      case "create event":
        setEventDialog({type: "create event", open: true});
        break;
    }
  };

  const handleCloseDialog = (dialog, choice, inputs) => {
    switch (dialog){
      // delete dialog
      case "delete":
        setDeleteDialog(false);
        // if the user chose to delete
        if (choice){
          // call api to delete the event
          deleteTimetable();
        }
        // delete the event
        break;
      
      case "edit":
        setEventDialog({...eventDialog, open: false});
        // if the user chose to make edits
        if (choice){
          // call api to edit the event
        }
        break;
      case "create event":
        setEventDialog({...eventDialog, open: false});
        if (choice) {
          // call api to create the event
          createEvent(inputs);
        }
        break;
    }
    // clear any selected event
    setSelectedEvent({
      x: 0,
      y: 0,
      open: false,
      start: null,
      end: null,
      title: null,
      description: null
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <NewTimetableDialog refreshData={refreshData}>
          </NewTimetableDialog>
        </List>
        <Divider />
        <GetTimetables currTimetable={currTimetable} timetables={timetables} handleTimetableSelect={handleTimetableSelect} refreshData={refreshData} ></GetTimetables>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {/*Use menu component for clicking on events*/}
        <Container maxWidth="lg" className={classes.container}>
          { currTimetable ?
          <Calendar
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={currTimetableEvents}
            style={{ height: "80vh" }}
            onSelectSlot={handleSlotSelect}
            onSelectEvent={(event, e) => handleEventSelect(event, e)}
            components={{
              event: Event,
              agenda: {
                event: EventAgenda,
              },
            }}
          />
          : initialMessage
          }
        </Container>
        <Menu
          id="simple-menu"
          anchorPosition={{left: selectedEvent.x, top: selectedEvent.y}}
          anchorReference="anchorPosition"
          keepMounted
          open={selectedEvent.open}
          onClose={() => handleCloseEvent(null)}
        >
          <MenuItem onClick={() => handleCloseEvent("edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleCloseEvent("delete")}>Delete</MenuItem>
        </Menu>
        <Menu
          id="simple-menu"
          anchorPosition={{left: selectedSlot.x, top: selectedSlot.y}}
          anchorReference="anchorPosition"
          keepMounted
          open={selectedSlot.open}
          onClose={() => handleCloseEvent(null)}
        >
          <MenuItem onClick={() => handleCloseEvent("create event")}>New Event</MenuItem>
        </Menu>
        <DeleteEventDialog open={deleteDialog} handleCloseDialog={handleCloseDialog}></DeleteEventDialog>
        <EventDialog selectedEvent={selectedEvent} type={eventDialog.type} open={eventDialog.open} handleCloseDialog={handleCloseDialog} start={start} end={end}></EventDialog>

      </main>
    </div>
  );
}
