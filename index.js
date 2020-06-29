var formidable = require("formidable");
var crypto = require("crypto");
var session = require("express-session");
var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
var nodemailer = require('nodemailer');
var loginAttempts = {}

app.set('view engine', 'ejs');

console.log(__dirname);
app.use(express.static(path.join(__dirname, "resurse")))
app.use(session({
	secret: "cheie_sesiune",
	resave: true,
	saveUninitialized: false
}))

app.post('/inreg', function (req, res) {
	var formular = new formidable.IncomingForm()
	formular.parse(req, function (err, fields, files) {
		if (fields.parola == fields.rparola && fields.gr_chck) {
			var fisierUseri = fs.readFileSync("useri.json", "utf8");
			var parolaCriptata;
			var algoritmCriptare = crypto.createCipher('aes-128-cbc', "parola_criptare");
			parolaCriptata = algoritmCriptare.update(fields.parola, "utf-8", "hex");
			parolaCriptata += algoritmCriptare.final("hex");

			var obUseri = JSON.parse(fisierUseri);
			var userNou = {
				id: obUseri.lastId,
				prenume: fields.prenume,
				nume: fields.nume,
				telefon: fields.telefon,
				email: fields.email,
				parola: parolaCriptata,
				dataInreg: new Date(),
				rol: "user",
				prajituri: fields.prajituri,
				varsta: fields.varsta
			}
			obUseri.useri.push(userNou);
			obUseri.lastId++;
			var jsonNou = JSON.stringify(obUseri);
			fs.writeFileSync("useri.json", jsonNou);
			res.redirect("/")
		} else {
			if (fields.parola != fields.rparola) {
				res.render("html/contulmeu", {
					gresit: "parola"
				})
			} else {
				res.render("html/contulmeu", {
					gresit: "check"
				})
			}
		}
	})
})

app.post('/login', function (req, res) {
	var formular = new formidable.IncomingForm()
	formular.parse(req, function (err, fields, files) {
		var fisierUseri = fs.readFileSync("useri.json", "utf8");
		var parolaCriptata;
		var algoritmCriptare = crypto.createCipher('aes-128-cbc', "parola_criptare");
		parolaCriptata = algoritmCriptare.update(fields.parola, "utf-8", "hex");
		parolaCriptata += algoritmCriptare.final("hex");
		var obUseri = JSON.parse(fisierUseri);
		var utiliz = obUseri.useri.find(function (u) {
			return u.email == fields.email;
		})

		if (utiliz) {
				if (utiliz.parola == parolaCriptata && (loginAttempts[utiliz.email]<3 || loginAttempts[utiliz.email]==null)) {
					req.session.utilizator = utiliz;
					res.render("html/index", {
						email: utiliz.email,
						prenume: utiliz.prenume
					})
					loginAttempts[utiliz.email] = 0
				} else {
					if (!loginAttempts[utiliz.email]) {
						setTimeout(function(){ loginAttempts[utiliz.email]=0}, 180000)
						loginAttempts[utiliz.email] = 1;
					} else {
						loginAttempts[utiliz.email]++;
					}

					if (loginAttempts[utiliz.email] == 3) {
						var transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'cofetariediana@gmail.com',
								pass: '123cofetarie'
							}
						});
						var mailOptions = {
							from: 'cofetariediana@gmail.com',
							to: utiliz.email,
							subject: 'Incercare esuata conectare cont',
							text: 'Cineva a incercat sa se conecteze la contul tau! Daca nu ati fost dumneavoastra, va rugam sa ne contactati sau sa va modificati parola'
						};

						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}

						});
						// res.render('html/index', {attempts:loginAttempts[utiliz.email]})
					} else {
						res.render('html/index', {
							attempts: loginAttempts[utiliz.email]
						});
					}

				}
				if (loginAttempts[utiliz.email] >= 3) {
					setTimeout(function () {
						loginAttempts[utiliz.email] = 0
					}, 10000)
					res.render('html/index', {attempts:loginAttempts[utiliz.email]})
				} 

		} else {
			console.log("User inexistent");
			res.render('html/404');
		}
	})
})

app.get('/', function (req, res) {
	var usrn = req.session ? (req.session.utilizator ? req.session.utilizator.email : null) : null;
	var prn = req.session ? (req.session.utilizator ? req.session.utilizator.prenume : null) : null;
	res.render('html/index', {
		email: usrn,
		prenume: prn
	});
});


app.get("/logout", function (req, res) {
	req.session.destroy();
	res.redirect("/")
});

app.get('/ceva', function (req, res) {
	console.log("a intrat pe request")
	res.setHeader("Content-Type", "text/html");
	res.write("<html><body><h1>Cucubau!</h1><p>Bine, multumesc.</p></body></html>");
	res.end();
});


app.get("/*", function (req, res) {
	var numeUtiliz = req.session ? (req.session.utilizator ? req.session.utilizator.email : null) : null;
	var prenumeUtiliz = req.session ? (req.session.utilizator ? req.session.utilizator.prenume : null) : null;
	res.render('html' + req.url, {
		email: numeUtiliz,
		prenume: prenumeUtiliz
	}, function (err, textRandare) {

		if (err) {
			if (err.message.includes("Failed to lookup view"))
				return res.status(404).render("html/404", {
					email: numeUtiliz
				});
			else
				throw err;
		}
		res.send(textRandare);

	});
})

//Intotdeauna verificam la final! daca nu gaseset resursa si transmitem codul 404

app.use(function (req, res) {
	res.status(404).render('html/404');
})


app.listen(8080);
console.log('Aplicatia se va deschide pe portul 8080.');