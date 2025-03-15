# Online BSc/MSc Thesis Selection Platform

This project is designed to digitalize and automate the process of selecting BSc/MSc thesis topics for students and professors. It provides a structured and efficient approach to thesis management.

## Technologies Used
- **Frontend:** Next.js
- **Backend:** Node.js, Express.js
- **Authentication:** Google OAuth with JWT security
- **Database:** MySQL with Sequelize ORM

## Prerequisites
Before running the project, ensure that you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended version: `18.x.x` or later)
- [MySQL](https://dev.mysql.com/downloads/)
- A Google account for OAuth authentication

## Installation and Setup

# Clone the repository
git clone https://github.com/user/repo.git
cd repo

# Configure environment variables
cp client/sample.env client/.env
cp server/sample.env server/.env
echo "Update the .env files in 'client' and 'server' directories before proceeding."

# Install dependencies
(cd client && npm install) &
(cd server && npm install) &
wait

# Start the project
(cd server && npm run dev) &
(cd client && npm run dev)

# Open the application in a browser. Replace with the port specified in your .env file
http://localhost:[PORT]  




