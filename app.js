var http = require('http')
var request = require('request')
const translate = require('translate');
translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20200304T005113Z.2795cde4b46f70e0.0d41d338b63244dfd4b89156cb6cf1a0876c648c   ';
async function translateContent(obj) {
    console.log(2)
    return new Promise(async resolve => {
        console.log(obj)

    })
}
var server = http.createServer(async function(req,res) {

    var obj = {}
    request("http://lab.isaaclin.cn/nCoV/api/overall", async function(error, response, body) {
        var content = body.split("<html>", 1)[0]
        if(content) {
            //console.log(content)
            obj = JSON.parse(content).results[0]
            //console.log(obj)
            for (var x = 6; x < Object.keys(obj).length - 1; x++) {
                obj[Object.keys(obj)[x]] = obj[Object.keys(obj)[x]].toString()
                obj[Object.keys(obj)[x]] = await translate(obj[Object.keys(obj)[x]], {from: "zh", to: "en"}).catch(function(){console.log("bad")})
                console.log(obj[Object.keys(obj)[x]])
            }
                res.writeHead(200,
                    {"Content-Type": "application/json"});

                res.end(JSON.stringify(obj));


        } else {
            res.writeHead(400,
                {"Content-Type" : "application/json"});
            res.end("fail");
        }
    })

});
server.listen(process.env.PORT || 7000);
