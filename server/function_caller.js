var datapublisher=require('./redis_function');

var data = { DomainName :'java',
			 Actor : 'searcher',
			 data  :  { message : 'i have completed the task'},
			 status : 'completed'
			};

datapublisher.publishLog(data);

