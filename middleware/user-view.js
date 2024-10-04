// assign req.session.user to res.locals.user
export const userToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null;
    next();
}