This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Application

This application is a simple chat application. First user finds a login screen with choosable username and channel. There is a twist that any given username 
can only be used once. Usernames can be never recovered. My prediction is that in a system like these users would eventually use (paid) third party services to keep their username alive
or start incrementing their username after each lost connection (guest1, guest2, guest3).

The chat itself has a few example commands.

/join to join a channel
/part to leave a channel
/ignore to ignore messages from certain users
/unignore to stop ignoring messages from certain users
/say to say something starting with "/"

Otherwise just type anything to say it.

## Technologies

This project consists of three required parts.

1. MondoDB (https://www.mongodb.com/) database. Install it and run it in default port on local machine.
2. The Node.js backend found in folder "backend". Install it with "npm install". Run it with "npm start" in its folder.
3. The React frontend found in folder "frontend". Install it with "npm install". Run it with "nmp start" in its folder.