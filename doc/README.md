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
  --data '{"username":"dfgh","password":"kjhkh"}
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

- description: add a new image
- request: `POST /api/images/`
    - content-type: `multipart/form-data`
    - body: object
      - title: (string) the image title
      - author: (string) the image author's name
      - date: (string) the date the image was posted in word form
    - file
      - fieldname: (string) the variable name of the image
      - originalname: (string) the name of the file
      - encoding: (string) the encoding type
      - mimetype: (string) the type of the image
      - path: (string) the path to the image
      - destination: (string) the folder to place the image file
      - size: (int) the size of the image file
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
      - title: (string) the image title
      - author: (string) the image author's name
      - mimetype: (string) the type of the image
      - path: (string) the path to the image
      - date: (string) the date the image was posted in word form
      - createdAt: (string) the date the image was created
      - updatedAt: (string) the date the image was last updated
``` 

$ curl --request POST \
  --url http://localhost:3000/api/images/ \
  --header 'Content-Type: multipart/form-data' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form author=joe \
  --form title=joe \
  --form picture=joe.png
  
```

- description: add a new comment
- request: `POST /api/comments/`
    - content-type: `application/json`
    - body: object
      - imageID: (string) the id of the image the comment goes under
      - author: (string) the authors name
      - content: (string) the content of the comment
      - date: (string) the date the comment was posted in word form
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the comment id
      - imageID: (string) the id of the image the comment goes under
      - author: (string) the authors name
      - content: (string) the content of the comment
      - date: (string) the date the comment was posted in word form
      - createdAt: (string) the date the comment was created
      - updatedAt: (string) the date the comment was last updated
``` 

$ curl --request POST \
  --url http://localhost:3000/api/comments/ \
  --header 'Content-Type: application/json' \
  --data '{"author":"dfgh","content":"kjhkh","imageID":"JcA5c4pbSqrcrOHB","date":"Sat Feb 13 2021","_id":"0DpgN8LT739JCSWe"}
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

- description: retrieve the gallery on page page
- request: `GET /api/users/?[page=page]`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the user id
      - hash: (string) the hash of the password
      - createdAt: (string) the date the user was created
      - updatedAt: (string) the date the user was last updated
 
``` 
$ curl --request GET \
  --url 'http://localhost:3000/api/users/?page=0'
``` 

- description: retrieve the latest 5 comments for a given image id on page page
- request: `GET /api/comments/?imageID=id&page=page`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the comment id
      - imageID: (string) the id of the image the comment goes under
      - author: (string) the authors name
      - content: (string) the content of the comment
      - date: (string) the date the comment was posted in word form
      - createdAt: (string) the date the comment was created
      - updatedAt: (string) the date the comment was last updated
 
``` 
$ curl --request GET \
  --url 'http://localhost:3000/api/comments/?imageID=l4CpGUiCV43W73l0&page=0'
``` 

- description: retrieve an image's info on belonging to gallery user
- request: `GET /api/images/?user=1`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the image id
      - title: (string) the image title
      - author: (string) the image author's name
      - mimetype: (string) the type of the image
      - path: (string) the path to the image
      - date: (string) the date the image was posted in word form
      - createdAt: (string) the date the image was created
      - updatedAt: (string) the date the image was last updated
 
``` 
$ curl --request GET \
  --url 'http://localhost:3000/api/images/?user=1'
``` 

- description: retrieve the total number of users
- request: `GET /api/users/count/`
- response: 200
    - content-type: `application/json`
    - body: (int) the number of users in the database 

``` 
$ curl http://localhost:3000/api/images/count/?gallery=1
``` 

- description: retrieve the total number of images for a gallery
- request: `GET /api/images/count/?user=1`
- response: 200
    - content-type: `application/json`
    - body: (int) the number of images in the gallery 

``` 
$ curl http://localhost:3000/api/images/count/?user=1
``` 

- description: retrieve the total number of comments for image id
- request: `GET /api/comments/count/?imageID=id`
- response: 200
    - content-type: `application/json`
    - body: (int) the number of comments for an image 

``` 
$ curl http://localhost:3000/api/comments/count/?imageID=l4CpGUiCV43W73l0
``` 

- description: retrieve a specified image id
- request: `GET /api/images/:_id/profile/picture/`
- response: 200
    - content-type: `image`
``` 
$ curl --request GET \
  --url http://localhost:3000/api/images/l4CpGUiCV43W73l0/profile/picture/
``` 

  
### Delete
  
- description: delete the comment id
- request: `DELETE /api/comments/:id/`
- response: 200
    - content-type: `application/json`
    - body: (int) the number of comments deleted (0 if the message didnt exist)

``` 
$ curl -X DELETE
       http://localhost:3000/api/comments/jed5672jd90xg4awo789/
``` 

- description: delete the image id
- request: `DELETE /api/images/:id/`
- response: 200
    - content-type: `application/json`
    - body: (int) the number of images deleted (0 if the image didnt exist)

``` 
$ curl -X DELETE
       http://localhost:3000/api/images/l4CpGUiCV43W73l0/
``` 