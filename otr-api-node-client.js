
var http = require('http');
var Swagger = require('swagger-client'); 
var moment = require('moment');


if (process.argv.length < 3) {
    console.error('You must provide a single port number as an argument');
    process.exit(1);
}

var server = http.createServer(function(req, resp) {
    if (req.method == 'GET') {
            var Swagger = require('swagger-client');

            var client = new Swagger({
              url: 'http://trident26.cl.datapipe.net/swagger/otr-api.yaml',
              success: function() {
                //TODO: swap out token for  the one you want to use
                var token = 'a23Wo0W3KJUiHDK3z40mXx22AwhR';
                client.clientAuthorizations.authz.oauth2 =
                  new Swagger.ApiKeyAuthorization("Authorization", "Bearer " + token, "header");

                client["Health Data"].get_v1_patient_healthdata_search({
                  startDate: moment().add(-13, "d").startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
                  endDate:   moment().add(1, "d").startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
                  type:      "bloodGlucose",
                  limit:     5000
                },
                function(result){
                  //filter only high readings
                  var highReadings = result.obj.bloodGlucose.filter(function(bgReading){
                    return bgReading.bgValue.value > 180;
                  });
                  resp.writeHead(200, {
                    'content-type': 'application/json'
                  });
                  resp.end(JSON.stringify(highReadings));
                });
              } 
            });           


    } else {
        resp.writeHead(400, {
            'content-type': 'text/plain'
        });
        resp.end('Unsupported method');
    }
});

server.listen(Number(process.argv[2]));