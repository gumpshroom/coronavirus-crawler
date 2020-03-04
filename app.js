var http = require('http')
var request = require('request')
var server = http.createServer(function(req,res) {

    var obj = {}
    request("http://lab.isaaclin.cn/nCoV/api/overall", function(error, response, body) {
        var content = body.split("<html>", 1)[0]
        if(content) {
            res.writeHead(200,
                {"Content-Type" : "application/json"});
            console.log(content)
            obj = JSON.parse(content).results
            console.log(obj)
            res.end(JSON.stringify(obj));
        } else {
            res.writeHead(400,
                {"Content-Type" : "application/json"});
            res.end("fail");
        }
    })

});
server.listen(process.env.PORT || 7000);
