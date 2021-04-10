# Project DiamondHands API Documentation

## Timetable API

### Create

- description: add a new timetable
- request: `POST /api/timetables/`
    - content-type: `application/json`
    - body: object
      - title: (string) the title of the timetable
      - userID: (string) the userID we're creating the timetable for
      - email: (string) the email of current signed in user
- response: 200
    - content-type: `application/json`
    - body: object
      - title: (string) the title of the timetable
      - userID: (string) the userID we're creating the timetable for
      - events: (array) list of events for the timetable (initialized as empty)
``` 

$ curl --request POST \
  --url http://localhost:3000/api/timetables/ \
  --header 'Content-Type: application/json' \
  --data '{"title":"dfgh","userID":"test@test.ca", "email": "test@test.ca"}
'
```

- description: add a new event
- request: `POST /api/events/`
    - content-type: `application/json`
    - body: object
      - tableID: (string) the tableID of the table we're adding the event to
      - title: (string) the title of the event
      - start: (date) the start date of the event
      - end: (date) the end date of the event
      - description: (string) a description of the event
      - email: (string) the email of current signed in user
      - sharedTimetables: (array) list of sharedTimetables the user has access to
- response: 200
    - content-type: `application/json`
    - body: object
      - title: (string) the title of the timetable
      - userID: (string) the owner of the timetable
      - events: (array) list of events for the timetable (now including the newest one)
``` 

$ curl --request POST \
  --url http://localhost:3000/api/events/ \
  --header 'Content-Type: application/json' \
  --data '{"tableID": "6054fa7272e6c83458348bf3", "title":"test", "start":"2021-03-15T04:00:00.000Z", "end": "2021-03-15T04:00:00.000Z", "description": "test", "email": "test@test.ca"}
'
```


- description: login to a user
- request: `POST /signin/`
    - content-type: `application/json`
    - body: object
      - username: (string) the username
      - password: (string) the password
- response: 200
    - content-type: `application/json`
    - body: (string) string saying user has signed in
``` 

$ curl --request POST \
  --url http://localhost:3000/signin/ \
  --header 'Content-Type: application/json' \
  --data '{"username":"dfgh","password":"kjhkh"}
'
```

### Read

- description: sign out of a user
- request: `GET /signout/`
- response: 200
    - content-type: `application/json`
    - body: 
``` 

$ curl --request GET \
  --url 'http://localhost:3000/signout/'
```

- description: retrieve the timetables for a user "userID"
- request: `GET /api/timetables/:userID`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the timetable id
      - title: (string) the title of the timetable
      - userID: (string) the userID we're creating the timetable for
      - events: (array) list of events for the timetable (initialized as empty)
 
``` 
$ curl --request GET \
  --url 'http://localhost:3000/api/timetables/test@test.ca'
``` 

- description: retrieve the events that belong to timetable "tableID"
- request: `GET /api/events/:tableID`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - tableID: (string) the tableID of the table the event belongs to
      - title: (string) the title of the event
      - start: (date) the start date of the event
      - end: (date) the end date of the event
      - description: (string) a description of the event
      - email: (string) the email of current signed in user
 
``` 
$ curl --request GET \
  --url 'http://localhost:3000/api/events/6054fa7272e6c83458348bf3'
``` 
  
### Delete
  
- description: delete a timetable
- request: `DELETE /api/timetables/`
    - content-type: `application/json`
    - body: (string) the tableID of the timetable to be deleted
- response: 200
    - content-type: `application/json`
    - body: (object) the timetable that got deleted


$ curl --request DELETE \
  --url http://localhost:3000/timetables/ \
  --header 'Content-Type: application/json' \
  --data '{"tableID":"6054fa7272e6c83458348bf3"}
'
```

- description: delete an event
- request: `DELETE /api/events/`
    - content-type: `application/json`
    - body: object
      - tableID: (string) the tableID of the table the event belongs to
      - event: (object) the event to be deleted
      - sharedTimetables: (array) list of sharedTimetables the user has access to
- response: 200
    - content-type: `application/json`
    - body: (object) the timetable the event got deleted from


$ curl --request DELETE \
  --url http://localhost:3000/events/ \
  --header 'Content-Type: application/json' \
  --data '{"tableID":"6054fa7272e6c83458348bf3", "event": {"start":"2021-04-09T04:00:00.000Z", "end":"2021-04-09T04:00:00.000Z", "title":"test", "description": "test"}, "sharedTimetables": []}'
```

### Patch

- description: update an event
- request: `PATCH /api/events/`
    - content-type: `application/json`
    - body: object
      - tableID: (string) the tableID of the table the event belongs to
      - oldEvent: (object) the event before changes
      - newEvent: (object) the event after changes
      - sharedTimetables: (array) list of sharedTimetables the user has access to
- response: 200
    - content-type: `application/json`
    - body: (object) the timetable the event got updated from

$ curl --request PATCH \
  --url http://localhost:3000/events/ \
  --header 'Content-Type: application/json' \
  --data '{"tableID":"6054fa7272e6c83458348bf3", "oldEvent": {"start":"2021-04-09T04:00:00.000Z", "end":"2021-04-09T04:00:00.000Z", "title":"test", "description": "test"},
  "newEvent": {"start":"2021-04-09T04:00:00.000Z", "end":"2021-04-09T04:00:00.000Z", "title":"testss", "description": "testing"}, "sharedTimetables": []}'
```