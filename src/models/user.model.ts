import { Status } from "./status.model";
import { UserSettings } from "./user-settings.model";

export class User{
    public $key: string;
    public photo: string;
    constructor(
        public name: string,
        public username: string,
        public email: string,
        public type: string,
        public status: Status,
        public settings: UserSettings
    ){
        
    }
}