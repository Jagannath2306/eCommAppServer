const app = require("./server");

const port = process.env.PORT || 5000;
require('express-async-errors');

app.listen(port,() => {
    console.log(`✅ Server listing on http://localhost:${port}`);
    console.log(`✅ API Docs on http://localhost:${port}/api-docs`);
});
