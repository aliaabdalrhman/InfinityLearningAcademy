import connectDb from "../DB/Connection.js";
import cors from "cors";
import authRouter from './Modules/Auth/Auth.router.js'
import adminRouter from './Modules/Admin/Admin.router.js'
import categoryRouter from './Modules/Categories/Category.router.js';

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/categories', categoryRouter);
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