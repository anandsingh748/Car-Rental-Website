import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'cars.db');
const JSON_DB_PATH = path.join(__dirname, 'db_fallback.json');

const initialCars = [
  {
    id: 1,
    brand: "Maruti Suzuki",
    model: "Alto K10",
    name: "Alto K10",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 1200,
    price: 1200,
    seating: 5,
    seats: 5,
    mileage: "24.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Maruti_Suzuki_Alto.jpg",
    available: 1
  },
  {
    id: 2,
    brand: "Maruti Suzuki",
    model: "Swift",
    name: "Swift",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 1800,
    price: 1800,
    seating: 5,
    seats: 5,
    mileage: "22.3 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Maruti_Suzuki_Swift_4456.JPG",
    available: 1
  },
  {
    id: 3,
    brand: "Maruti Suzuki",
    model: "Baleno",
    name: "Baleno",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2200,
    price: 2200,
    seating: 5,
    seats: 5,
    mileage: "22.9 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Suzuki_Baleno_Hatchback_%28front%29.jpg",
    available: 1
  },
  {
    id: 4,
    brand: "Maruti Suzuki",
    model: "WagonR",
    name: "WagonR",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 1400,
    price: 1400,
    seating: 5,
    seats: 5,
    mileage: "23.5 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/af/Maruti_Suzuki_Wagon_R.jpg",
    available: 1
  },
  {
    id: 5,
    brand: "Maruti Suzuki",
    model: "Dzire",
    name: "Dzire",
    category: "Sedan",
    type: "Sedan",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2000,
    price: 2000,
    seating: 5,
    seats: 5,
    mileage: "22.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Maruti_Suzuki_Swift_Dzire.jpg",
    available: 1
  },
  {
    id: 6,
    brand: "Maruti Suzuki",
    model: "Brezza",
    name: "Brezza",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2800,
    price: 2800,
    seating: 5,
    seats: 5,
    mileage: "19.8 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Maruti_Vitara_Brezza.jpg",
    available: 1
  },
  {
    id: 7,
    brand: "Maruti Suzuki",
    model: "Fronx",
    name: "Fronx",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2600,
    price: 2600,
    seating: 5,
    seats: 5,
    mileage: "20.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Suzuki_Fronx_%28front%29.jpg",
    available: 1
  },
  {
    id: 8,
    brand: "Maruti Suzuki",
    model: "Ertiga",
    name: "Ertiga",
    category: "MUV",
    type: "MUV",
    transmission: "Manual",
    fuel: "CNG",
    fuelType: "CNG",
    pricePerDay: 2800,
    price: 2800,
    seating: 7,
    seats: 7,
    mileage: "26.1 km/kg",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Suzuki_Ertiga%2C_MPV_front_view.jpg",
    available: 1
  },
  {
    id: 9,
    brand: "Maruti Suzuki",
    model: "XL6",
    name: "XL6",
    category: "MUV",
    type: "MUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 3200,
    price: 3200,
    seating: 6,
    seats: 6,
    mileage: "20.9 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Maruti_Suzuki_XL6_%28front%29.jpg",
    available: 1
  },
  {
    id: 10,
    brand: "Hyundai",
    model: "Creta",
    name: "Creta",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 3500,
    price: 3500,
    seating: 5,
    seats: 5,
    mileage: "18.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Hyundai_Creta_India.jpg",
    available: 1
  },
  {
    id: 11,
    brand: "Hyundai",
    model: "Venue",
    name: "Venue",
    category: "SUV",
    type: "SUV",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2500,
    price: 2500,
    seating: 5,
    seats: 5,
    mileage: "17.5 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Hyundai_Venue_Elite%2C_2021_front.jpg",
    available: 1
  },
  {
    id: 12,
    brand: "Hyundai",
    model: "i20",
    name: "i20",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2000,
    price: 2000,
    seating: 5,
    seats: 5,
    mileage: "20.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Hyundai_i20_1.0_T-GDI_Trend_%28III%2C_Facelift%29_%E2%80%93_h_09022025.jpg",
    available: 1
  },
  {
    id: 13,
    brand: "Hyundai",
    model: "Exter",
    name: "Exter",
    category: "SUV",
    type: "SUV",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2200,
    price: 2200,
    seating: 5,
    seats: 5,
    mileage: "19.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/2023_Hyundai_Exter.jpg",
    available: 1
  },
  {
    id: 14,
    brand: "Hyundai",
    model: "Verna",
    name: "Verna",
    category: "Sedan",
    type: "Sedan",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 3000,
    price: 3000,
    seating: 5,
    seats: 5,
    mileage: "18.6 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Hyundai_Verna_2019.jpg",
    available: 1
  },
  {
    id: 15,
    brand: "Tata",
    model: "Nexon",
    name: "Nexon",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 3000,
    price: 3000,
    seating: 5,
    seats: 5,
    mileage: "17.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/2018_Tata_Nexon_XM.jpg",
    available: 1
  },
  {
    id: 16,
    brand: "Tata",
    model: "Punch",
    name: "Punch",
    category: "SUV",
    type: "SUV",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2000,
    price: 2000,
    seating: 5,
    seats: 5,
    mileage: "20.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tata_Punch_Camo_spotted_at_Visakhapatnam.jpg",
    available: 1
  },
  {
    id: 17,
    brand: "Tata",
    model: "Tiago",
    name: "Tiago",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 1500,
    price: 1500,
    seating: 5,
    seats: 5,
    mileage: "20.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tata_tiago.jpg",
    available: 1
  },
  {
    id: 18,
    brand: "Tata",
    model: "Altroz",
    name: "Altroz",
    category: "Hatchback",
    type: "Hatchback",
    transmission: "Manual",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 2000,
    price: 2000,
    seating: 5,
    seats: 5,
    mileage: "23.6 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Tata_Altroz_front_20230617.jpg",
    available: 1
  },
  {
    id: 19,
    brand: "Tata",
    model: "Harrier",
    name: "Harrier",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 4500,
    price: 4500,
    seating: 5,
    seats: 5,
    mileage: "16.3 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Tata_Buzzard_Sport_Genf_2019_1Y7A5793.jpg",
    available: 1
  },
  {
    id: 20,
    brand: "Tata",
    model: "Safari",
    name: "Safari",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 5000,
    price: 5000,
    seating: 7,
    seats: 7,
    mileage: "16.1 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/06/2009_tata_safari_vx_4x4.JPG",
    available: 1
  },
  {
    id: 21,
    brand: "Mahindra",
    model: "Scorpio-N",
    name: "Scorpio-N",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 4800,
    price: 4800,
    seating: 7,
    seats: 7,
    mileage: "14.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/2024_Mahindra_Scorpio_Z8L_front.jpg",
    available: 1
  },
  {
    id: 22,
    brand: "Mahindra",
    model: "Thar",
    name: "Thar",
    category: "SUV",
    type: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 4200,
    price: 4200,
    seating: 4,
    seats: 4,
    mileage: "15.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_03.jpg",
    available: 1
  },
  {
    id: 23,
    brand: "Mahindra",
    model: "XUV700",
    name: "XUV700",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 5000,
    price: 5000,
    seating: 7,
    seats: 7,
    mileage: "13.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png",
    available: 1
  },
  {
    id: 24,
    brand: "Mahindra",
    model: "Bolero",
    name: "Bolero",
    category: "SUV",
    type: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 2500,
    price: 2500,
    seating: 7,
    seats: 7,
    mileage: "16.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Mahindra_Bolero_PLUS.jpg",
    available: 1
  },
  {
    id: 25,
    brand: "Kia",
    model: "Sonet",
    name: "Sonet",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2600,
    price: 2600,
    seating: 5,
    seats: 5,
    mileage: "18.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Kia_Sonet_02.jpg",
    available: 1
  },
  {
    id: 26,
    brand: "Kia",
    model: "Seltos",
    name: "Seltos",
    category: "SUV",
    type: "SUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 3400,
    price: 3400,
    seating: 5,
    seats: 5,
    mileage: "17.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Kia_Seltos_2024.jpg",
    available: 1
  },
  {
    id: 27,
    brand: "Kia",
    model: "Carens",
    name: "Carens",
    category: "MUV",
    type: "MUV",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 3600,
    price: 3600,
    seating: 7,
    seats: 7,
    mileage: "17.9 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/2022_Kia_Carens_1.4_Luxury_Plus_%28India%29_front_view_01.jpg",
    available: 1
  },
  {
    id: 28,
    brand: "Honda",
    model: "City",
    name: "City",
    category: "Sedan",
    type: "Sedan",
    transmission: "Manual",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 2400,
    price: 2400,
    seating: 5,
    seats: 5,
    mileage: "18.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/05/2014_Honda_City_%28GM6_MY14%29_VTi_sedan_%282015-07-15%29_01.jpg",
    available: 1
  },
  {
    id: 29,
    brand: "Toyota",
    model: "Innova Hycross",
    name: "Innova Hycross",
    category: "MUV",
    type: "MUV",
    transmission: "Automatic",
    fuel: "Hybrid",
    fuelType: "Hybrid",
    pricePerDay: 5200,
    price: 5200,
    seating: 7,
    seats: 7,
    mileage: "23.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Toyota_Innova_Crysta_2.4_Z_front_right.jpg",
    available: 1
  },
  {
    id: 30,
    brand: "Toyota",
    model: "Fortuner",
    name: "Fortuner",
    category: "Luxury SUV",
    type: "Luxury SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 7500,
    price: 7500,
    seating: 7,
    seats: 7,
    mileage: "10.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Toyota_Fortuner_%2817050240683%29.jpg",
    available: 1
  },
  {
    id: 31,
    brand: "Mercedes-Benz",
    model: "C-Class",
    name: "C-Class",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 8500,
    price: 8500,
    seating: 5,
    seats: 5,
    mileage: "14.5 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Mercedes_C_Class_%28W204_C-Class%29_front.jpg",
    available: 1
  },
  {
    id: 32,
    brand: "Mercedes-Benz",
    model: "E-Class",
    name: "E-Class",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 12000,
    price: 12000,
    seating: 5,
    seats: 5,
    mileage: "15.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Mercedes-Benz_E-Class_%28W213%29_Estate%2C_2017.jpg",
    available: 1
  },
  {
    id: 33,
    brand: "BMW",
    model: "3 Series",
    name: "3 Series",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 9000,
    price: 9000,
    seating: 5,
    seats: 5,
    mileage: "16.1 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/13/BMW_3_SERIES_LWB_SEDAN_%28G20%29_China_%2817%29.jpg",
    available: 1
  },
  {
    id: 34,
    brand: "BMW",
    model: "X5",
    name: "X5",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Diesel",
    fuelType: "Diesel",
    pricePerDay: 14000,
    price: 14000,
    seating: 5,
    seats: 5,
    mileage: "13.4 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/2019_BMW_X5_xDrive30d_M_Sport_Automatic_3.0_Front.jpg",
    available: 1
  },
  {
    id: 35,
    brand: "Audi",
    model: "A6",
    name: "A6",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 10000,
    price: 10000,
    seating: 5,
    seats: 5,
    mileage: "14.1 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/2018_Audi_A6_TDi_Quattro_Front.jpg",
    available: 1
  },
  {
    id: 36,
    brand: "Audi",
    model: "Q7",
    name: "Q7",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 15000,
    price: 15000,
    seating: 7,
    seats: 7,
    mileage: "11.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Audi_Q7_%28Facelift%29_front_20110115.jpg",
    available: 1
  },
  {
    id: 37,
    brand: "Jaguar",
    model: "XF",
    name: "XF",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 11000,
    price: 11000,
    seating: 5,
    seats: 5,
    mileage: "13.8 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Jaguar_XF_Front-view.JPG",
    available: 1
  },
  {
    id: 38,
    brand: "Land Rover",
    model: "Range Rover Velar",
    name: "Range Rover Velar",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 16000,
    price: 16000,
    seating: 5,
    seats: 5,
    mileage: "12.5 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Land_Rover_Range_Rover_Velar_Genf_2018_1Y7A5657.jpg",
    available: 1
  },
  {
    id: 39,
    brand: "Porsche",
    model: "Macan",
    name: "Macan",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Petrol",
    fuelType: "Petrol",
    pricePerDay: 18000,
    price: 18000,
    seating: 5,
    seats: 5,
    mileage: "11.0 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/2018_Porsche_Macan_2.0_Front.jpg",
    available: 1
  },
  {
    id: 40,
    brand: "Volvo",
    model: "XC90",
    name: "XC90",
    category: "Luxury",
    type: "Luxury",
    transmission: "Automatic",
    fuel: "Hybrid",
    fuelType: "Hybrid",
    pricePerDay: 13500,
    price: 13500,
    seating: 7,
    seats: 7,
    mileage: "17.2 kmpl",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Volvo_XC90_front.JPG",
    available: 1
  }
];

