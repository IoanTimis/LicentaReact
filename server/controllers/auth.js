const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Faculty = require('../models/faculty');
const Specialization = require('../models/specialization');
const CompleteProfileToken = require('../models/completeProfileToken');
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


const getSpecializations = async (req, res) => {
    const faculty_id = req.params.id;
    
    try {
        const specializations = await Specialization.findAll({ where: { faculty_id: faculty_id } });
        if (specializations.length === 0) {
            return res.status(404).send('Specializations not found');
        }
        
        res.json(specializations);
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).send('Internal Server Error');
    }
};

const registerStudent = async (req, res) => {
    try {
        const faculties = await Faculty.findAll();
        return res.render('pages/auth/registerStudent', { faculties: faculties });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const registerStudentPost = async (req, res) => {
    const { first_name, name, email, password, faculty_id, specialization_id, education_level } = req.body;
    sanitizeHtml(first_name);
    sanitizeHtml(name);
    sanitizeHtml(email);

    try {
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

const registerTeacher = (req, res) => {
    res.render('pages/auth/registerTeacher');
};

const registerTeacherPost = async (req, res) => {
    const { first_name, name, email, password, title } = req.body;
    sanitizeHtml(first_name);
    sanitizeHtml(name);
    sanitizeHtml(email);
    sanitizeHtml(title);

    try {
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

const login = (req, res, next) => {
    if (req.session.loggedInUser) {
        console.log("esti logat deja:", req.session.loggedInUser);
        return res.redirect('/');
    } else {
        res.render('pages/auth/login');
    }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    // Verifică Refresh Token-ul
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

// În loginPost
const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
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
    const { code } = req.query;
  
    try {
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
        const redirectTo = user.type === "student" ? "/student" : "/teacher";
        return res.redirect(`http://localhost:3000${redirectTo}`);
      }
  
      // Utilizator nou sau profil incomplet
      const token = await generateTokenAndScheduleDeletion(user.id);
      if (!token) {
        throw new Error('Failed to generate token Google callback');
      }
      res.redirect(`http://localhost:3000/google-auth/choose-profile/${token}`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).send("Eroare la autentificarea cu Google");
    }
  };
  

const findUserByToken = async (req, res) => {
    const token = req.params.token;

    try {
        const completeProfileToken = await CompleteProfileToken.findOne({ where: { token } });

        if (!completeProfileToken) {
            req.session.loggedInUser = null;
            return res.status(404).json({ error: 'Token not found', redirectTo: '/auth/login' });
        }

        const id = completeProfileToken.user_id;

        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found', redirectTo: '/auth/login' });
        }

        req.session.loggedInUser = {
            id: user.id,
            first_name: user.first_name,
            name: user.name,
            email: user.email,
            complete_profile: user.complete_profile,
            complete_profile_token: token,
        };
        
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'User found' });

};

const completeProfileStudent = async (req, res) => {
    try {
        const faculties = await Faculty.findAll();
        res.render('pages/auth/completeProfileStudent', { faculties: faculties });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    };
};

const completeProfileStudentPut = async (req, res) => {
    const id = req.session.loggedInUser.id;
    const { faculty_id, specialization_id, education_level } = req.body;

    try {
        const user = await User.findByPk(id);
        user.faculty_id = faculty_id;
        user.specialization_id = specialization_id;
        user.education_level = education_level;
        user.type = 'student';
        user.complete_profile = true;
        await user.save();

        req.session.loggedInUser.faculty_id = faculty_id;
        req.session.loggedInUser.specialization_id = specialization_id;
        req.session.loggedInUser.education_level = education_level
        req.session.loggedInUser.type = 'student';
        req.session.loggedInUser.complete_profile = true;
        req.session.loggedInUser.complete_profile_token = null;

        console.log('req.session.loggedInUser dupa completare profil:', req.session.loggedInUser);

        res.status(200).send('Profile updated successfully!');
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

const completeProfileTeacher = async (req, res) => {
    res.render('pages/auth/completeProfileTeacher');
};

const completeProfileTeacherPut = async (req, res) => {
    const id = req.session.loggedInUser.id;
    const { title } = req.body;

    try {
        const user = await User.findByPk(id);
        user.title = title;
        user.type = 'teacher';
        user.complete_profile = true;
        await user.save();

        req.session.loggedInUser.title = title;
        req.session.loggedInUser.type = 'teacher';
        req.session.loggedInUser.complete_profile = true;
        req.session.loggedInUser.complete_profile_token = null;

        res.status(200).send('Profile updated successfully!');
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    checkSession,
    getSpecializations,
    registerTeacher,
    registerTeacherPost,
    registerStudent,
    registerStudentPost,
    refreshAccessToken,
    login,
    loginPost,
    logout,
    googleLogin,
    googleCallback,
    findUserByToken,
    completeProfileStudent,
    completeProfileStudentPut,
    completeProfileTeacher,
    completeProfileTeacherPut
};
