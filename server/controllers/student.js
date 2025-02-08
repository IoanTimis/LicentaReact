const Topic = require('../models/topic');
const Faculty = require('../models/faculty')
const Specialization = require('../models/specialization');
const SpecializationTopic = require('../models/specializationTopic');
const User = require('../models/user');
const { Op } = require('sequelize');
const topicRequest = require('../models/topicRequest');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const FavoriteTopics = require('../models/favoriteTopics');

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
  try {
    const topic_id = req.params.id;
  
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
      return res.status(200).json({ topic: topic, requested: true });
    }

    res.status(200).json({ topic: topic, requested: false });
  }
  catch (error) {
    console.error('Error getting topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getFavoriteTopics = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;

    const favoriteTopics = await FavoriteTopics.findAll({
      where: {
        user_id: student_id
      },
      include: [{
        model: Topic,
        as: 'topic',
        include: [{
          model: User,
          as: 'user'
        }]
      }]
    });

    if (!favoriteTopics) {
      return res.status(404).json({ message: 'Favorite topics not found' });
    }

    const topics = favoriteTopics.map(favoriteTopic => favoriteTopic.topic);
    console.log(topics);

    return res.json({ topics: topics });
  }
  catch (error) {
    console.error('Error getting favorite topics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addFavoriteTopic = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;

    const topic_id  = req.params.id;

    const favoriteTopic = await FavoriteTopics.create({
      user_id: student_id,
      topic_id: topic_id
    });

    if (!favoriteTopic) {
      return res.status(500).json({ message: 'Error adding favorite topic' });
    }

    res.status(201).json({ message: 'Favorite topic added', favoriteTopic: favoriteTopic });
  }
  catch (error) {
    console.error('Error adding favorite topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeFavoriteTopic = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;
    const topic = req.params.id;

    const favoriteTopic = await FavoriteTopics.findOne({
      where: {
        user_id: student_id,
        topic_id: topic
      }
    });

    if (!favoriteTopic) {
      return res.status(404).json({ message: 'Favorite topic not found' });
    }

    if (favoriteTopic.user_id !== student_id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await favoriteTopic.destroy();

    res.status(200).json({ message: 'Favorite topic removed' });
  }
  catch (error) {
    console.error('Error removing favorite topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const isTopicFavorite = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;
    const topic_id = req.params.id;

    const favoriteTopic = await FavoriteTopics.findOne({
      where: {
        user_id: student_id,
        topic_id: topic_id
      }
    });

    return res.status(200).json({ favorite: !!favoriteTopic });
  }
  catch (error) {
    console.error('Error getting favorite topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//request topics------------------------------------------------------------------------------------------------------

const getRequestTopics = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;
    
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
    
    return res.json({ requests: requests });
  }
  catch (error) {
    console.error('Error getting requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getRequestTopic = async (req, res) => {
  try {
    const request_id = req.params.id;
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

    return res.json({ request: request });
  }
  catch (error) {
    console.error('Error getting request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const isTopicRequested = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;
    const topic_id = req.params.id;

    const request = await topicRequest.findOne({
      where: {
        student_id: student_id,
        topic_id: topic_id
      }
    });

    return res.status(200).json({ requested: !!request });
  } catch (error) {
    console.error('Error getting request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const newRequest = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;

    const { topic_id, teacher_id, education_level, message } = req.body;

    const student_data = await User.findByPk(student_id);

    if (!student_data) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const requestExists = await topicRequest.findOne({
      where: {
        student_id: student_id,
        topic_id: topic_id
      }
    });

    if (requestExists) {
      return res.status(403).json({ message: 'Forbidden' });
    };

    //Speacialization, faculty, topic to check if the student can apply to the topic
    const topic_data = await Topic.findOne({
      where: { id: topic_id },
      include: [
        {
          model: Specialization,
          as: "specializations",
          attributes: ["id"], 
          include: [
            {
              model: Faculty,
              as: "faculty",
              attributes: ["id"] 
            }
          ]
        }
      ]
    });

    if (!topic_data) {
      return res.status(404).json({ message: 'Topic not found' });
    };

    //Check student education level
    if (student_data.education_level !== education_level) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let validReq = false;

    //Check if the student can apply to the topic (specialization, faculty)
    if(topic_data.specializations.length > 1){
      for(let i = 0; i < topic_data.specializations.length; i++) {
        if( (topic_data.specialization[i] === student_data.specialization_id)
          && (topic_data.specialization[i].faculty === student_data.faculty_id)
        )
        {
          validReq = true;
          break;
        }
      }
    } else if( (topic_data.specializations[0].id === student_data.specialization_id)
      && (topic_data.specializations[0].faculty.id === student_data.faculty_id)
    ) {
      validReq = true;
    }


    if(!validReq){
      return res.status(403).json({ message: 'Forbiden' })
    }

    sanitizeHtml(message);

    const request = await topicRequest.create({
      student_id: student_id,
      teacher_id: teacher_id,
      topic_id: topic_id,
      student_message: message
    });

    if (!request) {
      return res.status(500).json({ message: 'Error creating request' });
    }

    //TODO:Voi folosi toast redirect
    //res.redirect(`http://localhost:3000/student/my-request/${request.id}`);
    res.status(201).json({ message: 'Request created', request: request });
  }
  catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const confirmRequest = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const student_id = user.id;
    const request_id = req.params.id;

    const request = await topicRequest.findByPk(request_id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    };

    if(request.status !== 'accepted'){
      return res.status(403).json({ message: 'Forbidden' });
    };

    const req_student_id = request.student_id;

    if (req_student_id !== student_id) {
      return res.status(403).json({ message: 'Forbidden' });
    };

    request.status = 'confirmed';
    await request.save();

    const topic_id = request.topic_id;

    const topic = await Topic.findByPk(topic_id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.slots -= 1;
    await topic.save();

    //Delete any other request the student has made to any other theme
    await topicRequest.destroy({
      where: {
        student_id: student_id,
        status: { [Op.ne]: 'confirmed' }
      }
    });

    res.status(200).json({ message: 'Request Confirmed', request: request });
  }
  catch (error) {
    console.error('Error confirming request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteRequest = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const user = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const student_id = user.id;
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
    
    res.status(200).json({ message: 'Request deleted' });
  }
  catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  studentTopics,
  topic,
  getFavoriteTopics,
  addFavoriteTopic,
  removeFavoriteTopic,
  isTopicFavorite,
  getRequestTopics,
  getRequestTopic,
  isTopicRequested,
  newRequest,
  confirmRequest,
  deleteRequest
};