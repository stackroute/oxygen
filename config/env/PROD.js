const masterMongoDBName = process.env.APP_DB || 'oxygen';

const mongo = {
	host: process.env.MONGO_HOST || '127.0.0.1',
	port: process.env.MONGO_PORT || 27017
};


const redis = {
	host : process.env.REDIS_HOST || '127.0.0.1',
	port : process.env.REDIS_PORT || 6379
}

const rabbitmq = {
	host: process.env.RABBITMQ_HOST || '127.0.0.1',
	port: process.env.RABBITMQ_PORT || 5672
};


const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
	masterMongoDBName);

const neo4jURL = ('bolt://localhost');

const rabbitmqURL = ('amqp://' + rabbitmq.host + ':' + rabbitmq.port);

module.exports = {

	WWW_PORT: process.env.OXYGEN_WWW_PORT || process.env.PORT || 8080,
	MONGO_MASTER_DB_NAME: masterMongoDBName,
	MONGO_MASTER_SERVER: mongo,
	REDIS_SERVER : redis,
	REDIS_PORT: '6379',
	REDIS_HOST: 'localhost',
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
	RABBITMQ_URL: rabbitmqURL,
	ENGINES:["017039332294312221469:rqapd5bgshm",
	"017039332294312221469:bsvb4v8seqe",
	"017039332294312221469:8oytabpqdcs",
	"017039332294312221469:eqwdvg7pu-4",
	"017039332294312221469:l6s8qmse8z4",
	"017039332294312221469:pmuedelfo_k",
	"017039332294312221469:7zgyseksmz4",
	"015901048907159908775:bu8jkb0g1c0",
	"017039332294312221469:tjlfw4hfuwc",
	"009216953448521283757:ibz3hdutpom"],
	KEYS:["AIzaSyAFqNeuL6qFRaaqnoa4Y2ETLVQUx7OjaUA",
	"AIzaSyDvxBoMPRnIAPtpnuY7WfnAk4smA28kPLE",
	"AIzaSyB59PXSYZ-1HzIvK0GuLV5OJjOB9srTx2w",
	"AIzaSyB7izNlRht7ceDCFwA9iUgU0jrhdF-O2tY",
	"AIzaSyDQwPERX0h5vF2fZc8pq1_KySSLiyjC2e8",
	"AIzaSyDgExhJE-qWmH7SPTbLpcweuHnqybnBmJw",
	"AIzaSyAP_M9TPpNbPke4BmJvi3SjlxXGHv3Bjbw",
	"AIzaSyBb4sbJNrnGmPmHiwEOxtF_ZEbcRBzNr60",
	"AIzaSyAkZ_luP7pNchE_V2EMeiw2AwE7kKmbQVY",
	"AIzaSyDY5SnIb4vsmGwteTes7VPbi_1_TFV-T1U"],
	NO_OF_RESULTS:2

};
