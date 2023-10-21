const jwt = require('jsonwebtoken');

const authenticateToken=(req, res, next)=> {
  
  const token = req.header('Authorization');

  if (!token) return res.status(401).send('Access denied.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send('Invalid token.');
  }
}

module.exports={authenticateToken}
