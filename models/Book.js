var Book = function (dbObject) {
    this.id = dbObject.ID;
    this.title = dbObject.TITLE;
    this.releaseDate  = dbObject.RELEASE_DATE;
    this.authorName =  dbObject.NAME;
};

module.exports = Book;