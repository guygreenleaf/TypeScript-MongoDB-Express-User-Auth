# What This Is
This is a starting point for user account creation and authentication using TS and MongoDB.  This starting point includes authentication via JWT w/refresh and access tokens, validation of email and/or phone number (through Twilio's API), and more.


# Starting scripts:
yarn init 

yarn add express mongoose dotenv cors morgan cookie-parser bcrypt jsonwebtoken nodemailer google-auth-library twilio

# dev dependencies
yarn add @types/express @types/mongoose @types/dotenv @types/cors @types/morgan @types/cookie-parser @types/nodemailer @types/bcrypt @types/jsonwebtoken --dev

# create tsconfig
yarn tsc --init

# create dist
yarn tsc

# run dist
node dist/index.js

# start dev server
yarn devServer

# Scripts are in package.json file for ease of build/run/dev

# MongoDB Atlas instructions:
Create new project
Create cluster with whatever name
Go to Database Access tab and add as database user
Go to network tab to add IP 0.0.0.0/0


# Configure auth at console.google.cloud




