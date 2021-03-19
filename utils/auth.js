import crypto from 'crypto';

export function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

export function generateHash (password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}