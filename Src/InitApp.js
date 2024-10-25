import connectDb from "../DB/Connection.js";
import cors from "cors"

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.get('*', (req, res, next) => {
        return next(new AppError("page not found", 404));
    });
    app.use((success, req, res, next) => {
        return res.status(success.statusCode).json({ message: success.message, ...success.additionalData });
    });
    app.use((err, req, res, next) => {
        return res.status(err.statusCode).json({ message: err.message });
    });
}
export default initApp;