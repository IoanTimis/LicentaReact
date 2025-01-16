const Topic = require('../models/topic');
const Specialization = require('../models/specialization');
const SpecializationTopic = require('../models/specializationTopic');
const User = require('../models/user');
const { Op } = require('sequelize');
const topicRequest = require('../models/topicRequest');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');

const studentTopics = async (req, res) => {
  try {

    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const specialization_id = user.specialization_id;
    const education_level = user.education_level;

    const specialization = await Specialization.findByPk(specialization_id);

    if (!specialization) {
        return res.status(404).json({ message: 'Specialization not found' });
      }
      
    //Filter topics by specialization, education level and available slots > 0 
    const topics = await specialization.getTopics({
      where: {
        education_level: education_level,
        slots: {
          [Op.gt]: 0
        }
      },
      include: [{
        model: User,  
        as: 'user'   
      }]
    });

    if (!topics) {
      return res.status(404).json({ message: 'Topics not found' });
    };

   return res.status(200).json({ topics: topics });

  }
  catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const topic = async (req, res) => {
  const topic_id = req.params.id;

  try {
    const topic = await Topic.findByPk(topic_id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topicRequested = await topicRequest.findOne({
      where: {
        topic_id: topic_id
      }
    });

    if (topicRequested) {
      return res.render('pages/student/topic', { topic: topic, requested: true });
    }

    res.render('pages/student/topic', { topic: topic, requested: false });
  }
  catch (error) {
    console.error('Error getting topic:', error);
    res.status(500).send('Internal Server Error');
  }
};

//request topics------------------------------------------------------------------------------------------------------

const getRequestTopics = async (req, res) => {
  const student_id = req.session.loggedInUser.id;
  const specialization_id = req.session.loggedInUser.specialization_id;

  try {
    const specialization = await Specialization.findByPk(specialization_id);

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    const requests = await topicRequest.findAll({
      where: {
        student_id: student_id
      },
      include: [{
        model: User,
        as: 'teacher'
      },
      {
        model: Topic,
        as: 'topic'
      }]
    });

    if (!requests) {
      return res.status(404).json({ message: 'Requests not found' });
    }
    const logout = (req, res) => {
      delete req.session.loggedInUser;
      res.redirect('/');
    };
    return res.render('pages/student/requests', { requests: requests});
  }
  catch (error) {
    console.error('Error getting requests:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getRequestTopic = async (req, res) => {
  const request_id = req.params.id;

  try {
    const request = await topicRequest.findByPk(request_id, {
      include: [{
        model: User,
        as: 'teacher'
      },
      {
        model: Topic,
        as: 'topic'
      }]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.render('pages/student/request', { request: request});
  }
  catch (error) {
    console.error('Error getting request:', error);
    res.status(500).send('Internal Server Error');
  }
};

const newRequest = async (req, res) => {
  const student_id = req.session.loggedInUser.id;
  const { topic_id, teacher_id, message } = req.body;
  sanitizeHtml(message);

  try {
    const request = await topicRequest.create({
      student_id: student_id,
      teacher_id: teacher_id,
      topic_id: topic_id,
      student_message: message
    });

    if (!request) {
      return res.status(500).json({ message: 'Error creating request' });
    }

    res.redirect(`/student/request-topic/${request.id}`);
  }
  catch (error) {
    console.error('Error creating request:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteRequest = async (req, res) => {
  const student_id = req.session.loggedInUser.id;
  const request_id = req.params.id;

  try {
    const request = await topicRequest.findByPk(request_id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.student_id !== student_id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await request.destroy();
    
    res.status(204).send();
  }
  catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  studentTopics,
  topic,
  getRequestTopics,
  getRequestTopic,
  newRequest,
  deleteRequest
};