var express = require('express');
var app = express();

let calls = [];

let elevator1 = 6;
let elevator2 = 0;

let destinations_1 = [];
let destinations_2 = [];

function send_command(res, command) {
  res.status(200).json(command);
}

app.post('/reset', (req, res, next) => {
  calls = [];
  elevator1 = 6;
  elevator2 = 0;
  destinations_1 = [];
  destinations_2 = [];
});

app.get('/1', (req, res, next) => {
  if (destinations_1.length > 0) {
    if (elevator1 == destinations_1[0].storey) {
      destinations_1.shift();
      send_command(res, 'door1');
    } else {
      if (destinations_1[0].storey > elevator1) {
        if (calls.filter(e => ((e.storey == elevator1) && (e.direction === 'up'))).length != 0) {
          calls = calls.filter(e => ((e.storey != elevator1) || (e.direction != 'up')));
          send_command(res, 'door1');
        } else {
          send_command(res, 'goUp1');
          elevator1++;
        }
      } else {
        if (calls.filter(e => ((e.storey == elevator1) && (e.direction === 'down'))).length != 0) {
          calls = calls.filter(e => ((e.storey != elevator1) || (e.direction != 'down')));
          send_command(res, 'door1');
        } else {
          send_command(res, 'goDown1');
          elevator1--;
        }
      }
    }
  } else {
    if (calls.length > 0) {
      let tmp_dest = calls[0].storey;
      if ((Math.abs(elevator1 - tmp_dest) < Math.abs(elevator2 - tmp_dest)) || (((Math.abs(elevator1 - tmp_dest) == Math.abs(elevator2 - tmp_dest)) && (elevator1 < elevator2)))) {
        destinations_1.push({ 'storey': tmp_dest });
        calls.shift();
        send_command('nothing');
      } else if (elevator1 == elevator2) {
        destinations_1.push({ 'storey': tmp_dest });
        calls.shift();
        send_command('nothing');
      }
    } else {
      send_command(res, 'nothing');
    }
  }
});

app.get('/2', (req, res, next) => {
  if (destinations_2.length > 0) {
    if (elevator2 == destinations_2[0].storey) {
      destinations_2.shift();
      send_command(res, 'door2');
    } else {
      if (destinations_2[0].storey > elevator2) {
        if (calls.filter(e => ((e.storey == elevator2) && (e.direction === 'up'))).length != 0) {
          calls = calls.filter(e => ((e.storey != elevator2) || (e.direction != 'up')));
          send_command(res, 'door2');
        } else {
          send_command(res, 'goUp2');
          elevator2++;
        }
      } else {
        if (calls.filter(e => ((e.storey == elevator2) && (e.direction === 'down'))).length != 0) {
          calls = calls.filter(e => ((e.storey != elevator2) || (e.direction != 'down')));
          send_command(res, 'door2');
        } else {
          send_command(res, 'goDown2');
          elevator2--;
        }
      }
    }
  } else {
    if (calls.length > 0) {
      let tmp_dest = calls[0].storey;
      if ((Math.abs(elevator1 - tmp_dest) > Math.abs(elevator2 - tmp_dest)) || (((Math.abs(elevator1 - tmp_dest) == Math.abs(elevator2 - tmp_dest)) && (elevator1 > elevator2)))) {
        destinations_2.push({ 'storey': tmp_dest });
        calls.shift();
        send_command('nothing');
      }
    } else {
      send_command(res, 'nothing');
    }
  }
});

app.post('/:command', (req, res, next) => {
  if (req.params.command == 'goto1') {
    if (destinations_1.filter(e => e.storey === req.query.storey).length === 0) {
      destinations_1.push({ 'storey': req.query.storey })
    }
  } else if (req.params.command == 'goto2') {
    if (destinations_2.filter(e => e.storey === req.query.storey).length === 0) {
      destinations_2.push({ 'storey': req.query.storey })
    }
  } else {
    if (calls.filter(e => ((e.storey === req.query.storey) && (e.direction === req.params.command))).length === 0) {
      calls.push({ 'storey': req.query.storey, 'direction': req.params.command })
    }
  }
  res.status(200).json(`${elevator1}, ${elevator2}`);
});

module.exports = app;
