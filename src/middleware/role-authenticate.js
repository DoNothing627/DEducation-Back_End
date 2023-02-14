const HttpStatus = require("http-status-codes");

function roleAuthorize(roles = []) {
  // if (typeof roles === 'string') {
  //     roles = [roles];
  // }

  return (req, res, next) => {
    // let user = req.user
    // if (roles.length && !roles.includes(user.role)) {
    //     // user's role is not authorized
    //     return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No permission!' });
    // }

    // authentication and authorization successful
    next();
  };
}

module.exports = roleAuthorize;
