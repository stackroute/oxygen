var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser({explicitArray:false});
fs.readFile(__dirname + '/test.owl', function(err, data) {
    parser.parseString(data, function (err, result) {
      var fs = require('fs');
      fs.writeFile('./output.json', JSON.stringify(result), function(err){
        if(err){
          console.log(err);
        }
        else {
          console.log('The file is saved');
        }
      });
        console.dir(result);
        console.log('Done');
    });
});
