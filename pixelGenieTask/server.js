const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "4652a23e",
  apiSecret: "c131d83fa00da442"
});

var db

MongoClient.connect('mongodb://basant1861:mlab@ds143362.mlab.com:43362/db1861', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('views'))

app.get('/', (req, res) => {
  db.collection('smsService').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {smsData: result})
  })
})

app.post('/sms', (req, res) => {
  //console.log(req.body.mobile)
  nexmo.message.sendSms(
    '1234567890', req.body.mobile, req.body.message, {type: 'unicode'},
    (err, responseData) => {if (responseData) {console.log(responseData)}}
  );
  db.collection('smsService').save(req.body, (err, result) => {
    if (err) return console.log(err)
    //console.log('saved to database')
    res.redirect('/')
  })
})



