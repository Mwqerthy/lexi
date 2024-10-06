import app from "./app.js"


const PORT = process.env.PORT;


app.listen(process.env.PORT, () => console.log(`Server Connected to database and listening at port ${PORT} .`))