const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        console.log("User role:", user.role);
        if (!roles.includes(user.role)) {
            console.log("Access denied: User role not authorized");
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};


module.exports = roleMiddleware;