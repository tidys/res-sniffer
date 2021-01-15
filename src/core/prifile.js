const Fs = require('fs-extra');
const Path = require('path');
const Electron = require('electron');

class Profile {
    constructor (path) {
        this.path = Path.join(this.profilePath, path);
        console.log('cfg: ', this.path)
        this._load()
    }

    get profilePath () {
        let app = null;
        if (process.type === 'renderer') {
            app = Electron.remote.app;
        } else {
            app = Electron.app;
        }
        return Path.join(app.getPath('userData'), 'profile');
    }

    _load () {
        let path = this.path;
        if (!Fs.existsSync(path)) {
            Fs.ensureFileSync(path)
            Fs.writeFileSync(path, '{}', 'utf8');
        }

        let data;
        try {
            data = JSON.parse(Fs.readFileSync(path, 'utf8'));
        } catch (e) {
            Fs.writeFileSync(path, '{}', 'utf8');
            data = {};
        }
        this._data = data;
        return data;
    }

    get (key) {
        return (this._data && this._data[key]) || null;
    }

    set (k, v) {
        if (!this._data) return;
        this._data[k] = v;
        this.save();
    }

    delete (k) {
        delete this._data[k];
        this.save();
    }

    isEmpty () {
        return Object.keys(this._data).length === 0
    }

    empty () {
        this._data = {};
        this.save();
    }

    get data () {
        return this._data;
    }

    setObject (data) {
        if (!this._data) return;
        for (let key in data) {
            this._data[key] = data[key];
        }
        this.save();
    }

    save () {
        Fs.writeFileSync(this.path, JSON.stringify(this._data, null, 4));
    }
}

module.exports = Profile;
