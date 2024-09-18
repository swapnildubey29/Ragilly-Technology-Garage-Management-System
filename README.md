# Garage Management System Portal

This project is a **Garage Management System Portal** built using **Node.js**. It consists of three main modules:

- **User Portal**
- **Mechanic Portal**
- **Admin Portal**

Each portal is designed to cater to specific user roles, ensuring a smooth workflow for managing garage services, bookings, and orders.

## Features

### 1. User Portal
The **User Portal** allows customers to:
- Book services for their vehicles.
- View the history of services availed.
- Manage their profiles, including updating contact details and preferences.

### 2. Mechanic Portal
The **Mechanic Portal** is designed for mechanics and includes the following features:
- View service requests assigned to them.
- Update the status of ongoing and completed services.
- Manage daily schedules and tasks efficiently.

### 3. Admin Portal
The **Admin Portal** is a comprehensive management tool for administrators, offering:
- Role-based access control to ensure only authorized personnel can view or edit specific data.
- Real-time updates on service orders, allowing admins to track progress.
- Full order management, including creating, updating, and deleting orders, as well as assigning them to mechanics.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Frontend**: HTML, CSS, JavaScript (for admin and mechanic portals)
- **Database**: MongoDB for order, user, and service data
- **Authentication**: JWT (JSON Web Tokens) for secure session management
- **Location Services**: Integrated location-specific functionalities for users to book services based on their location.

## APIs
This project includes a set of **CRUD APIs** to manage orders, users, and service-related data:
- **Create**: Allows users to create a new order.
- **Read**: Enables the system to retrieve details of existing orders.
- **Update**: Permits users, mechanics, or admins to update order statuses.
- **Delete**: Allows admins to remove orders that are no longer needed.

## How to Run the Project

 Clone the repository:

   ```bash
   git clone https://github.com/your-username/garage-management-system.git

   
Live Demo
You can explore the live version of the project here: https://ragilly-technology-garage-management.onrender.com/
