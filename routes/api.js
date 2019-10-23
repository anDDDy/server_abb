/*
 API ROUTES FOR HANDLING ALL THE BET_CLIENT REQUESTS INCLUDING GUI REQUESTS
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
let log = require('./libs/winston')(module);
let Handler = require('./src/handler');
let handler = new Handler();
let handler_status = false;
let handler_spread_status = false;
let settings_status = false;
let settings;
let clients = [

];

// Sending setting to the GUI
router.get('/settings', (req, res) => {
  fs.readFile(path.join(__dirname, "./src/data/settings.txt"), (err, data) => {
    if (err) {
      log.error('Heuta');
    } else {
      log.info(JSON.parse(data));
      res.send({
        settings: JSON.parse(data),
        handler_status: handler_status,
        handler_spread_status: handler_spread_status
      });
    }
  });
});

// Getting settings from the GUI
router.post('/settings', (req, res) => {
  settings = req.body;
  fs.writeFileSync(path.join(__dirname, "./src/data/settings.txt"), JSON.stringify(req.body));
  res.send({
    msg: 'Settings have been set successfully!'
  });
  settings_status = true;
  log.info(settings);
});

// Signal from the GUI to launch the handler
router.get('/launch', (req, res) => {
  if (settings_status) {
    handler.init();
    handler.set_settings(settings);
    handler_status = true;
    res.send({
      msg: 'Сервер успешно запущен!',
      status: true
    });
  } else {
    res.send({
      msg: 'Установите настройки перед запуском!',
      status: false
    });
  };
});

// Signal from the GUI to start the handler process
router.get('/start', (req, res) => {
  handler.start();
  handler_spread_status = true;
  res.send({
    msg: 'Идет раздача данных на клиенты...'
  });
});

// A signal from the GUI to stop the handler process
router.get('/stop', (req, res) => {
  handler.stop();
  handler_spread_status = false;
  res.send({
    msg: 'Раздача данных приостановлена.'
  })
});

// A signal from the GUI to end the handler process
router.get('/end', (req, res) => {
  handler.terminate();
  handler_status = false;
  settings_status = false;
  res.send({
    msg: 'Сервер отключен.'
  })
});

// Refreshing clients in the GUI
router.get('/refresh', (req, res) => {
  res.send({
    msg: JSON.stringify(clients)
  });
});

router.get('/', (req, res) => {
  res.send('API');
});

// A handler for betting request
router.get('/bet_request', (req, res) => {
  if (!handler_status && !handler_spread_status) {
    if (!findClient(req.query.id)) {
      addClient(req.query.id);
    }
    updateClient(req.query.id);
    let ids = req.query.id_array.split("|");
    log.info(`BET REQUEST:\n ID:${ids}`);
    let result = [];
    for (let i = 0; i < ids.length; i++) {
      let index = Number(ids[i]);
      log.info(index);
      result = result.concat(handler._bk_data[index]);
    }
    log.info("SENDED TO CLIENT: \n" + JSON.stringify(result));
    res.send(result);
  } else {
    res.send('false');
  }
});

// A handler for bet's excluding
router.post('/exclude', (req, res) => {
  let id = req.query.bet_id;
  handler.exclude(id);
});

// Betting clinet's connection handler
router.get('/connect', (req, res) => {
  if (!findClient(req.query.id)) {
    addClient(req.query.id);
    res.send('connect');
  } else {
    res.send('already connected');
  }
});

// Betting client's disconnection handler
router.get('/disconnect', (req, res) => {
  let dc = cliens.find(({
    name
  }) => name === req.query.id);
  if (dc !== undefined) {
    clients.shift(dc)
    res.send('disconnect');
  }
});

// Checking ID besides connected clients;
let findClient = id => {
  tmp = clients.find(({
    name
  }) => name === id);
  if (tmp == undefined) {
    return false;
  } else {
    return true;
  }
}

// Adding new client
let addClient = id => {
  clients.push({
    name: id,
    date: 'Подключен'
  });
}

// Updating req.date
let updateClient = id => {
  let date = new Date().toLocaleString();
  let client = clients.find(({
    name
  }) => name === id);
  clients[clients.indexOf(client)].date = date;
}

module.exports = router;
