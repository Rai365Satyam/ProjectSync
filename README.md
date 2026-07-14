# ⚡ ProjectSync

A full-stack task management and collaboration application built with the MERN stack (MongoDB, Express, React, Node.js). ProjectSync features a highly interactive, drag-and-drop Kanban board designed to streamline workflow and team assignments.

## ✨ Features

* **Interactive Kanban Board:** Fully functional 4-stage board (Requested, To Do, Ongoing, Completed) using `react-beautiful-dnd`.
* **Dynamic Status Updates:** Instantly shift task stages using a custom, color-coded status dropdown that physically moves cards across the board.
* **Smart Content Rendering:** Task content remains cleanly hidden in the "Requested" phase and automatically reveals itself once a task is pushed to the "To Do", "Ongoing", or "Completed" columns.
* **User Assignment:** Assign tasks to specific users with clear visual indicators on the task cards.
* **RESTful API Backend:** Robust Express/Node.js backend with Mongoose schemas and strict payload validation.
* **Real-Time Notifications:** Instant success and error feedback using `react-hot-toast`.

## 🛠️ Tech Stack

**Frontend:**
* React.js
* Tailwind CSS (for modern, responsive styling)
* React-Beautiful-DnD (for drag-and-drop physics)
* Axios (for API requests)
* Headless UI (for accessible modals)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* Joi (Data Validation)
* JSON Web Tokens (JWT Auth)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Rai365Satyam/ProjectSync.git](https://github.com/Rai365Satyam/ProjectSync.git)
   cd ProjectSync
2. **Setup the Backend:**
  ```cd backend
     npm install
3. **Setup the Frontend:**
  ```cd ../frontend
     npm install    
4. **Start the backened Server**
  ```cd ../backend
     npm run start
5.  **Start the frontend UI**(Start a new terminal)
  ```cd frontend
     npm start
     
============**Author**=============
**Satyam Rai**
**IIT BHU**