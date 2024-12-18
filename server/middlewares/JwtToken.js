const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extrage token-ul

    if (!token) {
        return res.status(401).json({ error: "Access Token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Access Token invalid or expired" });
        }

        req.user = decoded; // Atașează datele utilizatorului la request
        next();
    });
};

module.exports = authenticateJWT;
