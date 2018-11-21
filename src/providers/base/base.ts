import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { ErrorLog } from '../../models/error-log.model';
import { Device } from '@ionic-native/device';

const extractError = (error: Response | any): string => {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
}

export abstract class BaseProvider {

    constructor() { 
    }

    protected handlePromiseError(error: Response | any, db: AngularFireDatabase, device: Device): Promise<any> {
        let deviceInfo = {
            id : device.uuid,
            model : device.model,
            cordova : device.cordova,
            platform : device.platform,
            version : device.version,
            manufacturer : device.manufacturer,
            serial : device.serial,
            isVirtual : device.isVirtual
        } 
        db.list("error-logs").push(new ErrorLog(error, Date.now(), deviceInfo))
            .transaction(() => {}, (a,b,c) => {console.error(a)}, true)
            .catch(console.error);
        return Promise.reject(extractError(error));
    }

    protected handleObservableError(error: Response | any, db: AngularFireDatabase, device: Device): Observable<any> {
        let deviceInfo = {
            id : device.uuid,
            model : device.model,
            cordova : device.cordova,
            platform : device.platform,
            version : device.version,
            manufacturer : device.manufacturer,
            serial : device.serial,
            isVirtual : device.isVirtual
        }
        db.list("error-logs").push(new ErrorLog(error, Date.now(), deviceInfo))
            .transaction(() => {}, (a,b,c) => {console.error(a)}, true)
            .catch(console.error);
        return Observable.throw(extractError(error));
    }

    mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
        return list
            .snapshotChanges()
            .map(actions => actions.map(action => ({ $key: action.key, ...action.payload.val() })));
    }

    mapObjectKey<T>(object: AngularFireObject<T>): Observable<T> {
        return object
            .snapshotChanges()
            .map(action => ({ $key: action.key, ...action.payload.val() }));
    }

}