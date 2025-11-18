# ServiceHub (QuestX)

An interactive multi‑role service marketplace platform built as **College Project II**, featuring advanced security, role-based dashboards, booking flows, and payment integration.

---

## 🚀 Overview

**ServiceHub (QuestX)** is a full-stack service management system where **Users**, **Technicians**, and **Admins** each get their own dedicated dashboards and workflows. The platform enables smooth service booking, technician assignment, secure authentication, and basic eSewa (development) payment integration.

I(Bikram320) served as the **project leader**, handling the **entire backend**, **frontend integration**, and overall architectural decisions.

---

## 🌟 Key Features

### 🔐 **Security (JWT + Role-Based Access)**

* Strong JWT authentication & refresh system
* Secure role-based route protection (User, Technician, Admin)
* Spring Security with custom filters
* Enforced CORS & BCrypt password hashing

### 👤 **Multi-Role System**

#### **User**

* Browse services
* Book service
* Track requests
* Make eSewa development payments
* Review technicians

#### **Technician**

* Manage assigned bookings
* Update service status
* View dashboard analytics

#### **Admin**

* Manage users, technicians & roles
* Add/edit/delete services
* View system analytics & bookings

---

## 💳 Payment Integration

### **eSewa Payment (Development Mode)**

* Mock payment verification
* Client-side redirect workflow
* Integrates directly inside booking flow

---

## 🏗️ Tech Stack

### **Frontend**

* React.js
* React Router
* Axios

### **Backend**

* Spring Boot
* Spring Security + JWT
* MySql
* Redis (for OTP)

### **Other Tools**

* Git & GitHub
* Postman
* eSewa Developer API

---

## 📁 Project Structure

```
servicehub/
 ├── backend/
 │    ├── src/main/java/... (controllers, services, filters, JWT utils)
 │    ├── src/main/resources/application.properties
 │    └── pom.xml
 ├── frontend/
 │    ├── src/components
 │    ├── src/pages (user, admin, technician dashboards)
 │    ├── src/context/auth
 │    └── package.json
 └── README.md
```

---

## ⚙️ Setup Instructions

### **Backend Setup**

```bash
git clone https://github.com/bikram320/ServiceHub
cd backend
mvn spring-boot:run
```


### **Frontend Setup**

```bash
cd frontend
yarn install
yarn dev
```

---


## 🛡️ Security Implementation

* JWT Access & Refresh tokens
* Custom filters for authentication/authorization
* Role-based endpoint restrictions
* Exception handling for unauthorized access

---


## 👨‍💻 Project Leadership

I (Bikram320) handled:

* Entire **backend architecture**
* **Frontend–backend API integration**
* **Security (JWT, Spring Security)**
* **Role management system**
* **Payment integration (eSewa)**
* Overall **project planning & execution**

---

## 🙌 Acknowledgements

Thanks to my contributors who worked and inspired this project.

# 🤝 Team members
* Bikram Bk (bikram320)
* Kripsan Thakuri (Kripsan7)
* Pragya Gurung (PragyaGurung)

# Some Images
* Home page
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/7e2a0487-166d-4b44-9d7d-d5338ddd93ca" />

* User page
<img width="1917" height="913" alt="image" src="https://github.com/user-attachments/assets/40b40536-9176-48d1-acac-c66e4ef0ae19" />

* Technician page
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/c580cf8b-03ac-4406-9456-8d54682ecf68" />

* Admin page
<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/93d95d54-b300-4b7d-958f-d824aafc1793" />




