const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieSession = require('cookie-session');
const { DateTime } = require("luxon");
const path = require("path");
const multer = require("multer");

require('dotenv').config()


const authMiddleware = (req, res, next) => {
    if (req.path == "/login" || req.path == "/signup") next();
    else if (req.session.hasOwnProperty("user_id")) {
        next();
    }
    else {
        res.redirect("/login.html");
    }
}

app.set("view engine", "ejs");
app.use(express.static("resources"));
app.use(cookieSession({
    name: 'session',
    keys: [process.env.cookieSessionKey],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(bodyParser.urlencoded({ extended: true }));



const con = mysql.createConnection(process.env.mysqlConString)

// {
//     user: process.env.user,
//     password: process.env.password,
//     host: process.env.host,
//     database: process.env.database,
// }

con.connect((err) => {
    if (err) throw err;
    else {
        console.log("Connected to MySQL successfully.");
    }
})

app.get("/", (req, res) => {
    con.query(`INSERT INTO users (name, email) VALUES (' ${req.query.name}', '${req.query.email}')`, (err, result) => {
        if (err) res.send("An error has occured.");
        else res.redirect("/general");
    });
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/resources/login.html"))
})

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "/resources/signup.html"))
})

app.post("/signup", (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hashed_password) => {
        if (err) throw err;
        con.query(`INSERT INTO users (name,email,password) VALUES ('${req.body.full_name}', '${req.body.email}', '${hashed_password}')`, (err, result) => {
            if (err) console.log(err);
            else res.redirect("/announcements");
        });
    })

})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    con.query(`SELECT id,name,password FROM users WHERE email='${email}'`, (err, results) => {
        if (err) res.sendStatus(500);
        else {
            const hashed_password = results[0].password;
            bcrypt.compare(password, hashed_password, (err, comp_result) => {
                if (comp_result) {
                    req.session.user_id = results[0].id
                    req.session.user_name = results[0].name
                    res.redirect("/general");
                }
                else res.sendStatus(401);
            })
        }
    });
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './resources/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, req.session.user_name + '.png')
    }
})

const upload = multer({ storage: storage })

// app.post("/upload", upload.single('pfp'), (req, res) => {

app.post("/upload", (req, res) => {
    // console.log(req.file)
    // console.log("Uploaded image")
    // backURL = req.header('Referer')
    // res.redirect(backURL)
})

app.get("/logout", authMiddleware, (req, res) => {
    req.session = null;
    res.redirect("/login")
})

app.get("/announcements", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.get("/general", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.get("/general-2", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.get("/off-topic", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.get("/support", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.get("/suggestions", authMiddleware, (req, res) => {
    res.render("feed.ejs", { user_name: req.session.user_name });
})

app.post("/announcements/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO announcements_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.post("/general/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO general_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.post("/general-2/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO general2_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.post("/off-topic/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO offtopic_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.post("/support/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO support_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.post("/suggestions/new", authMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query("INSERT INTO suggestions_posts (content, user_id) VALUES (?, ?)", [req.body.content, req.session.user_id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(201);
        });
    }
    else res.sendStatus(400);
})

app.get("/announcements/all", authMiddleware, (req, res) => {
    con.query("SELECT announcements_posts.id, announcements_posts.content, announcements_posts.date_time, users.name FROM announcements_posts INNER JOIN users ON announcements_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

app.get("/general/all", authMiddleware, (req, res) => {
    con.query("SELECT general_posts.id, general_posts.content, general_posts.date_time, users.name FROM general_posts INNER JOIN users ON general_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

app.get("/general-2/all", authMiddleware, (req, res) => {
    con.query("SELECT general2_posts.id, general2_posts.content, general2_posts.date_time, users.name FROM general2_posts INNER JOIN users ON general2_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

app.get("/off-topic/all", authMiddleware, (req, res) => {
    con.query("SELECT offtopic_posts.id, offtopic_posts.content, offtopic_posts.date_time, users.name FROM offtopic_posts INNER JOIN users ON offtopic_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

app.get("/suggestions/all", authMiddleware, (req, res) => {
    con.query("SELECT suggestions_posts.id, suggestions_posts.content, suggestions_posts.date_time, users.name FROM suggestions_posts INNER JOIN users ON suggestions_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

app.get("/support/all", authMiddleware, (req, res) => {
    con.query("SELECT support_posts.id, support_posts.content, support_posts.date_time, users.name FROM support_posts INNER JOIN users ON support_posts.user_id=users.id ORDER BY date_time;", (err, result) => {
        if (err) res.sendStatus(500)
        else {
            const final_result = result.map((message) => {
                message.date_time = DateTime.fromJSDate(message.date_time).toFormat("HH':'mm' | '") + DateTime.fromJSDate(message.date_time).toFormat("dd LLL yy")
                return message
            })
            res.json(final_result);
        };
    })
})

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App running on port ${port} `);
});