module.exports = {
    name: "err",
    execute(err) {
        console.log(`[Database] - Error occured while connecting to the database\n${err}`)
    }
};