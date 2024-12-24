const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
const Topic = require("./topic");
const User = require("./user");

const FavoriteTopics = sequelize.define('Favorite_topics', {
    user_id: {
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
}, {
    timestamps: true, 
    tableName: 'favorite_topics', 
});

FavoriteTopics.belongsTo(User, { foreignKey: 'user_id', as: 'user' }, { onDelete: 'CASCADE' });
FavoriteTopics.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' }, { onDelete: 'CASCADE' });


module.exports = FavoriteTopics;
