# Gimmy Restaurant – RESTAURANT-GIMMY

A full-stack restaurant management web application built with Node.js, Express, MySQL (Sequelize), and vanilla JavaScript.  
This app allows users to browse the menu, make reservations, place orders, and for admins to manage menu items, reservations, and orders.

---

## Features

### User
- **Authentication:** Login and signup flow.
- **Menu Browsing:** View available/unavailable items.
- **Cart & Orders:** Add items to cart and place orders linked to reservations.
- **Reservations:** Book tables and view upcoming reservations.

### Admin
- **Menu Management:** Add, edit, and delete items.
- **Reservations Dashboard:** Monitor bookings in real time.
- **Orders Dashboard:** Update order status (pending, accepted, ready, cancelled).
- **Occupancy View:** Visualize table usage for the next 12 hours.

### General
- **Responsive UI:** Works seamlessly across devices.
- **Modern Design:** Clean, simple, and intuitive.

---

## Screenshots

### Login and Register Pages
<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/e754070f-8ab9-4e3f-8146-d4afb0147006" />  
<img width="1920" height="1080" alt="Register Page" src="https://github.com/user-attachments/assets/3c8926d5-ff76-49af-833f-a614701e0ce4" />  

### User Dashboard
<img width="1920" height="1080" alt="User Dashboard" src="https://github.com/user-attachments/assets/098ab620-8787-4bd1-ab81-aaf410e0fff9" />  

### Admin Dashboard
<img width="1920" height="1080" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/40b19c01-42ff-4446-a72c-b0dd8847cde4" />  

### Database
<img width="1920" height="1080" alt="Database" src="https://github.com/user-attachments/assets/0108836a-f776-4687-8b59-5dfc603d0e35" />  

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database

Update `config/db.js` with your MySQL credentials.

### 3. Run the Server
```bash
node server.js
```

### 4. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### For Users

- Sign up or log in.
- Browse menu and add items to cart.
- Reserve tables and place orders.

### For Admins

- Log in with admin credentials (`admin@gimmy.com` / `admin123`).
- Manage menu items (add, update, delete).
- Monitor and update reservations.
- Track orders and update statuses.
- View occupancy forecasts.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL with Sequelize ORM
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Authentication:** Session/Token based

---

## Project Structure

```
restaurant-gimmy/
│── server.js             
│── config/
│   └── db.js              
│── models/
│   ├── User.js
│   ├── Table.js
│   ├── Reservation.js
│   ├── MenuItem.js
│   └── Order.js
│── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── reservationController.js
│   └── orderController.js
│── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── reservationRoutes.js
│   └── orderRoutes.js
│── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│── package.json
```

---

