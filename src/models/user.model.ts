import { Status } from "./status.model";

export class User{
    public $key: string;
    public photo: string;
    constructor(
        public name: string,
        public username: string,
        public email: string,
        public type: string,
        public status: Status
    ){
        
    }
}