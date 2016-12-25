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
	ENGINES:[
	'009216953448521283757:ibz3hdutpom',
	'015901048907159908775:bu8jkb0g1c0',
	'017039332294312221469:tjlfw4hfuwc',
	'007705081896440677668:8luezkczozo',
	'004518674028755323320:ld85zhatuxc'],
	KEYS:[
	'AIzaSyDY5SnIb4vsmGwteTes7VPbi_1_TFV-T1U',
	'AIzaSyBb4sbJNrnGmPmHiwEOxtF_ZEbcRBzNr60',
	'AIzaSyAkZ_luP7pNchE_V2EMeiw2AwE7kKmbQVY',
	'AIzaSyC7XMsUPGIaHo1rT0nIAYWuQZGNEZdRabs',
	'AIzaSyA1hzOwDP99Vse-JuHrX7erfgUi3RT8f10'],
	NO_OF_RESULTS:2

};