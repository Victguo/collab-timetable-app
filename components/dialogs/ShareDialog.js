import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default function ShareDialog({tableName, tableID, refreshData}) {
  const [open, setOpen] = React.useState(false);
  const [shareLink, setShareLink] = React.useState('');
  let url;
  let baseUrl;

  if (typeof window !== "undefined") {
    url = window.location;
    baseUrl = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
  }

  const handleClickOpen = async () => {
    setOpen(true);
    
    const res = await fetch('/api/invite/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableID: tableID,
        }),
      });
      let timetableInvite;
      if (res.status === 200) {
        timetableInvite = await res.json();
        setShareLink(baseUrl + "invite/" + timetableInvite._id);
        // refreshData();      
  
      } else {
        // some kinda error?
  
        // make an alert saying something went wrong
      }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Dialog 
            open={open} 
            onClose={() => handleClose(false)}         
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Share Timetable"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The link below will allow other users to access timetable "{tableName}"
          </DialogContentText>
          <DialogContentText>
          {shareLink}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Exit
          </Button>
        </DialogActions>
        </Dialog>
        <Tooltip title="Share" arrow>
            <IconButton onClick={() => handleClickOpen()} aria-label="share">
                <ShareIcon/>
            </IconButton>
        </Tooltip>
    </div>
  );
}