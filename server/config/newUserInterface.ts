import {Document} from 'mongoose';

export interface UserInterface extends Document{
    name: string
    account: string
    password: string
    avatar: string
    role: string
    type: string
    _doc: object
}


export interface NewUser {
    name: string
    account: string
    password: string
}

export interface Token{
    id?: string
    newUser?: NewUser
    iat: number
    exp: number
}