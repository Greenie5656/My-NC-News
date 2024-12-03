Northcoders News API
--------------------
Project Summary
----------------
A RESTful API built with Node.js and PostgreSQL that serves as a backend for a news website. This API provides various endpoints for accessing and managing articles, comments, users, and topics. Users can retrieve articles, filter them by topic, sort them by different criteria, post comments, and manage votes.

Hosted Version
--------------
The live API can be accessed at: https://my-nc-news-7qlo.onrender.com/api

Features
----------
Article management (viewing, filtering, sorting)
Comment functionality (posting, deleting)
User authentication
Topic categorization
Voting system

Needed:
-------
Node.js (v20.0.0 or higher)
PostgreSQL (v14.0 or higher)

Dependencies
------------
- dotenv: ^16.4.5
- express: ^4.21.1
- pg: ^8.7.3
- pg-format: ^1.0.4

Dev Dependencies
----------------
- husky: ^8.0.2
- jest: ^27.5.1
- jest-extended: ^2.0.0
- jest-sorted: ^1.0.15
- supertest: ^7.0.0

Setup Instructions
-------------------
1. Clone the Repository
bashCopygit clone https://github.com/Greenie5656/My-NC-News

2. Install Dependencies

3. Set Up Environment Variables
You'll need to create two .env files in the root directory of the project:
.env.test
PGDATABASE=nc_news_test
.env.development
PGDATABASE=nc_news
4. Setup and Seed the Database
Create the databases
npm run setup-dbs
Seed the development database
npm run seed
5. Run Tests
npm test
6. Start the Server
npm start




