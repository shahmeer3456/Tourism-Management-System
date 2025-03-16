# Tourism Management System

A comprehensive web-based Tourism Management System that helps manage travel destinations, bookings, user profiles, and reviews. This system provides both user and admin interfaces for efficient tourism service management.

## 🌟 Features

### For Users
- **User Registration & Authentication**
  - Secure signup and login system
  - Personal profile management
  - Password encryption for security

- **Destination Browsing**
  - View detailed information about tourist destinations
  - High-quality images and descriptions
  - Search and filter destinations
  - Interactive trip visualization

- **Booking Management**
  - Easy booking process
  - View booking history
  - Edit or cancel bookings
  - Secure payment integration

- **Review System**
  - Write and submit reviews
  - Rate destinations
  - View other users' reviews
  - Edit/delete own reviews

### For Administrators
- **Destination Management**
  - Add new destinations
  - Edit existing destination details
  - Remove outdated destinations
  - Manage destination images

- **Booking Overview**
  - View all bookings
  - Track booking status
  - Generate booking reports
  - Manage cancellations

- **User Management**
  - View user profiles
  - Manage user accounts
  - Handle user permissions

## 🛠️ Technology Stack

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap for responsive design

- **Backend:**
  - Node.js
  - Express.js
  - MySQL Database

- **Security:**
  - bcrypt for password hashing
  - JWT for authentication
  - CORS enabled

- **Additional Libraries:**
  - Google Maps API for location services
  - Stripe for payment processing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## 🚀 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shahmeer3456/Tourism-Management-System.git
   cd Tourism-Management-System
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database
   - Configure database connection in server.js

4. **Environment Variables**
   Create a .env file with the following:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
Tourism-Management-System/
├── server.js              # Main server file
├── package.json          # Project dependencies
├── public/               # Static files
├── pages/               # HTML pages
├── plugins/             # External plugins
└── docs/                # Documentation
```

## 🔒 Security Features

- Password Hashing
- JWT Authentication
- Input Validation
- XSS Protection
- CORS Configuration
- Secure Payment Processing

## 💡 Usage

1. **User Interface**
   - Navigate to `http://localhost:3000`
   - Register a new account or login
   - Browse destinations and make bookings
   - Manage your profile and bookings

2. **Admin Interface**
   - Access admin panel through `/adminhomepage.html`
   - Manage destinations, bookings, and users
   - View system analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- **Shahmeer** - *Initial work* - [shahmeer3456](https://github.com/shahmeer3456)

## 📞 Support

For support, email [hussainshahmeer87@gmail.com] or create an issue in the repository.

## 🙏 Acknowledgments

- Thanks to all contributors who helped in building this system
- Special thanks to the open-source community for the tools and libraries used 
