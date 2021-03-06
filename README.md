# Project DiamondHands
- deployed on https://team-diamondhands.vercel.app 
- demo link: https://youtu.be/FgKPXnBEq9Y

## Team members
- Joe Liu
- Victor Guo

## API Documentation
- Located at doc/schema/user.doc.html

## Description of Web Application
- Interactive timetable planner and scheduler, where the users will able to collaborate with each other to plan events and coordinate schedules.
- Users can create a timetable and then share the timetable with others (like friends and classmates) where each person invited can either edit or view the timetable based on permissions granted by the creator.
    - This allows for the users to easily coordinate their schedules (for example planning their classes together) 
    - Users will have the option to fill out timeslots with an event, and the slot will display their name, the title of the event, and an optional description and location of the event
        - Users with edit access can edit slots (for example to add their own name to it if 2 people are in the same class)
- Timetables can only be accessed by either directly inviting another user, or by creating an invite link and people with the link will have access


### Key features that will be completed by the Beta version
- Fetch updates every few seconds (updates or new timeslots)
- Users can create/delete timetables and share with other users
    - Only shared users can access the timetable
- Users can fill out timeslots with events

### Additional features that will be complete by the Final version
- Hosting on custom domain
- Real time synchronization as opposed to updating every few seconds

### Technology that you will use for building the app and deploying it
- React
- Next.JS
- GraphQL
- MongoDB
- Pusher Channels
- Github Pages

### Top 5 technical challenges
- Real time synchronization with editing timeslots
- Using an external email API to send an email for notifications 
- Learning a new programming language and framework (React with Next.js)
- Learning new technologies such as GraphQL, Pusher, and MongoDB 
- Integrating all the different technologies together