const initialReviews = [
  { id: 1, car_id: 1, user_name: "Rahul Sharma", rating: 5, comment: "Excellent city car. Very easy to park and great fuel efficiency!", date: "2026-07-10" },
  { id: 2, car_id: 2, user_name: "Amit Patel", rating: 5, comment: "Mahindra Thar is a beast. Explored offbeat roads in Goa, absolutely thrilling!", date: "2026-07-12" },
  { id: 3, car_id: 3, user_name: "Priya Nair", rating: 4, comment: "Very quiet cabin and great EV performance. Battery lasted longer than expected.", date: "2026-07-14" },
  { id: 4, car_id: 4, user_name: "Vikram Singh", rating: 5, comment: "Rented Innova with chauffeur for a family trip. Highly spacious and comfortable.", date: "2026-07-11" },
  { id: 5, car_id: 5, user_name: "Sneha Roy", rating: 4, comment: "The styling of Verna is beautiful. Smooth ride, ADAS features worked great.", date: "2026-07-15" }
];

const initialBookings = [
  {
    id: 1,
    car_id: 4,
    user_name: "Vikram Singh",
    user_email: "vikram@gmail.com",
    city: "Delhi NCR",
    pickup_date: "2026-07-20",
    drop_date: "2026-07-23",
    chauffeur: 1,
    total_price: 18900,
    status: "Approved"
  },
  {
    id: 2,
    car_id: 1,
    user_name: "Rahul Sharma",
    user_email: "rahul@gmail.com",
    city: "Mumbai",
    pickup_date: "2026-07-18",
    drop_date: "2026-07-19",
    chauffeur: 0,
    total_price: 1800,
    status: "Pending"
  }
];

