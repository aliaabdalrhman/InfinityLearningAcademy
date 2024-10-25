import connectDb from "../DB/Connection.js";
import authRouter from './Modules/Auth/Auth.router.js'
import adminRouter from './Modules/Admin/Admin.router.js'

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
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