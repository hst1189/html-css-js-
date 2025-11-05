import express from "express";
const app = express();

const a = {
    name: "dasdsas",
    age: 13,
    sex: "female",
    t: {
        aaa: "aaa",
        ccc: "ccc",
        ddd: "ddd",
        zzz: "zzz",
    }
}


const users = [
    { id: 1, name: "aaa", age: 18 },
    { id: 2, name: "bbb", age: 18 },
    { id: 3, name: "ccc", age: 18 },
    { id: 4, name: "ddd", age: 18 },
    { id: 5, name: "eee", age: 18 }
]

app.get('/', (req, res) => {
    res.send(JSON.stringify(a));

})

app.get("/users", (req, res) => {
    res.send(users);
})

app.get("/users/:id", (req, res) => {

    res.send(users.find((user) => user.id == req.params.id));
})


app.listen(80, (err) => {

    if (!err) {
        console.log("start on port 80");
    }
})
