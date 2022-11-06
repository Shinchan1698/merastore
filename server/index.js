const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");
const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ss1698",
    database: "merastore"
});

const app = express();

let urlencodedparser = bodyparser.urlencoded({ extended: false })

app.use("/", express.static(path.join("__dirname", "../client")));

con.connect(function (err) {
    if (err) throw err;
});

let main = "";

fs.readFile("./client/main.html", "utf-8", (err, data) => {
    if (err)
        throw err;
    main = data;
});

app.get("/", (req, res) => {
    res.send(main);
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/Login_page/index_login.html"));
});

app.post("/login", urlencodedparser, (req, res) => {
    console.log(req.body);
    con.query("select * from users", function (err, result, fields) {
        let em =-1,pw = -1;
        if (err) throw err;
        for(let i=0;i<result.length;i++)
        {
            if(result[i].email===req.body.email)
            {
                em = 1;
                if(result[i].password===req.body.pwd){
                    pw = 1;
                }
            }
        }
        if(em === 1){
            if(pw === 1)
                res.send({ "response": "success" });
            else
                res.send({ "response": "wrongpw" })
        }
        else{
            res.send({ "response": "emailnotfound" });
        }
    });
});

app.post("/signup", urlencodedparser, (req, res) => {
    let data = req.body;

    con.query(`insert into users values("${data.name}","${data.email}","${data.pwd}")`, function (err, result, fields) {
        if (err)
        {   
            if(err.code == "ER_DUP_ENTRY")
                res.send({"response" : "user_exist"})
        }
        else
        {
            console.log(result);
            res.send({ "response": "success" });
        }
    });
});

app.listen(3000, (err) => {
    if (err)
        throw err;
    console.log("Server Listening at 3000");
});