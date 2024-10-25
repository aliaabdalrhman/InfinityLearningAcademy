import connectDb from "../DB/Connection.js";
import cors from "cors"

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.get('*', (req, res) => {
        return res.status(404).json({ message: "page not found" });
    })
}
export default initApp;