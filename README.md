# Garage Management System Portal

A modern **Garage Management System Portal** developed using **Node.js** for efficient vehicle service management. The portal is structured around three distinct modules to cater to different user roles:

- **User Portal**
- **Mechanic Portal**
- **Admin Portal**

Each module ensures a seamless experience for managing garage services, vehicle bookings, and service orders.

---

## Features

### 🚗 **User Portal**
The **User Portal** enables customers to:
- **Book vehicle services** such as repairs, maintenance, and more.
- **View service history**, including details of past services.
- **Update personal profiles** and contact information.

### 🧰 **Mechanic Portal**
The **Mechanic Portal** is designed for mechanics to:
- **View assigned service requests** with detailed instructions.
- **Update service status** (ongoing, completed, etc.).
- **Manage daily schedules** and tasks effectively.

### 🔧 **Admin Portal**
The **Admin Portal** offers advanced tools for administrators to:
- **Role-based access control** for managing user permissions.
- **Track real-time updates** of service orders and progress.
- **Manage orders**, including creating, updating, deleting, and assigning them to mechanics.

---

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML, CSS, JavaScript (for admin and mechanic portals)
- **Database**: MongoDB for storing user, order, and service data
- **Authentication**: JWT (JSON Web Tokens) for secure session management
- **Location Services**: Integrated geolocation features for booking services based on the user's location

---

## APIs

This project exposes a set of **RESTful CRUD APIs** to manage orders, users, and services:
- **Create**: Allows users to create new service orders.
- **Read**: Retrieves details of existing orders.
- **Update**: Updates service order statuses (assigned, completed, etc.).
- **Delete**: Admins can delete unnecessary or canceled orders.

---

## How to Run the Project

### 1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/garage-management-system.git
   cd garage-management-system
   ```

### 2. Install dependencies:

   ```bash
   npm install
   ```

### 3. Set up MongoDB:

   - Create a MongoDB database or use a service like MongoDB Atlas.
   - Update the **MongoDB URI** in your `.env` file:
   
     ```
     MONGO_URI=your_mongodb_connection_string
     ```

### 4. Set up JWT authentication:

   - Add a secret key to your `.env` file for JWT authentication:

     ```
     JWT_SECRET=your_jwt_secret_key
     ```

### 5. Run the application:

   ```bash
   npm start
   ```

   This will launch the app on [http://localhost:3000](http://localhost:3000).

---

## Live Demo

Explore the live version of the project:

[**Live Demo**](https://ragilly-technology-garage-management.onrender.com/)

---

## Contributing

We welcome contributions from the community. Here’s how you can help:

1. **Fork the repository** and clone it to your local machine.
2. **Create a new branch** for your feature or fix:
   
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
3. **Commit your changes** with a descriptive message:

   ```bash
   git commit -m "Add feature/bugfix description"
   ```

4. **Push to your forked repository**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request** to the `main` branch of the original repository.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## Author

Developed by [Swapnil Dubey](https://github.com/swapnildubey29). Feel free to reach out for suggestions or questions!

---

## Future Enhancements

- **Mobile App Integration**: Develop a mobile app for better user experience.
- **SMS/Email Notifications**: Notify users and mechanics about service updates.
- **Advanced Reporting**: Add analytics and reporting tools for order and mechanic performance.

```
