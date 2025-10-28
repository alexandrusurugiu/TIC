const express = require('express');
const cors = require('cors');
const db = require('./db')

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// simple logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const itemsCollection = db.collection('items')

app.get('/items', async (req, res) => {
    try {
        const snapshot = await itemsCollection.get()
        const items = []
        snapshot.forEach(doc => {
            items.push(
                {
                    id: doc.id,
                    ...doc.data()
                }
            )

            res.status(200).json(items)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Failed to get items"})
    }

    res.json(items);
});

app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

app.post('/items', async (req, res) => {
    const { name, price } = req.body;
  
    if (typeof name !== 'string' || name.trim() === '' || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
  
    const newItem = { 
        name: name.trim(), 
        price: Number(price) 
    };
  
    const docRef = await itemsCollection.add(newItem)

  
    res.status(201).json({ id: docRef.id });
});

app.put('/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = items.findIndex(i => i.id === id);
  
    if (idx === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
  
    const { name, price } = req.body;
    if (name !== undefined) {
        items[idx].name = name;
    }
  
    if (price !== undefined) {
        items[idx].price = Number(price);
    }

    res.json(items[idx]);
});

app.delete('/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = items.findIndex(i => i.id === id);
  
    if (idx === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    items.splice(idx, 1);
  
    res.json({ message: 'Item deleted' });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));