import express from 'express';
import prisma from './db.js';

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Stores
app.post('/stores', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const store = await prisma.store.create({
      data: { name, userId: Number(userId) }
    });
    res.status(201).json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, products: true }
    });
    if (!store) return res.status(404).json({ error: 'Loja não encontrada' });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Products
app.post('/products', async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    const product = await prisma.product.create({
      data: { name, price: Number(price), storeId: Number(storeId) }
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { store: { include: { user: true } } }
    });
    res.json(products);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Users
app.post('/user', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Atualizar e deletar usuários, produtos e lojas
app.put('/user/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email, password },
    });
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(deletedUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/stores/:id', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const updatedStore = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data: { name, userId: Number(userId) },
    });
    res.json(updatedStore);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/stores/:id', async (req, res) => {
  try {
    const deletedStore = await prisma.store.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(deletedStore);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, price: Number(price), storeId: Number(storeId) },
    });
    res.json(updatedProduct);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(deletedProduct);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});