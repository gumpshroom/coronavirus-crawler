var http = require('http')
var request = require('request')
const url = require('url');
const translate = require('translate');
translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20200304T005113Z.2795cde4b46f70e0.0d41d338b63244dfd4b89156cb6cf1a0876c648c   ';
var obj = {}
var lastArea = {}
var areaResults = {}
async function doRequest() {
    return new Promise(async resolve => {

        request("http://lab.isaaclin.cn/nCoV/api/overall", async function (error, response, body) {
            var content = body.split("<html>", 1)[0]
            if (content) {
                //console.log(content)
                obj = JSON.parse(content).results[0]
                //console.log(obj)
                for (var x = Object.keys(obj).length - 2; x > 10; x--) {
                    obj[Object.keys(obj)[x]] = obj[Object.keys(obj)[x]].toString()
                    obj[Object.keys(obj)[x]] = await translate(obj[Object.keys(obj)[x]], {
                        from: "zh",
                        to: "en"
                    }).catch(function () {
                        console.log("bad")
                    })
                    console.log(obj[Object.keys(obj)[x]])
                }

            }
        })
        request("http://lab.isaaclin.cn/nCoV/api/area?latest=1", async function (error, response, body) {
            console.log(3)
            var content = body.split("<html>", 1)[0]
            if (content) {
                console.log(content)
                var results = JSON.parse(content).results
                areaResults = results.slice()
                //lastArea = {countryEnglishName: "no data"}
                //console.log(results)
                console.log(areaResults)

            }
        })
        resolve()
    })
}
(async function(){
    await doRequest();
    console.log("loaded!");

}())
async function searchData(area) {
    console.log(1)
    return new Promise(async resolve => {
        console.log(2)

    })
}
var server = http.createServer(async function (req, res) {

    if(req.url === "/") {
        res.writeHead(200,
            {"Content-Type": "application/json"});
        res.end(JSON.stringify(obj));
    } else if(req.url.startsWith("/search?area=")) {
        const queryObject = url.parse(req.url,true).query;
        var area = queryObject.area
        for(var x = 0; x < areaResults.length; x++) {
            console.log(areaResults[x].countryEnglishName)
            console.log(area)
            if(areaResults[x].countryEnglishName === area) {
                lastArea = areaResults[x]
                console.log(4)
                break;
            }
            if(x === areaResults.length - 1) {
                lastArea = {countryEnglishName: "no data"}
            }
        }
        res.writeHead(200,
            {"Content-Type": "application/json"})
        res.end(JSON.stringify(lastArea));
    } else {
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end("not found")
    }

});
server.listen(process.env.PORT || 7000);
setInterval(async function(){await doRequest()}, 100000)
