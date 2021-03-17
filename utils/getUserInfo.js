export function getUserInfo(req) {
    if (req.user) {
        return {email} = req.user;
    }
    return null
}