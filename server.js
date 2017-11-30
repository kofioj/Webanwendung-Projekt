// Initialisierung des Webservers
const express = require('express');
const app = express();

// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Initialisierung TingoDB - eine lokale Datenbank
// Vorbereitung: leeren Ordner 'tingodb' im Projektordner anlegen
// -> dort werden die Daten gespeichert

// Name der Collection
const DB_COLLECTION = "products";

// Initialisierung der Datenbank
// Ordner tingodb erstellen, falls nicht vorhanden
require('fs').mkdir(__dirname + '/tingodb', (err)=>{});
// Tingodb initialisieren
const Db = require('tingodb')().Db;
const db = new Db(__dirname + '/tingodb', {});
const ObjectID = require('tingodb')().ObjectID;
// Webserver starten
app.listen(3000, function() {
	console.log('listening on 3000')
});



app.get('/create', function(req, res){
	res.render('create');
});
app.post('/hinzufuegen', function(req,res){
	const artikel = req.body['artikel'];
	const preis = req.body['preis'];
	console.log(`Artikel ${artikel}: ${preis}`);
	
	// Datensatz definieren
	const document = {'artikel': artikel, 'preis': preis};
	
	db.collection(DB_COLLECTION).save(document, function(err, result){
		console.log(result);
		console.log(err);
		
	
		console.log('Datensatz gespeichert');
		res.redirect('/');
	});
	
	
});


app.get('/', (req, res) => {
	/* zum Testen: Beispiel-Liste an index.ejs schicken
	const liste = [
		{artikel: "USB-STick", preis: 8.99},
		{artikel: "Festplatte", preis: 89.97}
	];
	res.render('index', {'artikelliste': liste});
	*/

	// Liste aller Artikel aus der Datenbank holen -> tariable result
	db.collection(DB_COLLECTION).find().toArray(function(err, result) {
	console.log(result);
		// die Variable result enthält die Liste aller Artikel in der Datenbank
		// diese wird an index.ejs gesendet
		res.render('index', {'artikelliste': result});
	});
});

app.post('/delete/:id', (request,respnse) => {
	const id = request.params.id;
	const o_id = new ObjectID(id);
	db.collection(DB_COLLETION).remove({"_id":o_id}, (err,result) => {
		response.redirect('/');
	});
});
