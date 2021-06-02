import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index'

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'));
app.use(cookieparser());

//Routing
app.use('/api', routes.authRouter)

//Database
import './config/database'

//Server entry point
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port: ', PORT);
})
