const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Express baby!');
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
  res.send(`We don't serve that here. Never call again!`);
})

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    App: ${req.app.get('next')}
    Body: ${req.body}
    cookies: ${req.cookies}
    fresh: ${req.fresh}
    ip: ${req.ip}
    orginalURL: ${req.originalUrl}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }

  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response 
  res.send(greeting);
});

app.get('/sum', (req, res) => {
  //1. get values from the request
  const a = req.query.a;
  const b = req.query.b;
  const sum = parseInt(a) + parseInt(b)

  //2. validate the values
  if(!a) {
    //3. name was not provided
    return res.status(400).send('Please provide a value for [a]');
  }

  if(!b) {
    //3. race was not provided
    return res.status(400).send('Please provide a value for [b]');
  }

  //4. and 5. both name and race are valid so do the processing.
  const total = `The sum of ${a} and ${b} is ${sum}`;

  //6. send the response 
  res.send(total);
});

app.get('/cipher', (req, res) => {
  //1. get values from the request
  const text = req.query.text;
  const shift = req.query.shift;

  //2. validate the values
  if(!text) {
    //3. name was not provided
    return res.status(400).send('text is required');
  }

  if(!shift) {
    //3. name was not provided
    return res.status(400).send('shift amount is required');
  }

  const numShift = parseFloat(shift);

  if(Number.isNaN(numShift)) {
    return res.status(400).send('shift must be a number');
  }

  const base = 'A'.charCodeAt(0);

  const cipher = text.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if (code < base || code > (base + 26)) {
      return char;
    }
    
    let diff = code - base;
    diff = diff + numShift;
    diff = diff % 26;

    const shiftedChar = String.fromCharCode(base + diff);
    return shiftedChar;
  })
  .join('');

  res.status(200).send(cipher);
});

app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  if(!numbers) {
    return res.status(400).send('Please provide numbers');
  }

  if(!Array.isArray(numbers)) {
    return res.status(400).send('numbers must be an array');
  }

  const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if(guesses.length != 6) {
    return res.status(400)
    .send("numbers must contain 6 integers between 1 and 20");
  }

    // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }


  // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);


  //const randomNums = Math.floor(Math.random() * Math.floor(20));
  //console.log(randomNums);

  //const total = `${numbers}`;

  //6. send the response 
  res.send(guesses);
});

