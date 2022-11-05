import express, { Application } from "express"
import morgan from "morgan"
import * as dotenv from "dotenv"
import bodyParser from "body-parser"
import router from "./routes/index"

dotenv.config()

const PORT = process.env.PORT || 3000
// create an instance server
const app: Application = express()

//config body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// HTTP request logger middleware
app.use(morgan("short"))

app.use(express.json())

// add routes
app.use("/", router)

// start express server
app.listen(PORT, () => {
  console.log(`Server is listening @ port:${PORT}`)
})

export default app
