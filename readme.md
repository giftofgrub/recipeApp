# ReciPeep App

ReciPeep is a concept app created to show a recipe sharing platform. Anyone can view the posted recipes,but other features need the user to be registered. Once registered, users can create recipes and comment on recipes

The app is served via [Express](https://expressjs.com/) running on a [NodeJS](https://nodejs.org/en/) backend, [MongoDB](https://www.mongodb.com/) managed by [Mongoose](https://mongoosejs.com/) as data storage, and [EJS](https://ejs.co/) templates for the frontend.
___
#### Features
 - User account creation: User authentication is done using [Passport](http://http://www.passportjs.org/)
 - Recipe creation: users can post new recipes.
 - Comment creation: users can post comments to any recipe

___
#### Using the app
Coming from the cloned project folder, install all dependencies

```sh
$ npm install
```
If using a local MongoDB Database, on a separate terminal
```sh
$ mongod
```
Start server
```sh
$ node app.js
```