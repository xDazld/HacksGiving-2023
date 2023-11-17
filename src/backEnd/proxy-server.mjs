import express from "express"
const app = new express();

app.use(express.static("../frontEnd", {index:"index.html"}));

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});