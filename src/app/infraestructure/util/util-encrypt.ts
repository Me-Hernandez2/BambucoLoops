import * as CryptoJS from 'crypto-js'
import {environment} from "../../../environments/environment";


export const encrypt = (data:string): string => {
    return CryptoJS.AES.encrypt(data, 'bambucoloops').toString();
};

export const decrypt = (valueEncrypt: string) : string => {
    const valueDecrypt = CryptoJS.AES.decrypt(valueEncrypt, 'bambucoloops').toString(CryptoJS.enc.Utf8);
    if(!valueDecrypt){
        return null;
    }
    return valueDecrypt;
}
