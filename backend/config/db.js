const mongoose = require("mongoose")
const port = process.env.MONGO_PORT
const url = `mongodb://mongo:${port}/employee`
// const url = "mongodb+srv://sebastianrobi29:<---pass----->@cluster0.vhmgdqa.mongodb.net/employee"

const db = () => {
    mongoose.connect(url)
        .then(() => {
            console.log(`mongo running on port ${port}`)
        })
        .catch(error => {
            console.log(`mongo connection unsuccessful! ${error}`);
        })
}

module.exports = db