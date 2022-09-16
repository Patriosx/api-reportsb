# RSB (report stolen bikes) API

Backend Coding Challenge.

Application for users to report their stolen bikes

Teck Stack used:

<ul>
<li>NodeJS</li>
<li>Express</li>
<li>MongoDB</li>
<li>Mongoose</li>
</ul>

As user you can:

<ol>
<li>Register</li>
<li>Login</li>
<li>Report stolen bike</li>
</ol>

Production: [heroku](https://api-rsb.herokuapp.com/)

## How To Use in local

1. Clone the repo

```bash
https://github.com/Patriosx/api-reportsb.git
```

2. Use the package manager [npm](https://www.npmjs.com/package/npm) to install RSB API dependencies.

```bash
npm install
```

3. Run the app

```bash
npm run dev
```

4. If everthing is correct, you will see the messages Listening and then BD connected

## Usage with REST Client extension (http folder)

\*For user currentLocation, It will be given by Geolocation API thorugh the frontend

1. Register user:

   POST http://localhost:5000/auth/signup/ HTTP/1.1

   Content-Type: application/json

   {

   "email": "email@email.com",

   "fullname": "name lastname",

   "phone":"928 111 000",

   "password": "password",

   "currentLocation": {"lat":20.55, "lng":-55.96},

   "address": "fake stret 123"

   }

2. Login

   http://localhost:5000/auth/login HTTP/1.1

   Content-Type: application/json

   {

   "email":"email@email.com",

   "password":"password"

   }

3. use \_id of the user :e.g 6318ab26e7acbe19e2e9a302 to report a stolen bike

4. report a stolen bike

   POST http://localhost:5000/case/stolen_bike/ HTTP/1.1

   Content-Type: application/json

   {

   "brand": "Bianchi",

   "model": "racing 3x",

   "license":"BK-9600",

   "color": "black and gray",

   "type": "racing",

   "desc": "It has two stickers of rick and morty",

   "owner": "6318ab26e7acbe19e2e9a302"

   }

5. use \_id of the bike :e.g 631c63b3f895b49f3501d700 to open new case

6. register new case

   POST http://localhost:5000/case/new_case HTTP/1.1

   Content-Type: application/json

   {

   "stolenBike":"631c63b3f895b49f3501d700",

   "descriptionTheft": "I left my bike in the bike parking of San telmo",

   "locationTheft": {"lat":20.55, "lng":-55.96},

   "dateTheft":"06/09/2022"

   }

\*locationTheft, It will be given by Google Geocoding API

7. You will be notify by email if there is a police officer free to atend your case.

8. You will be notified when the case is solved.

## TODO

Integration testing

Client side

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
