const hostname = '127.0.0.1';
const port     = 3001;
const acao     = "*";
const database = "database";
const http     = require('http');
const sqlite   = require('sqlite3').verbose();

let db = new sqlite.Database(database,(err)=>{
  if (err) {
    return console.error("10" + err.message);
  }
  console.log('Connected to the SQlite database.');
});
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS 'articles' ('title' TEXT,'text' TEXT,'login' TEXT);");
  db.run("CREATE TABLE IF NOT EXISTS 'users' ('login' TEXT,'password' TEXT);");
});
db.close();

const server = http.createServer((query, packet) => {
  let data = "";

  query.on("data", (chunk) => {
    data += chunk;
  });
  query.on("end",()=>{
    packet.setHeader("Content-Type", "text/plain");
    packet.statusCode = 200;
    packet.setHeader("Access-Control-Allow-Origin",acao);

    db = new sqlite.Database('database');
    switch (query.method){
      case "GET":
        switch (query.url){
          case "/articles":
            db.serialize(()=>{
              db.all('SELECT * FROM articles;',(err,rows)=>{
                if (err){
                  console.error("49"+err.message);
                }
                packet.end(JSON.stringify(rows));
              });
            });
            break;
        }
        break;
      case "POST":
        switch (query.url){
          case "/articles":
            let article = JSON.parse(data);
            db.serialize(()=>{
              db.run('INSERT INTO articles (title,text) VALUES (?,?);',[article.title,article.text],(err,row)=>{
                if (err){
                  console.error("54" + err.message);
                }else{
                  packet.end();
                }
             });
            });
            break;
          case "/users":
            let user = JSON.parse(data);
            db.serialize(()=>{
              db.get('SELECT login FROM users WHERE login ="'+user.login+'";',[],(err,row)=>{
                if(err){
                  console.error(err.message);
                }else if(row!==undefined){
                  console.error("Логін використаний");
                }else{
                  db = new sqlite.Database('database');
                  db.run(`INSERT INTO users (login,password) VALUES(?,?);`,[user.login,user.password],(err,row)=>{
                    if (err){
                      console.error(err.message);
                    }else{
                      packet.end(row);
                    }
                  });
                  db.close();
                }
              });
            });
            break;
        }
        break;
    }
    db.close();
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
