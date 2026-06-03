import express from 'express';
import cors from 'cors';
import paypalRoutes from './routes/paypal.routes';
import productsRoutes from './routes/products.routes';
import pedidosRoutes from './routes/pedidos.routes';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/products', productsRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;