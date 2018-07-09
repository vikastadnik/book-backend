function Author (dbObject) {
    this.id = dbObject.ID;
    this.name = dbObject.NAME;
    this.birthDate  = dbObject.BIRTH_DATE;
}

module.exports = Author;