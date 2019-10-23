(function () {
  const SETTINGS_URL = '/API/settings';
  const REFRESH_URL = '/API/refresh';
  const LAUNCH_URL = '/API/launch';
  const START_URL = '/API/start';
  const STOP_URL = '/API/stop';
  const END_URL = '/API/end';
  class API {
    static setSettings(settings) {
      return fetch(SETTINGS_URL, {
        method: 'POST',
        body: JSON.stringify(settings),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    };
    static getSettings() {
      return fetch(SETTINGS_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
    static launchHandler() {
      return fetch(LAUNCH_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
    static endHandler() {
      return fetch(END_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
    static startHandler() {
      return fetch(START_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
    static stopHandler() {
      return fetch(STOP_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
    static refreshClients() {
      return fetch(REFRESH_URL, {
        method: 'GET'
      }).then(res => res.json());
    };
  }
  // Loading previous settings if there are
  document.addEventListener('DOMContentLoaded', async () => {
    let res = await API.getSettings();
    if (res.handler_status) {
      document.getElementById('stop_server').style.display = 'block';
      document.getElementById('start_server').style.display = 'none';
      if (res.handler_spread_status) {
        document.getElementById('start_spread').style.display = 'none';
        document.getElementById('stop_spread').style.display = 'block';
      } else {
        document.getElementById('start_spread').style.display = 'block';
      }
    }
    document.getElementById('access_token').value = res.settings.access_token;
    document.getElementById('FILTER1').checked = res.settings.filter_1;
    document.getElementById('FILTER2').checked = res.settings.filter_2;
    document.getElementById('FILTER3').checked = res.settings.filter_3;
    document.getElementById('FILTER4').checked = res.settings.filter_4;
    document.getElementById('FILTER5').checked = res.settings.filter_5;
    document.getElementById('FILTER6').checked = res.settings.filter_6;
    document.getElementById('FILTER7').checked = res.settings.filter_7;
    document.getElementById('FILTER8').checked = res.settings.filter_8;
  })

  // Settings saving and posting to SETTINGS_ROUTER
  document.getElementById('save_settings').onclick = () => {
    // Settings JSON that will be sent to the route
    let settings = {
      access_token: null,
      filter_1: null,
      filter_2: null,
      filter_3: null,
      filter_4: null,
      filter_5: null,
      filter_6: null,
      filter_7: null,
      filter_8: null
    }
    // Getting data from the GUI
    settings.access_token = document.getElementById('access_token').value;
    settings.filter_1 = document.getElementById('FILTER1').checked;
    settings.filter_2 = document.getElementById('FILTER2').checked;
    settings.filter_3 = document.getElementById('FILTER3').checked;
    settings.filter_4 = document.getElementById('FILTER4').checked;
    settings.filter_5 = document.getElementById('FILTER5').checked;
    settings.filter_6 = document.getElementById('FILTER6').checked;
    settings.filter_7 = document.getElementById('FILTER7').checked;
    settings.filter_8 = document.getElementById('FILTER8').checked;
    API.setSettings(settings).then(msg => {
      statusBarMsg(msg.msg);
    });
  };

  // Launching the handler process
  document.getElementById('start_server').onclick = () => {
    API.launchHandler().then(msg => {
      if (msg.status) {
        document.getElementById('stop_server').style.display = 'block';
        document.getElementById('start_spread').style.display = 'block';
        document.getElementById('start_server').style.display = 'none';
      } else {}
      statusBarMsg(msg.msg);
    });
  };

  // Ending the handler process
  document.getElementById('stop_server').onclick = () => {
    document.getElementById('stop_server').style.display = 'none';
    document.getElementById('start_spread').style.display = 'none';
    document.getElementById('stop_spread').style.display = 'none';
    document.getElementById('start_server').style.display = 'block';
    API.endHandler().then(msg => {
      statusBarMsg(msg.msg);
    });
  };

  // Starting the handler process spread
  document.getElementById('start_spread').onclick = () => {
    document.getElementById('stop_spread').style.display = 'block';
    document.getElementById('start_spread').style.display = 'none';
    API.startHandler().then(msg => {
      statusBarMsg(msg.msg);
    });
  }

  // Stop the handler process spread
  document.getElementById('stop_spread').onclick = () => {
    document.getElementById('stop_spread').style.display = 'none';
    document.getElementById('start_spread').style.display = 'block';
    API.stopHandler().then(msg => {
      statusBarMsg(msg.msg);
    });
  }

  // Refreshing connected clients
  document.getElementById('refresh').onclick = () => {
    $('#bot_logins > p').empty();
    $('#bot_statuses > p').empty();
    API.refreshClients().then(msg => {
      let data = JSON.parse(msg.msg);
      data.forEach(el => {
        $('#bot_logins').append(`<p>${el.name}</p>`);
        $('#bot_statuses').append(`<p>${el.date}</p>`);
      });
    })
  }

  // Drawing clients into the table
  let drawClient = el => {

  }

  // Sending messages to client into the GUI
  let statusBarMsg = msg => {
    document.getElementById('status_status').innerText = msg;
  }

})();
