const Path = require('path')
const Fs = require('fs');
const Profile = require('./prifile');

module.exports = {
    _profile: new Profile('settings.json'),
    Owner: null,
    Repo: null,
    Token: null,
    init () {
        if (this._profile.isEmpty()) {
            this.save({
                owner: 'tidys',
                repo: 'sniffer-repo',
                token: '37984720dde41330af2fbb9774a64992',
            })
        } else {
            this.Owner = this._profile.data['owner'];
            this.Repo = this._profile.data['repo'];
            this.Token = this._profile.data['token'];
        }
    },
    save ({ owner, repo, token }) {
        this.Owner = owner;
        this.Repo = repo;
        this.token = token;

        this._profile.set('owner', owner);
        this._profile.set('repo', repo);
        this._profile.set('token', token);
        this._profile.save();
    }
}
