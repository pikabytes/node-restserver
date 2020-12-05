// ========
// token verification
// ========
const jwt = require('jsonwebtoken');


let tokenVerification = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(401).json({
            ok: false,
            err: {
                message: err
            }
        });

        req.user = decoded.user;
        // continue with request method
        next();
    });
};

// =================
// ADMIN VERIFICATION
// =================
let adminRoleVerification = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'User is not administrator.'
            }
        });
    }
}




module.exports = {
    tokenVerification,
    adminRoleVerification
};