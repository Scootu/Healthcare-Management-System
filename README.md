# 🏥 Healthcare Management System (SaaS)

A **Healthcare Management System** designed as a **SaaS (Software as a Service)** platform to **digitalize healthcare operations** in Algeria.  
This project is developed as an **academic graduation project** by a team of three developers using a **modular architecture** integrating **Web, Mobile, and Backend** technologies.

---

## 🚀 Project Overview

The system aims to centralize and digitalize patient data, prescriptions, appointments, and lab records across **hospitals and clinics**.  
It enables seamless interaction between **doctors, patients, pharmacies, laboratories, and hospital administrators**.

The solution is built to support **multi-hospital deployment**, **role-based access**, and **secure communication** between all actors.

---

## 👨‍💻 Team Composition

| Role | Stack | Responsibilities |
|------|--------|------------------|
| 🧠 Backend Developer | **ASP.NET Core + SQL Server** | API development, business logic, data models, and security |
| 💻 Web Frontend Developer | **ReactJS + TypeScript** | Web app for hospitals and administrative staff |
| 📱 Mobile Developer | **Flutter** | Mobile app for doctors and patients |

---

## 🧩 Core Features

### 👥 User & Role Management
- Authentication & authorization (JWT / Role-based)
- Admins, Doctors, Patients, Pharmacists, Lab Technicians

### 📅 Appointment & Consultation
- Schedule and manage appointments
- View consultation history
- Doctor availability and patient reminders

### 💊 Prescription & Pharmacy
- Digital prescriptions linked to doctors and patients
- Pharmacy access to prescription data
- Automatic inventory and stock updates

### 🧪 Laboratory & Medical Records
- Upload and view lab results (PDFs, images)
- Integration for Radiology (Scans, X-rays)
- Medical history centralized per patient

### 🏥 Hospital Administration
- Manage departments, staff, and resources
- Monitor stock (medicines, materials, devices)
- Generate reports and analytics dashboards

---

## 🧱 Modular Architecture (MVP)

The platform follows a **Modular MVP Architecture**, ensuring scalability and clean separation of responsibilities:



┌──────────────────────────────────────────────────────────┐
│ Frontend (Web) │ → React + TypeScript (Admin / Staff UI)
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Mobile (Flutter) │ → Patient & Doctor App
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Backend API │ → ASP.NET Core REST API + Identity
│ Database Layer │ → SQL Server (Centralized Cloud DB)
└──────────────────────────────────────────────────────────┘

Each module communicates through RESTful APIs secured by **JWT tokens**, and all hospital data is stored in a **central SQL Server database** hosted on the cloud (or local network for academic deployment).

---

## 🧠 UML Overview

The UML Class Diagram models the main entities of the system:

- `User`, `Doctor`, `Patient`, `Admin`
- `Appointment`, `Prescription`, `LabResult`, `Medication`
- `Hospital`, `Department`, `InventoryItem`

A PlantUML version is available in the documentation to easily generate visual diagrams using [PlantText](https://www.planttext.com/).

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | ASP.NET Core 8, Entity Framework, SQL Server |
| **Frontend (Web)** | ReactJS, TypeScript, Axios, TailwindCSS |
| **Mobile** | Flutter, Provider/Bloc, REST API integration |
| **Authentication** | ASP.NET Identity + JWT |
| **Database** | Microsoft SQL Server (Cloud / Local) |
| **Architecture** | Modular MVP + REST API Design |

---

## 🧪 Future Improvements

- Cloud deployment (Azure / AWS)
- Role-based dashboards with analytics
- AI module for predictive diagnosis support
- Secure messaging between doctors and patients
- EHR (Electronic Health Record) interoperability

---

## 🧾 Documentation

Detailed documentation is included in the `/docs` folder:
- **System Architecture & Flow Overview**
- **UML Class Diagram (PlantUML)**
- **API Design Structure**
- **Frontend & Backend Module Descriptions**

---

## 🧑‍🎓 Authors

| Name | Role | Technology |
|------|------|-------------|
| Anes Hamdaoui | Backend Developer | ASP.NET Core |
| [Teammate 2] | Frontend Developer | React + TypeScript |
| [Teammate 3] | Mobile Developer | Flutter |

---

## 📜 License

This project is developed for **academic and research purposes**.  
All rights reserved © 2025 — Healthcare Management System Team.

---

## 🖼️ Preview

Coming soon — screenshots and UI mockups of the system will be added here.
