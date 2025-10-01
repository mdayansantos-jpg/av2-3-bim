import express from 'express';
import prisma from './db.js';


const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// ------------------------------------
// ROTAS PARA USUÁRIOS (USERS)
// ------------------------------------

// POST /users body: { name } - Cria um novo usuário
app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.create({
      data: { name }
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /users/:id - Retorna um usuário específico
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { stores: true } // Inclui as lojas do usuário
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// ------------------------------------
// ROTAS PARA LOJAS (STORES)
// ------------------------------------

// POST /stores body: { name, userId } - Cria uma nova loja
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

// GET /stores/:id > retorna Loja + user (dono) + produtos
app.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(req.params.id) },
      // Corrigido 'product' para 'products' de acordo com o padrão de relacionamento
      include: { user: true, products: true } 
    });
    if (!store) return res.status(404).json({ error: 'Loja não encontrada' });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /stores/:id > Atualiza dados de uma loja
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

// DELETE /stores/:id > Deleta uma loja
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


// ------------------------------------
// ROTAS PARA PRODUTOS (PRODUCTS)
// ------------------------------------

// POST /products body: { name, price, storeId } - Cria um novo produto
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

// GET /products - inclui a loja e o dono da Loja
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

// PUT /products/:id > Atualiza dados de um produto
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

// DELETE /products/:id > Deleta um produto
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