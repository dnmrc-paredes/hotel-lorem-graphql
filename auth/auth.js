const jwt = require(`jsonwebtoken`)

const authJWT = (req, res, next) => {
    
    let token

        if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
           token = req.headers.auth.split(` `)[1]

           jwt.verify(token, process.env.JWT_KEY)
           return next()
        }

        if (!token) {
            throw Error (`Unauthorized.`)
        }

}

module.exports = authJWT