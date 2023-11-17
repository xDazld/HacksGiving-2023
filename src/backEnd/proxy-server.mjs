import express from "express"
const app = new express();

app.use(express.static("../frontEnd", {index:"index.html"}));

app.listen(8096, () => {
    console.log("listening on http://localhost:8096");
});