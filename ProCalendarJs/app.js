var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.write('Server instance started...');
    

    
    console.log('Server instance started on ' + req.url);





    res.end();
}).listen(8080);