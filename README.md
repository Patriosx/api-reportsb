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

## How To Use

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

## Usage with REST Client extension (http folder)

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

7. You will be notify by email if there is a police officer free to atend your case