class JSONDatabase {
  constructor() {
    this.data = { cars: [], bookings: [], reviews: [] };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(JSON_DB_PATH)) {
        const fileContent = fs.readFileSync(JSON_DB_PATH, 'utf8');
        this.data = JSON.parse(fileContent);
        // Sync initial car images & missing cars
        let updated = false;
        initialCars.forEach(initCar => {
          const existing = this.data.cars.find(c => c.id === initCar.id);
          if (existing) {
            if (existing.image !== initCar.image) {
              existing.image = initCar.image;
              updated = true;
            }
          } else {
            this.data.cars.push(initCar);
            updated = true;
          }
        });
        if (updated) this.save();
      } else {
        this.data = { cars: initialCars, bookings: initialBookings, reviews: initialReviews };
        this.save();
      }
    } catch (e) {
      console.error("Error loading JSON database:", e);
      this.data = { cars: initialCars, bookings: initialBookings, reviews: initialReviews };
    }
  }

  save() {
    try {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error("Error saving JSON database:", e);
    }
  }

  async getCars() {
    return this.data.cars;
  }

  async getCarById(id) {
    return this.data.cars.find(c => c.id === parseInt(id));
  }

  async addCar(car) {
    const newId = this.data.cars.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
    const newCar = { ...car, id: newId, available: 1 };
    this.data.cars.push(newCar);
    this.save();
    return newCar;
  }

  async updateCar(id, updatedFields) {
    const index = this.data.cars.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.data.cars[index] = { ...this.data.cars[index], ...updatedFields };
      this.save();
      return this.data.cars[index];
    }
    return null;
  }

  async createBooking(booking) {
    const newId = this.data.bookings.reduce((max, b) => b.id > max ? b.id : max, 0) + 1;
    const newBooking = { ...booking, id: newId, status: "Pending" };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  async getBookings() {
    return this.data.bookings;
  }

  async updateBookingStatus(id, status) {
    const index = this.data.bookings.findIndex(b => b.id === parseInt(id));
    if (index !== -1) {
      this.data.bookings[index].status = status;
      this.save();
      return this.data.bookings[index];
    }
    return null;
  }

  async cancelBooking(id) {
    const index = this.data.bookings.findIndex(b => b.id === parseInt(id));
    if (index !== -1) {
      this.data.bookings[index].status = "Cancelled";
      this.save();
      return this.data.bookings[index];
    }
    return null;
  }

  async getReviews(carId) {
    return this.data.reviews.filter(r => r.car_id === parseInt(carId));
  }

  async addReview(review) {
    const newId = this.data.reviews.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newReview = { ...review, id: newId, date: new Date().toISOString().split('T')[0] };
    this.data.reviews.push(newReview);
    this.save();
    return newReview;
  }
}

