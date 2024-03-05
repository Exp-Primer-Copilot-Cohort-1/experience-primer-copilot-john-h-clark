// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'test'
});

var app = http.createServer(function(request, response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var title = queryData.id;
	
	if(pathname === '/'){
		if(queryData.id === undefined){
			connection.query('SELECT * FROM topic', function(error, results, fields){
				if(error){
					console.log(error);
				} else {
					var list = '<ul>';
					for(var i = 0; i < results.length; i++){
						list += '<li><a href="/?id=' + results[i].id + '">' + results[i].title + '</a></li>';
					}
					list += '</ul>';
					var html = fs.readFileSync('index.html', 'utf8');
					html = html.replace('@@list', list);
					response.writeHead(200);
					response.end(html);
				}
			});
		} else {
			connection.query('SELECT * FROM topic', function(error, results, fields){
				if(error){
					console.log(error);
				} else {
					connection.query('SELECT * FROM topic WHERE id = ?', [queryData.id], function(error, results, fields){
						var title = results[0].title;
						var description = results[0].description;
						var list = '<ul>';
						for(var i = 0; i < results.length; i++){
							list += '<li><a href="/?id=' + results[i].id + '">' + results[i].title + '</a></li>';
						}
						list += '</ul>';
						var html = fs.readFileSync('index.html', 'utf8');
						html = html.replace('@@list', list);
						html = html.replace('@@title', title);
						html = html.replace('@@description', description);
						response.writeHead(200);
						response.end(html);
					});
				}
			});
		}
	} else if(pathname === '/create'){
		connection.query('SELECT * FROM topic',
