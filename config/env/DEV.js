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


const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' + masterMongoDBName);

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
    ENGINES:["002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "002010716683433682980:zab-59wrvcw",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "008565747462219437009:jvlv8l7dcms",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y",
    "011258801353517089276:nqdi-yxpi-y" ],
    KEYS:["AIzaSyASV_xkhb7oEm3aJiAheNQhF6UNBm1ip4Y",
    "AIzaSyAbRsB6aEWodr7_tfcL_cHO1Z7Cd_9yB5E",
    "AIzaSyDFcou0XnXNtc0_6i1PD2Y6jCDdlYoqlic",
    "AIzaSyCl6MNQl_-jNw5gwEqHa_IfkHlLiq62Tjw",
    "AIzaSyCCqym7FciIntZ0DpE1kKw96CwrZHObMso",
    "AIzaSyA0yCSsDAxO4OHZ3xmV1Fp4VTwk6eli3gY",
    "AIzaSyBQHiYjFIaOXSwQY_pDVhhV8F8rRiJama0",
    "AIzaSyAG24YeFZBdRaFLgPTkNrbWeRJDtNq81nQ",
    "AIzaSyCWuFgVXDmk0V4LL7AF0AsPfjp_cbqk0Oo",
    "AIzaSyCTljf7iJ25T0qirEMwGydf3EDRolxnIcA",
    "AIzaSyAyWlUrKKLMCayDGpFMpE6XGqbdCLL4LvI",
    "AIzaSyBxV_qoJq1LLvb0SgfjTOg6kleAWEyPf7w",
    "AIzaSyAgDx-qLdcMFi6kBrht96oO-X1eeQ7t6Xo",
    "AIzaSyBito5nELNtkYcgZVfC2JdiLZdSIp60jNw",
    "AIzaSyCMwiy6rlMoWcPB5UKVnPGgpunFhJBzz4A",
    "AIzaSyCD8-nfSfLvsQ_YlAWFasx4qbnQRDTQAd0",
    "AIzaSyCzYbxLw7ahrqZVa-tqUlWEAAWimJMCE_w",
    "AIzaSyA-wNWQHgzKKF2N23fLjeKmxGGntmebmAM",
    "AIzaSyCOqH4ItkjIBGWHXMf3BhXmQjXDPNNybT8",
    "AIzaSyDEs-M-RKiWEm1SVF86vAcygyonZRNVcaM",
    "AIzaSyAAUFZ0XRT0E6q93A5HTdz85nWBzKQiiGw",
    "AIzaSyBSZ73IjiiBXAn2o55UMT-6lI-y2pZpd8c",
    "AIzaSyAhSUbRQ_cJ9-itRjwVb5RFUyzOuiWOi6E",
    "AIzaSyBEbcIIgUkTeOVBDkjexqnNdaP4mLGctyg",
    "AIzaSyDzQcgAQQyUaCeSrsmzBcLt2ljybD5VfDQ",
    "AIzaSyDj92sFmbCiGV_KpGdpU6QWkBXdh96agwc",
    "AIzaSyAJ0E_2P3GbOHggTZSr7XiFEQmuIFqaoW4",
    "AIzaSyAEm2uUsVCMqZEulEvviykJYW3MKxiUdGI",
    "AIzaSyBh98hhvc7k1Ewx5Xqk9aIEEQZIVkYTg4c",
    "AIzaSyA0S4X76SyQ4aLPwjq89NaVRtMMMXAb5hk"],
    NO_OF_RESULTS:2

};