// Check if we can use SQLite
let activeDb = null;

try {
  // Try loading sqlite3 dynamically
  const sqlite3Module = await import('sqlite3');
  const sqliteModule = await import('sqlite');
  
  const sqlite3 = sqlite3Module.default.verbose();
  const { open } = sqliteModule;

  const dbConnection = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  console.log("SQLite Loaded Successfully!");

  // Create tables if they don't exist
  await dbConnection.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      model TEXT,
      category TEXT,
      transmission TEXT,
      fuel TEXT,
      pricePerDay INTEGER,
      seating INTEGER,
      mileage TEXT,
      image TEXT,
      available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER,
      user_name TEXT,
      user_email TEXT,
      city TEXT,
      pickup_date TEXT,
      drop_date TEXT,
      chauffeur INTEGER,
      total_price INTEGER,
      status TEXT DEFAULT 'Pending'
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER,
      user_name TEXT,
      rating INTEGER,
      comment TEXT,
      date TEXT
    );
  `);

  // Seed or update cars
  const carsCount = await dbConnection.get("SELECT COUNT(*) as count FROM cars");
  if (carsCount.count === 0) {
    for (const car of initialCars) {
      await dbConnection.run(
        `INSERT INTO cars (id, brand, model, category, transmission, fuel, pricePerDay, seating, mileage, image, available) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [car.id, car.brand, car.model, car.category, car.transmission, car.fuel, car.pricePerDay, car.seating, car.mileage, car.image, car.available]
      );
    }

    for (const booking of initialBookings) {
      await dbConnection.run(
        `INSERT INTO bookings (id, car_id, user_name, user_email, city, pickup_date, drop_date, chauffeur, total_price, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [booking.id, booking.car_id, booking.user_name, booking.user_email, booking.city, booking.pickup_date, booking.drop_date, booking.chauffeur, booking.total_price, booking.status]
      );
    }

    for (const r of initialReviews) {
      await dbConnection.run(
        `INSERT INTO reviews (id, car_id, user_name, rating, comment, date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [r.id, r.car_id, r.user_name, r.rating, r.comment, r.date]
      );
    }
    console.log("Database seeded successfully!");
  } else {
    // Sync existing car images and insert any missing default cars (like luxury cars)
    for (const car of initialCars) {
      const existing = await dbConnection.get("SELECT id FROM cars WHERE id = ?", [car.id]);
      if (!existing) {
        await dbConnection.run(
          `INSERT INTO cars (id, brand, model, category, transmission, fuel, pricePerDay, seating, mileage, image, available) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [car.id, car.brand, car.model, car.category, car.transmission, car.fuel, car.pricePerDay, car.seating, car.mileage, car.image, car.available]
        );
      } else {
        await dbConnection.run(
          `UPDATE cars SET image = ?, category = ?, pricePerDay = ? WHERE id = ?`,
          [car.image, car.category, car.pricePerDay, car.id]
        );
      }
    }
  }

  // Wrapper interface for SQLite matching JSON Database API
  activeDb = {
    mode: "sqlite",
    getCars: async () => {
      const rows = await dbConnection.all("SELECT * FROM cars");
      return rows.map(r => ({
        ...r,
        name: r.model,
        type: r.category,
        fuelType: r.fuel,
        seats: r.seating,
        price: r.pricePerDay
      }));
    },
    getCarById: async (id) => {
      const r = await dbConnection.get("SELECT * FROM cars WHERE id = ?", [id]);
      if (!r) return null;
      return {
        ...r,
        name: r.model,
        type: r.category,
        fuelType: r.fuel,
        seats: r.seating,
        price: r.pricePerDay
      };
    },
    addCar: async (car) => {
      const res = await dbConnection.run(
        `INSERT INTO cars (brand, model, category, transmission, fuel, pricePerDay, seating, mileage, image, available) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [car.brand, car.model, car.category, car.transmission, car.fuel, car.pricePerDay, car.seating, car.mileage, car.image]
      );
      const newCar = {
        ...car,
        id: res.lastID,
        available: 1,
        name: car.model,
        type: car.category,
        fuelType: car.fuel,
        seats: car.seating,
        price: car.pricePerDay
      };
      return newCar;
    },
    updateCar: async (id, updatedFields) => {
      const sets = [];
      const vals = [];
      for (const [key, value] of Object.entries(updatedFields)) {
        sets.push(`${key} = ?`);
        vals.push(value);
      }
      vals.push(id);
      await dbConnection.run(`UPDATE cars SET ${sets.join(', ')} WHERE id = ?`, vals);
      const r = await dbConnection.get("SELECT * FROM cars WHERE id = ?", [id]);
      if (!r) return null;
      return {
        ...r,
        name: r.model,
        type: r.category,
        fuelType: r.fuel,
        seats: r.seating,
        price: r.pricePerDay
      };
    },
    createBooking: async (booking) => {
      const res = await dbConnection.run(
        `INSERT INTO bookings (car_id, user_name, user_email, city, pickup_date, drop_date, chauffeur, total_price, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
        [booking.car_id, booking.user_name, booking.user_email, booking.city, booking.pickup_date, booking.drop_date, booking.chauffeur, booking.total_price]
      );
      return { ...booking, id: res.lastID, status: "Pending" };
    },
    getBookings: async () => {
      return await dbConnection.all("SELECT * FROM bookings");
    },
    updateBookingStatus: async (id, status) => {
      await dbConnection.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
      return await dbConnection.get("SELECT * FROM bookings WHERE id = ?", [id]);
    },
    cancelBooking: async (id) => {
      await dbConnection.run("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", [id]);
      return await dbConnection.get("SELECT * FROM bookings WHERE id = ?", [id]);
    },
    getReviews: async (carId) => {
      return await dbConnection.all("SELECT * FROM reviews WHERE car_id = ?", [carId]);
    },
    addReview: async (review) => {
      const dateStr = new Date().toISOString().split('T')[0];
      const res = await dbConnection.run(
        `INSERT INTO reviews (car_id, user_name, rating, comment, date) VALUES (?, ?, ?, ?, ?)`,
        [review.car_id, review.user_name, review.rating, review.comment, dateStr]
      );
      return { ...review, id: res.lastID, date: dateStr };
    }
  };
} catch (e) {
  console.warn("SQLite failed to load or initialize. Falling back to robust JSON DB fallback. Error:", e.message);
  activeDb = new JSONDatabase();
  activeDb.mode = "json_fallback";
}

export default activeDb;
