const mongoose = require("mongoose");
//1st Way
// const obj =  process.env;
// const dburl =  obj.DB_URL;

//2nd Way
// const DB_URL = process.env.DB_URL;

//3rd Way
const { DB_URL } = process.env;

const createConnection = async () => {
    try {
        const connection = await mongoose.connect(DB_URL);
        if (connection) {
            console.log("✅ Connection Successfully Created !!");
        }
    } catch (err) {
        console.log("❌ Error While Createing Connection :- " + err);
        process.exit();
    }
}
module.exports = createConnection;