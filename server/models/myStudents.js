const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
const User = require("./user");
const Topic = require("./topic");

const MyStudents = sequelize.define('my_students', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', 
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', 
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topic', 
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

MyStudents.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher', onDelete: 'CASCADE' });
MyStudents.belongsTo(User, { foreignKey: 'student_id', as: 'student', onDelete: 'CASCADE' });
MyStudents.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic', onDelete: 'CASCADE' });

module.exports = MyStudents;
