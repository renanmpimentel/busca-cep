"use strict";

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var route   = express.Router();
var app     = express();
var port    = process.env.PORT || 8000;
var Iconv   = require('iconv').Iconv;

route.get('/cep/:cep', function (req, res) {
  request(
    { method: 'POST'
    , uri: 'http://m.correios.com.br/movel/buscaCepConfirma.do'
    , form: {
        cepEntrada: req.param('cep'),
        tipoCep:'',
        cepTemp:'',
        metodo:'buscarCep'
      }
    }
  , function (error, response, body) {
      if(response.statusCode == 200){
            var $ = cheerio.load(body);
            var responseCorreios = [];

            $('.respostadestaque').each(function(i, elem) {
              var iconv = new Iconv('ISO-8859-1', 'utf8');
              responseCorreios[i] = iconv.convert($(this).text());
            });

            var localidade = responseCorreios[2].toString('utf8').trim().split("/");

            var correioJson = {
              "Logradouro": responseCorreios[0].toString('utf8').trim(),
              "Bairro": responseCorreios[1].toString('utf8').trim(),
              "Localidade": localidade[0].trim(),
              "Estado": localidade[1].trim(),
              "CEP": responseCorreios[3].toString('utf8').trim()
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(correioJson));

      } else {
        console.log('error: '+ response.statusCode)
      }
    }
  )
});

app.use('/', route);
app.listen(port);

console.log('Your server goes on localhost:' + port);
