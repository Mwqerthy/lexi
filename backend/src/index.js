import app from "./app.js"


const PORT = process.env.PORT || 5000;


app.listen(process.env.PORT, () => console.log(`Server Connected to database and listening at port ${PORT} .`))