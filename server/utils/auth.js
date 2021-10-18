const checkAdmin = (req, res, next) => {
    if(req.user.role === 1) next();
    else res.sendStatus(403);
}

const checkUserStatus = (req, res, next) => {
    if(req.user.status === 0) next();
    else res.sendStatus(403);
}

module.exports = {
    checkAdmin,
    checkUserStatus
}