const jwt = require("jsonwebtoken");

function isTeacher(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("req.headers:", req.headers);
  console.log("authHeader:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired Access Token" });
    }
    console.log(decoded);
  
    if (decoded.role !== "teacher") {
      return res.status(403).json({ error: "Access denied" });
    }
    req.user = decoded; // Adaugă datele utilizatorului în request
    next(); // Treci la următoarea funcție middleware sau rută
  });
};

module.exports = {
  isTeacher,  
};
