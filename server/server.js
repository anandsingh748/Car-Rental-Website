import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log database mode on boot
console.log(`Database initialized in mode: ${db.mode}`);

// API Routes

// 1. Get all cars (with simple query string filters)
app.get('/api/cars', async (req, res) => {
  try {
    let cars = await db.getCars();
    const { category, fuel, transmission, search, maxPrice } = req.query;

    if (category && category !== 'All') {
      cars = cars.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (fuel && fuel !== 'All') {
      cars = cars.filter(c => c.fuel.toLowerCase() === fuel.toLowerCase());
    }
    if (transmission && transmission !== 'All') {
      cars = cars.filter(c => c.transmission.toLowerCase() === transmission.toLowerCase());
    }
    if (maxPrice) {
      cars = cars.filter(c => c.pricePerDay <= parseInt(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      cars = cars.filter(c => 
        c.brand.toLowerCase().includes(q) || 
        c.model.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q)
      );
    }

    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// 2. Get specific car details with its reviews
app.get('/api/cars/:id', async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await db.getCarById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    const reviews = await db.getReviews(carId);
    res.json({ ...car, reviews });
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ error: "Failed to fetch car details" });
  }
});

// 3. Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { car_id, user_name, user_email, city, pickup_date, drop_date, chauffeur, total_price } = req.body;
    
    if (!car_id || !user_name || !user_email || !city || !pickup_date || !drop_date || total_price === undefined) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const booking = await db.createBooking({
      car_id: parseInt(car_id),
      user_name,
      user_email,
      city,
      pickup_date,
      drop_date,
      chauffeur: chauffeur ? 1 : 0,
      total_price: parseInt(total_price)
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 4. Get bookings (filter by user_email if provided, otherwise return all for admin)
app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;
    let bookings = await db.getBookings();
    
    if (email) {
      bookings = bookings.filter(b => b.user_email.toLowerCase() === email.toLowerCase());
    }

    // Attach car details to bookings for ease of frontend display
    const cars = await db.getCars();
    console.log("Bookings fetched:", bookings);
    console.log("Cars fetched:", cars.map(c => ({ id: c.id, brand: c.brand, model: c.model })));
    
    const bookingsWithCars = bookings.map(booking => {
      const car = cars.find(c => c.id === booking.car_id);
      return { ...booking, car };
    });

    res.json(bookingsWithCars);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 5. Update booking status (Approve, Reject, Cancel)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Rejected', 'Cancelled'

    if (!['Approved', 'Rejected', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedBooking = await db.updateBookingStatus(id, status);
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// 6. Post a car review
app.post('/api/cars/:id/reviews', async (req, res) => {
  try {
    const carId = req.params.id;
    const { user_name, rating, comment } = req.body;

    if (!user_name || !rating || !comment) {
      return res.status(400).json({ error: "Missing review fields" });
    }

    const review = await db.addReview({
      car_id: parseInt(carId),
      user_name,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// 7. Admin Dashboard statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const cars = await db.getCars();
    const bookings = await db.getBookings();

    const totalCars = cars.length;
    const totalBookings = bookings.length;
    
    // Total Revenue is sum of approved bookings
    const approvedBookings = bookings.filter(b => b.status === 'Approved');
    const totalRevenue = approvedBookings.reduce((sum, b) => sum + b.total_price, 0);
    const activeRentals = bookings.filter(b => b.status === 'Approved').length;

    // Booking distribution by category
    const categoryCounts = {};
    for (const b of bookings) {
      const car = cars.find(c => c.id === b.car_id);
      if (car) {
        categoryCounts[car.category] = (categoryCounts[car.category] || 0) + 1;
      }
    }
    const categoriesData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    // Bookings trend: Group by pickup date
    const dateCounts = {};
    bookings.slice(-10).forEach(b => {
      dateCounts[b.pickup_date] = (dateCounts[b.pickup_date] || 0) + b.total_price;
    });
    const revenueTrend = Object.entries(dateCounts).map(([date, revenue]) => ({ date, revenue }));

    res.json({
      totalRevenue,
      totalBookings,
      totalCars,
      activeRentals,
      categoriesData,
      revenueTrend
    });
  } catch (error) {
    console.error("Error generating admin stats:", error);
    res.status(500).json({ error: "Failed to generate admin statistics" });
  }
});

// 8. Admin: Add a new car
app.post('/api/admin/cars', async (req, res) => {
  try {
    const { brand, model, category, transmission, fuel, pricePerDay, seating, mileage, image } = req.body;
    
    if (!brand || !model || !category || !transmission || !fuel || !pricePerDay || !seating || !mileage) {
      return res.status(400).json({ error: "Missing required car details" });
    }

    const defaultImage = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80";

    const car = await db.addCar({
      brand,
      model,
      category,
      transmission,
      fuel,
      pricePerDay: parseInt(pricePerDay),
      seating: parseInt(seating),
      mileage,
      image: image || defaultImage
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Failed to add car" });
  }
});

// 9. Admin: Edit a car
app.put('/api/admin/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    const updatedCar = await db.updateCar(id, fieldsToUpdate);
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(updatedCar);
  } catch (error) {
    console.error("Error editing car:", error);
    res.status(500).json({ error: "Failed to edit car" });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
