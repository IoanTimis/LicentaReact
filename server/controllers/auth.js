const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Faculty = require('../models/faculty');
const Specialization = require('../models/specialization');
const CompleteProfileToken = require('../models/completeProfileToken');
const teacherEmail = require('../models/teacherEmail');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const checkSession = (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.json({ user: null });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ user: null });
        }
        res.json({ user: decoded });
    });
};

const registerStudent = async (req, res) => {
    try {
        const { first_name, name, email, password, faculty_id, specialization_id, education_level } = req.body;
        sanitizeHtml(first_name);
        sanitizeHtml(name);
        sanitizeHtml(email);

        const hashedPassword = await bcrypt.hash(password, 8);
        
        const userInstance = await User.create({
            first_name: first_name,
            name: name,
            email: email, 
            password: hashedPassword,
            faculty_id: faculty_id,
            specialization_id: specialization_id,
            education_level: education_level,
        });
        res.render('pages/auth/registerSuccess', { user: userInstance });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const registerTeacher = async (req, res) => {
    try {
        const { first_name, name, email, password, title } = req.body;
        sanitizeHtml(first_name);
        sanitizeHtml(name);
        sanitizeHtml(email);
        sanitizeHtml(title);

        const hashedPassword = await bcrypt.hash(password, 8);
        
        const userInstance = await User.create({
            first_name: first_name,
            name: name,
            email: email,
            title: title,
            password: hashedPassword,
            type: 'teacher'
        });
        res.render('pages/auth/registerSuccess', { user: userInstance });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const date = new Date();

    // Generează un nou Access Token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role, complete_profile: decoded.complete_profile },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access Token valabil 15 minute
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Invalid or expired refresh token:", error);
    return res.status(403).json({ error: "Refresh Token invalid or expired" });
  }
};

const generateTokens = (user) => {
    
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });

    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

    return { accessToken, refreshToken };
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const payload = { id: user.id, email: user.email, role: user.type, complete_profile: user.complete_profile };

        // Generează Access și Refresh Tokens
        const { accessToken, refreshToken } = generateTokens(payload);

        // Trimite token-urile către client
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 zile
        });
        
        console.log("User logat =============================",user);

        return res.status(200).json({ accessToken, message: "Login successful"});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logout successful" });
};


// Google OAuth functions--------------------------------------------

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8080/auth/google/callback';

const googleLogin = (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
};

function generateRandomPassword() {
    return crypto.randomBytes(16).toString('hex');
}

async function generateTokenAndScheduleDeletion(userId) {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const createdToken = await CompleteProfileToken.create({
            token: token,
            user_id: userId
        });

        if (!createdToken) {
            throw new Error('Failed to create token');
        }

        console.log(`Token created with ID: ${createdToken.id}`);

        setTimeout(async () => {
            try {
                await CompleteProfileToken.destroy({
                    where: {
                        id: createdToken.id
                    }
                });
                console.log(`Token with ID: ${createdToken.id} has been deleted`);
            } catch (innerError) {
                console.error('Failed to delete token:', innerError);
            }
        }, 5 * 60 * 1000); // 5 minute

        return token;
    } catch (error) {
        console.error('Failed to create or delete token:', error);
        throw error;
    }
}

const googleCallback = async (req, res) => {
    try {
      const { code } = req.query;

      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });
  
      const { access_token } = data;
  
      const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 8);
  
      const [user, created] = await User.findOrCreate({
        where: { email: profile.email },
        defaults: {
          first_name: profile.given_name,
          name: profile.family_name,
          email: profile.email,
          password: hashedPassword,
          complete_profile: false,
        },
      });
  
      if (!created && user.complete_profile) {
        // Utilizator existent și profil complet
        if(user.type === 'teacher') {
            const payload = { 
                id: user.id, 
                name: user.name,
                first_name: user.first_name,
                email: user.email, 
                role: user.type, 
                complete_profile: user.complete_profile, 
                title: user.title,
            } 

        } else if(user.type === 'student') {
            const payload = { 
                id: user.id, 
                name: user.name,
                first_name: user.first_name,
                email: user.email, 
                role: user.type, 
                complete_profile: user.complete_profile, 
                faculty_id: user.faculty_id,
                specialization_id: user.specialization_id,
                education_level: user.education_level
            } 
        } else if(user.type === 'admin') {
            const payload = { 
                id: user.id, 
                name: user.name,
                first_name: user.first_name,
                email: user.email, 
                role: user.type, 
                complete_profile: user.complete_profile
            } 
        } else {
            throw new Error('Invalid user type');
        }

        const { accessToken, refreshToken } = generateTokens(payload);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 zile
        });

        return res.status(200).redirect(`http://localhost:3000/set-access-token/${accessToken}`);
      }
  
      // Utilizator nou sau profil incomplet
      const token = await generateTokenAndScheduleDeletion(user.id);
      if (!token) {
        throw new Error('Failed to generate token Google callback');
      }
      
      const userEmail = user.email;
      const verifyEmail = await teacherEmail.findOne({ where: { email: userEmail } });

        if (verifyEmail) {
            res.redirect(`http://localhost:3000/google-auth/complete-profile-teacher/${token}`);
        } else {
            res.redirect(`http://localhost:3000/google-auth/complete-profile-student/${token}`);
        }

    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).send("Eroare la autentificarea cu Google");
    }
  };


const findUserByToken = async (token) => {
    try {
        const completeProfileToken = await CompleteProfileToken.findOne({ where: { token } });

        if (!completeProfileToken) {
            return null;
        }

        const id = completeProfileToken.user_id;
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error finding user by token:', error);
        return null;
    }
};

const completeProfileStudent = async (req, res) => {
    try {
        const token = req.params.token;

        const userToken = await findUserByToken(token);

        if(!userToken) {
            console.log('userToken not found trimit 404');
            return res.status(404).json({ message: 'user-token not found' });
        }

        const { faculty_id, specialization_id, education_level } = req.body;
        console.log(req.body);

        console.log('faculty_id:----------------', faculty_id,"specialization" ,specialization_id, "edu lvl",education_level);

        const user = await User.findByPk(userToken.id);
        user.faculty_id = faculty_id;
        user.specialization_id = specialization_id;
        user.education_level = education_level;
        user.type = 'student';
        user.complete_profile = true;
        await user.save();

        const payload = { 
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            email: user.email,
            role: user.type,
            complete_profile: user.complete_profile,
            faculty_id: user.faculty_id,
            specialization_id: user.specialization_id,
            education_level: user.education_level 
        };


        const { accessToken, refreshToken } = generateTokens(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 zile
        });

        console.log('user dupa completare profil:', user);

        res.status(200).json({ accessToken, message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

const completeProfileTeacher = async (req, res) => {
    try {
        const token = req.params.token;

        const userToken = await findUserByToken(token);

        if(!userToken) {
            return res.status(404).send('user-token not found');
        }

        const title = req.body.title;

        const user = await User.findByPk(userToken.id);
        user.title = title;
        user.type = 'teacher';
        user.complete_profile = true;
        await user.save();

        const payload = { 
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            email: user.email, 
            role: user.type, 
            complete_profile: user.complete_profile
     };

        const { accessToken, refreshToken } = generateTokens(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 zile
        });

        console.log('user dupa completare profil:', user);

        res.status(200).json({ accessToken, message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    checkSession,
    registerTeacher,
    registerStudent,
    refreshAccessToken,
    login,
    logout,
    googleLogin,
    googleCallback,
    completeProfileStudent,
    completeProfileTeacher,
};
