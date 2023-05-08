# xsj-users-microservice

## Custom user auth microservice built in TypeScript/Node and Mongo with Firebase integration for Google Auth

#### Environment variables
<p>First you will need to copy the .env.example template</p>
<code>cp .env.example .env</code>

<p>Then you will need to setup the following environment variables found in .env.example to your corresponding MongoDB credentials/info:
MONGO_ATLAS_URI,
QUERY_PARAMETERS,
DB_NAME,
DB_USER_PASSWORD,
DB_USER,
DB_USERS_COLLECTION_USERS
</p>
<br/>

#### To run locally
<p>Install node modules</p>
<code>npm install</code>
<br></br>

<p>Run locally</p>
<code>npm run dev</code>
<br></br>

<p>The microservice will be running locally at <a>http://localhost:1017/</a> </p>
