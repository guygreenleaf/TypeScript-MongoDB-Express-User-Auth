import { Request, Response } from 'express';
import Users from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as tokenModule from '../config/generateToken';
import sendEmail from '../config/sendMail'
import * as validator from '../middleware/valid'
import SendmailTransport from 'nodemailer/lib/sendmail-transport';
import {sendSms} from '../config/sendSMS';
import { Token, UserInterface } from '../config/newUserInterface';

const CLIENT_URL = `${process.env.BASE_URL}`


const authCtrl = {
    //Registration Authentication controller
    register: async(req: Request, res: Response) =>{
        try {
            //name, account (email), and password
            const {name, account, password} = req.body
            //Check if user already exists
            const user = await Users.findOne({account})
            if(user) return res.status(400).json({msg: "Email or phone number already exists."})
            //Hash password
            const passwordHash = await bcrypt.hash(password, 12)
            //Create the new user
            const newUser = {
                name, account, password: passwordHash
            }

            const active_token = tokenModule.generateActiveToken({newUser});

            const url = `${CLIENT_URL}/active/${active_token}`

            if(validator.validateEmail(account)){
                sendEmail(account, url, 'Verify your email address.' );
                return res.json({
                    msg: "Successful register, please check your email."
                });
    
            }
            else if (validator.validPhone(account)){
                sendSms(account, url, "Verify your phone number for Guy's blog");
                return res.json({msg:"Sms sent, please check your phone!"});
            }
        

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    //Activate Account Authentication controller
    activateAccount: async(req: Request, res: Response) =>{
        try {
            const {active_token} = req.body;
            //Make whatever is returned from jwt.verify() into type Token
            const decoded = <Token>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

            const {newUser} = decoded;

            if(!newUser) return res.status(400).json({msg: "Error activating account, please try creating your account again."})
            const user = new Users(newUser)

            await user.save();
            res.json({msg: "Account successfully activated."})

            console.log(decoded);
        } catch (error) {
            let errMsg;

            if(error.code === 11000){
                errMsg = Object.keys(error.keyValue)[0] + " already exists."
            }else{
                let name = Object.keys(error.errors)[0];
                errMsg = error.errors[`${name}`].message;
                // console.log(error);
            };

            return res.status(500).json({msg: errMsg});
        }
    },
    login: async(req: Request, res: Response) => {
        try{
            const {account, password} = req.body;

            //Find the user, if we can't find one send a 500 response.
            const user = await Users.findOne({account});
            if(!user){
                res.status(500).json({msg: "Unable to find user - Please register."});
            }
            loginUser(user, password, res);
        }
        catch (error){
            return res.status(500).json({msg: error.message});
        }
    },
    refreshToken: async(req: Request, res: Response) => {
        try {
          const rf_token = req.cookies.refreshtoken
          if(!rf_token) return res.status(400).json({msg: "User not logged in"})
    
          const decoded = <Token>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
          if(!decoded.id) return res.status(400).json({msg: "User not logged in"})
    
          const user = await Users.findById(decoded.id).select("-password")
          if(!user) return res.status(400).json({msg: "This account does not exist."})
    
          const access_token = tokenModule.generateAccessToken({id: user._id})
    
          res.json({access_token})
          
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      },
    logout: async(req: Request, res: Response) => {
        try{
            if(getCookie !== null){
            res.clearCookie('refreshtoken', {path: `/api/refresh_token`});

            return res.json({msg: "Logged out."});
            }
            else{
                return res.json({msg: "User is already logged out."});
            }
        }
        catch (error){
            return res.status(500).json({msg: error.message});
        }
    },
}

const loginUser = async (user: UserInterface | null, password: string, res: Response) => {

    if(user !== null){
   
    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) return res.status(400).json({msg: "Password incorrect."});

    
    const access_token = tokenModule.generateAccessToken({id: user._id});
    const refresh_token = tokenModule.generateRefreshToken({id: user._id});

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30*24*60*60*1000 // 30 days
    });

    res.json({
        msg: 'Login Success',
        access_token,
        user: {...user._doc, password: ''}
    });

}


};



function getCookie( name: string ) {
    var dc,
        prefix,
        begin,
        end;
    
    dc = document.cookie;
    prefix = name + "=";
    begin = dc.indexOf("; " + prefix);
    end = dc.length; // default to end of the string

    // found, and not in first position
    if (begin !== -1) {
        // exclude the "; "
        begin += 2;
    } else {
        //see if cookie is in first position
        begin = dc.indexOf(prefix);
        // not found at all or found as a portion of another cookie name
        if (begin === -1 || begin !== 0 ) return null;
    } 

    // if we find a ";" somewhere after the prefix position then "end" is that position,
    // otherwise it defaults to the end of the string
    if (dc.indexOf(";", begin) !== -1) {
        end = dc.indexOf(";", begin);
    }

    return decodeURI(dc.substring(begin + prefix.length, end) ).replace(/\"/g, ''); 
}

export default authCtrl;