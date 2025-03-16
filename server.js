const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const stripe = require('stripe')(''); // Add your Stripe secret key
const app = express();
const cors = require('cors');  // Import the CORS package
const googleMapsClient = require('@google/maps').createClient({
    key: '' // replace with your actual Google Maps API key
});
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Static Files
app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tourism_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Routes




// USER APIs
app.post('/api/post/users', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
            if (err) throw err;
            res.send({ message: 'User registered successfully', userId: result.insertId });
        }
    );
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (err) => {
            if (err) throw err;
            res.send({ message: 'User updated successfully' });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.send({ message: 'User deleted successfully' });
    });
});

// Add destination
app.post('/api/ent/destinations', (req, res) => {
    const { name, description, latitude, longitude, image, price } = req.body;
    const query = 'INSERT INTO destinations (name, description, latitude, longitude, image, price) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, latitude, longitude, image, price], err => {
        if (err) {
            res.status(500).send({ error: 'Failed to add destination.' });
            return;
        }
        res.send({ message: 'Destination added successfully.' });
    });
});

// Fetch all destinations
app.get('/api/destinations', (req, res) => {
    db.query('SELECT * FROM destinations', (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Failed to fetch destinations.' });
            return;
        }
        res.send(results);
    });
});

// Fetch single destination
app.get('/api/destinations/single/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM destinations WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Failed to fetch destination.' });
            return;
        }
        if (result.length === 0) {
            res.status(404).send({ error: 'Destination not found.' });
            return;
        }
        res.send(result[0]);
    });
});


app.put('/api/destinations/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, latitude, longitude, price } = req.body;
    db.query(
        'UPDATE destinations SET name = ?, description = ?, latitude = ?, longitude = ?, price = ? WHERE id = ?',
        [name, description, latitude, longitude, price, id],
        (err) => {
            if (err) {
                res.status(500).send({ error: 'Failed to update destination.' });
                return;
            }
            res.send({ message: 'Destination updated successfully' });
        }
    );
});

app.delete('/api/del/destinations/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM destinations WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to delete destination.' });
            return;
        }
        res.send({ message: 'Destination deleted successfully' });
    });
});


// BOOKING APIs
// Your existing booking API
app.post('/api/do/bookings', (req, res) => {
    const { userId, destinationId, travelDate, participants, price } = req.body;

    if (!userId || !destinationId || !travelDate || !participants || isNaN(price)) {
        return res.status(400).send({ error: 'Invalid input. Ensure all fields are filled correctly.' });
    }

    const query = 'INSERT INTO bookings (user_id, destination_id, travel_date, participants, price) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, destinationId, travelDate, participants, parseInt(price)], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Failed to create booking.' });
        }
        res.send({ message: 'Booking successful' });
    });
});


app.get('/api/bookings', (req, res) => {
    db.query('SELECT * FROM bookings', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM bookings WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { travelDate, participants } = req.body;
    db.query(
        'UPDATE bookings SET travel_date = ?, participants = ? WHERE id = ?',
        [travelDate, participants, id],
        (err) => {
            if (err) throw err;
            res.send({ message: 'Booking updated successfully' });
        }
    );
});


app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM bookings WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.send({ message: 'Booking canceled' });
    });
});

// Route to create Stripe Checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    const { price, userId, destinationId } = req.body;

    try {
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Tour to destination ${destinationId}`, // Use actual destination name if available
                        },
                        unit_amount: price * 100,  // Price is in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5000/booking-success?userId=${userId}&destinationId=${destinationId}`,
            cancel_url: 'http://localhost:5000/booking-cancel',
        });

        res.send({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send({ error: 'Failed to create checkout session' });
    }
});

// Endpoint to fetch itinerary for selected destinations
app.get('/api/itinerary', async (req, res) => {
    const { destinations } = req.query;

    if (!destinations) {
        return res.status(400).json({ message: 'Destinations are required' });
    }

    try {
        const ids = destinations.split(',');
        const [results] = await db.promise().query('SELECT id, name, latitude, longitude FROM destinations WHERE id IN (?)', [ids]);

        const itinerary = results.map(dest => ({
            name: dest.name,
            latitude: dest.latitude,
            longitude: dest.longitude,
        }));

        res.json({ itinerary });
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        res.status(500).json({ message: 'Error fetching itinerary data' });
    }
});
app.post('/api/reviews', (req, res) => {
    const { user_id, destination_id, rating, review } = req.body;

    if (!user_id || !destination_id || !rating) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    const query = `INSERT INTO ratings_reviews (user_id, destination_id, rating, review) VALUES (?, ?, ?, ?)`;
    db.query(query, [user_id, destination_id, rating, review], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review submitted successfully", reviewId: result.insertId });
    });
});

// Fetch All Reviews (Admin)
app.get('/api/reviews', (req, res) => {
    const query = `SELECT r.id, r.rating, r.review, r.created_at, r.is_approved, 
                          u.name AS user_name, d.name AS destination_name 
                   FROM ratings_reviews r
                   JOIN users u ON r.user_id = u.id
                   JOIN destinations d ON r.destination_id = d.id`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
