const masterMongoDBName = process.env.APP_DB || 'oxygen';

const mongo = {
	host: process.env.MONGO_HOST || '127.0.0.1',
	port: process.env.MONGO_PORT || 27017
};

const rabbitmq = {
	host: process.env.RABBITMQ_HOST || '127.0.0.1',
	port: process.env.RABBITMQ_PORT || 5672
};

const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
	masterMongoDBName);

const neo4j = {
	host: process.env.NEO4J_HOST || '127.0.0.1',
	port: process.env.NEO4J_PORT || '7687'	
};

const neo4jURL = ('bolt://' + neo4j.host + ':' + neo4j.port);

const rabbitmqURL = ('amqp://' + rabbitmq.host + ':' + rabbitmq.port);

module.exports = {

	WWW_PORT: process.env.OXYGEN_WWW_PORT || process.env.PORT || 8080,
	MONGO_MASTER_DB_NAME: masterMongoDBName,
	MONGO_MASTER_SERVER: mongo,
	MONGO_URL: mongoURL,
	MONGO_HOST: mongo.host,
	MONGO_PORT: mongo.port,
	RABBITMQ_HOST: rabbitmq.host,
	RABBITMQ_PORT: rabbitmq.port,
	NEO4J_HOST: neo4j.host,
	NEO4J_PORT: neo4j.port,
	NEO4J_BOLT_URL: neo4jURL,
	NEO4J_USR: 'neo4j',
	NEO4J_PWD: 'password',
	NEO4J_DOMAIN:'Domain',
	NEO4J_TERM:'Term',
	NEO4J_INTENT:'Intent',
	NEO4J_WEBDOCUMENT:'WebDocument',
	NEO4J_CONCEPT:'Concept',
	NEO4J_DOC_REL:'HasExplanationOf',
	NEO4J_INT_REL:'IntentOf',
	NEO4J_CON_REL:'ConceptOf',
	NEO4J_IND_REL:'IndicatorOf',
	NEO4J_CIND_REL:'CounterIndicatorOf',
	RABBITMQ_URL: rabbitmqURL,
	ENGINES:["004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m",
	"004518674028755323320:4h_dkrid14m"],
	KEYS:["AIzaSyDElAlpxOmKHRxJT-zBGQxXBdtrfQCLS5k",
	"AIzaSyDkBGnZCfL3BwdLmvvMOWio2D5NG1asD_E",
	"AIzaSyDq2piLN1ePhACiLhbSdzRlsLiwjqq3kD4",
	"AIzaSyBl8v_Yn_j7bep81L29-WHqYzBpdiuH_eU",
	"AIzaSyAMO8Sj76Iiyjkn863QcgSEBP7NzT3QnAM",
	"AIzaSyCgSevOCbfPPR8gSdLNrM37-7JMp8o1Tpo",
	"AIzaSyD_VD0jKA5AzEY5TGgE6KZOfHGJFiRH-iA"],
	NO_OF_RESULTS:2

};
