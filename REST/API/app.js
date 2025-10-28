const express = require('express');
const cors = require('cors');
const db = require('./db')
const {hashPassword, comparePassword, generateToken, verifyToken} = require('./auth')

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

function validateToken(req, res, next) {
    const authHeader = req.headers['authentication']
    const token = authHeader.split(' ')[1]

    if(!token) {
        res.status(401).json({error: 'No token found'})
    }

    const decoded = verifyToken(token)
    if(!decoded) {
        return res.status(403).json({error: 'Invalid or expired token'})
    }

    req.user = decoded
    next()
}

const itemsCollection = db.collection('items')
const usersCollection = db.collection('users')

app.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body

        const hashedPassword = await hashPassword(password)

        //check if the user is already registered
        
        const newUser = {
            email,
            password: hashedPassword
        }

        const docRef = await usersCollection.add(newUser)
        res.status(201).json(
            {
                userId: docRef.id
            }
        )
    } catch(error) {
        console.log(error)
        res.status(500).json({error: 'Registration failed'})
    }
    
    
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const snapshot = await usersCollection.where('email', '==', email).get()
        
        if (snapshot.empty) {
            return res.status(401).json({error: 'User does not exist'})
        }

        const userDoc = snapshot.docs[0]
        const user = {
            id: userDoc.id,
            ...userDoc.data()
        }

        const passIsValid = await comparePassword(password, user.password)

        if(!passIsValid) {
            return res.status(401).json({error: 'Invalid password'})
        }

        const token = generateToken({
            id: user.id, 
            email: user.email
        })

        res.status(200).json({token})

    } catch(error) {
        console.log(error)
        res.status(500).json({error: 'Authentication failed'})
    }
})

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

app.post('/items', validateToken, async (req, res) => {
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

app.put('/items/:id', validateToken, (req, res) => {
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

app.delete('/items/:id', validateToken, (req, res) => {
    const id = Number(req.params.id);
    const idx = items.findIndex(i => i.id === id);
  
    if (idx === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    items.splice(idx, 1);
  
    res.json({ message: 'Item deleted' });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));