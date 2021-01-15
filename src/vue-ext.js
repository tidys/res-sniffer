Vue.readTemplate = function (dir, file) {
    let full = Path.join(dir, file)
    if (Fs.existsSync(full)) {
        return Fs.readFileSync(full, 'utf-8')
    }
    return null;
}
