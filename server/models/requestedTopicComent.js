const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const topicRequest = require('./topicRequest');

const RequestedTopicComment = sequelize.define('requestedTopicComments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  topic_request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: topicRequest,
      key: 'id',
    },
  },
});

RequestedTopicComment.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
RequestedTopicComment.belongsTo(topicRequest, { foreignKey: 'topic_request_id', as: 'topicRequest', onDelete: 'CASCADE' });

module.exports = RequestedTopicComment;

