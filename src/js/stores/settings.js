var Reflux = require('reflux');
var Actions = require('../actions/actions');

var SettingsStore = Reflux.createStore({
  listenables: Actions,

  init: function () {
    var settings = window.localStorage.getItem('settings');

    if (!settings) {
      settings = {
        participating: false,
        playSound: true,
        showNotifications: true,
        openAtStartup: false
      };
    }

    if (settings[0] === '{') {
      settings = JSON.parse(settings);
    }

    if (!settings.participating) {
      settings.participating = false;
    }
    if (!settings.playSound) {
      settings.playSound = true;
    }
    if (!settings.showNotifications) {
      settings.showNotifications = true;
    }
    if (!settings.openAtStartup) {
      settings.openAtStartup = false;
    }

    this._settings = settings;
    window.localStorage.setItem('settings', JSON.stringify(this._settings));
  },

  getSettings: function () {
    return this._settings;
  },

  onSetSetting: function (setting, value) {
    this._settings[setting] = value;
    window.localStorage.setItem('settings', JSON.stringify(this._settings));
    this.trigger(this._settings);
    if(setting == 'openAtStartup') {
      this.handleStartup(value);
    }
  },

  handleStartup: function (value) {
    var ipc = window.require('ipc');
    var method = (value) ? 'startup-enable' : 'startup-disable';
    ipc.send(method);
  }

});

module.exports = SettingsStore;
