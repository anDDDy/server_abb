const {
  fork
} = require('child_process');
module.exports = class Handler {
  _child;
  _bk_data = [
	[], // bet365
	[], // olimp
	[], // fonbet
	[], // leon
	[], // 1xbet
	[], // marathon
	[], // 888sport
	[] // sbobet
];
  constructor() {

  };
  // Initialization sub_proccess for working with ABB requests;
  init() {
    this._child = fork('./routes/src/worker/parser.js');
    this._child.on('message', (data) => {
      this._bk_data[0] = data.data[0];
      this._bk_data[1] = data.data[1];
      this._bk_data[2] = data.data[2];
      this._bk_data[3] = data.data[3];
      this._bk_data[4] = data.data[4];
      this._bk_data[5] = data.data[5];
      this._bk_data[6] = data.data[6];
      this._bk_data[7] = data.data[7];
    });
  };
  // Setting new settings to the request's process;
  set_settings(settings) {
    this._child.send({
      cmd: 'settings',
      data: settings
    });
  };
  // Starting sending bet requests to ABB;
  start() {
    this._child.send({
      cmd: 'start',
      data: null
    });
  };
  // Stop sending bet requests to ABB;
  stop() {
    this._child.send({
      cmd: 'stop',
      data: null
    });
  };
  // Excluding bet from ABB spread
  exclude(bet_id) {
    this._child.send({
      cmd: 'exclude',
      data: bet_id
    });
  };
  // End of request's proccess work;
  terminate() {
    this._child.send({
      cmd: 'terminate',
      data: null
    });
    this._child.kill();
    this._child.disconnect();
  };
};
