require('dotenv').config();
const express = require('express');
const path = require('path');
const start = require('./src/start');
const isAuthMiddleware = require('./src/middlewares/isAuth');
const currentUserMiddleware = require('./src/middlewares/currentUser');
const authRoutes = require('./src/routes/auth');
const orderRoutes = require('./src/routes/order');
const userRoutes = require('./src/routes/user');
const regionRoutes = require('./src/routes/region');
const districtRoutes = require('./src/routes/district');
const productRoutes = require('./src/routes/product');
const deliveryDetailsRoutes = require('./src/routes/deliveryDetails');
const xlsxRoutes = require('./src/routes/exel-xlsx');
const verifiedRoutes = require('./src/routes/verified');
const failuredRoutes = require('./src/routes/failured');
const historyRoutes = require('./src/routes/history');
const managerRoutes = require('./src/routes/manager');
const dashboardRoutes = require('./src/routes/dashboard');
const sourceRoutes = require('./src/routes/source');
const taskRoutes = require('./src/routes/task');

const app = express();

const { NODE_ENV } = process.env;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/order', isAuthMiddleware, currentUserMiddleware, orderRoutes);
app.use('/api/user', isAuthMiddleware, currentUserMiddleware, userRoutes);
app.use('/api/region', isAuthMiddleware, currentUserMiddleware, regionRoutes);
app.use('/api/district', isAuthMiddleware, currentUserMiddleware, districtRoutes);
app.use('/api/product', isAuthMiddleware, currentUserMiddleware, productRoutes);
app.use('/api/delivery', isAuthMiddleware, currentUserMiddleware, deliveryDetailsRoutes);
app.use('/api/verified', isAuthMiddleware, currentUserMiddleware, verifiedRoutes);
app.use('/api/failured', isAuthMiddleware, currentUserMiddleware, failuredRoutes);
app.use('/api/manager', isAuthMiddleware, currentUserMiddleware, managerRoutes);
app.use('/api/xlsx', isAuthMiddleware, currentUserMiddleware, xlsxRoutes);
app.use('/api/history', isAuthMiddleware, currentUserMiddleware, historyRoutes);
app.use('/api/dashboard', isAuthMiddleware, currentUserMiddleware, dashboardRoutes);
app.use('/api/source', isAuthMiddleware, currentUserMiddleware, sourceRoutes);
app.use('/api/task', isAuthMiddleware, currentUserMiddleware, taskRoutes);

if (NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
};

start(app);