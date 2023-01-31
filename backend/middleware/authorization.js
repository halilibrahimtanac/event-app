const jwt = require("jsonwebtoken");

exports.Authorization = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "token_secret_key", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        console.log(decodedToken);
        req.userId = decodedToken.userId;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
