# Project DiamondHands

## Team members
- Joe Liu
- Victor Guo

## Description of Web Application
- Interactive timetable planner and scheduler, where the users will able to collaborate with each other to plan events and coordinate schedules.
- Users can create a timetable and then share the timetable with others (like friends and classmates) where each person invited can either edit or view the timetable based on permissions granted by the creator.
    - This allows for the users to easily coordinate their schedules (for example planning their classes together) 
    - Users will have the option to fill out timeslots with an event, and the slot will display their name, the title of the event, and an optional description and location of the event
        - Users with edit access can edit slots (for example to add their own name to it if 2 people are in the same class)
    - There will be a notification option where users can be notified prior to an event (like text or email)


### Key features that will be completed by the Beta version
- Fetch updates every few seconds (updates or new timeslots)
- Users can create/delete timetables and share with other users
    - Only shared users can access the timetable
- Users can fill out timeslots with events
- Users can receive notifications prior to event and on event update

### Additional features that will be complete by the Final version
- Hosting on custom domain
- Real time synchronization as opposed to updating every few seconds
- Having a view only option instead of everyone invited can edit

### Technology that you will use for building the app and deploying it
- React
- GraphQL
- MongoDB
- Github Pages

### Top 5 technical challenges
- Making it mobile friendly
- Real time synchronization with editing timeslots
- Implementing SMS Messaging for notifications
- Using an external email API to send an email for notifications 
- Learning and integrating React, GraphQL, and MongoDB all together