function Level(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}