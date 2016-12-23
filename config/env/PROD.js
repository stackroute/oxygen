const masterMongoDBName = process.env.APP_DB || 'oxygen';

const mongo = {
	host: process.env.MONGO_HOST || '127.0.0.1',
	port: process.env.MONGO_PORT || 27017
};

// const rabbitmq = {
// 	host: process.env.RABBITMQ_HOST || '127.0.0.1',
// 	port: process.env.RABBITMQ_PORT || 5672
// };

const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
	masterMongoDBName);

const neo4jURL=('bolt://localhost');

// const rabbitmqURL = ('rabbitmq://' + rabbitmq.host + ':' + rabbitmq.port);

module.exports = {
	WWW_PORT: process.env.OXYGEN_WWW_PORT || process.env.PORT || 8080,
	MONGO_MASTER_DB_NAME: masterMongoDBName,
	MONGO_MASTER_SERVER: mongo,
	MONGO_URL: mongoURL,
	NEO4J_HOST: 'localhost',
	NEO4J_BOLT_URL: neo4jURL,
	NEO4J_USR: 'neo4j',
	NEO4J_PWD: 'bala'

};