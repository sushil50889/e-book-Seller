const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const app = express();

//port setup
const port = process.env.PORT || 5000;

//handlebars middleware
app.engine('handlebars', exhbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static folder
app.use(express.static(`${__dirname}/public`));


//index route
app.get('/', (req, res) => {
  res.render('home');
});



app.get('/ebook', (req, res) => {
  res.render('index', {spk: keys.stripePublishableKey});
});



app.post('/charge', (req, res) => {
  var amount = 2500;

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  }).then(customer => stripe.charges.create({
    amount,
    description: 'Web Developement Ebook',
    currency: 'usd',
    customer: customer.id
  })).then((charge) => {
    res.render('success');
  });
});


app.listen(port, () => {
  console.log(`server is on...port : ${port}`);
});
