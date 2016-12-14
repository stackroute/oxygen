const masterMongoDBName = process.env.APP_DB || 'oxygen';

const mongo = {
	host: process.env.MONGO_HOST || '127.0.0.1',
	port: process.env.MONGO_PORT || 27017
};

// const rabbitmq = {
// 	host: process.env.MONGO_HOST || '127.0.0.1',
// 	port: process.env.MONGO_PORT || 5672
// };

const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
	masterMongoDBName);

//const rabbitmqURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
//	masterMongoDBName);

module.exports = {
	WWW_PORT: process.env.OXYGEN_WWW_PORT || process.env.PORT || 8080,
	SEARCHER_PORT: process.env.OXYGEN_SEARCHER_PORT || 8081,
	CRAWLER_PORT: process.env.OXYGEN_CRAWLER_PORT || 8082,
	MONGO_MASTER_DB_NAME: masterMongoDBName,
	MONGO_MASTER_SERVER: mongo,
	MONGO_URL: mongoURL
};
