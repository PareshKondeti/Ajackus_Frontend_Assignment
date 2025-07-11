# Employee Directory Web Interface

A responsive and interactive Employee Directory application built with vanilla HTML, CSS, JavaScript, and Freemarker templates. This application demonstrates modern front-end development principles and provides a complete employee management system.

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Search & Filter**: Real-time search by name/email with advanced filtering by department and role
- **Sorting**: Sort employees by first name or department in ascending/descending order
- **Pagination**: Configurable page sizes (10, 25, 50, 100) with intuitive navigation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Vanilla JavaScript**: No external frameworks, demonstrating pure JavaScript skills
- **Freemarker Templates**: Server-side templating for initial data rendering
- **Modular Architecture**: Clean separation of concerns with dedicated modules
- **Form Validation**: Comprehensive client-side validation with real-time feedback
- **Error Handling**: Graceful error handling and user-friendly messages
- **Accessibility**: Keyboard navigation and screen reader support

## 📁 Project Structure

```
employee-directory/
├── index.html                 
├── templates/
│   └── dashboard.ftlh       
├── static/
│   ├── css/
│   │   └── style.css         
│   └── js/
│       ├── data.js           
│       ├── utils.js          
│       ├── employeeManager.js 
│       ├── uiController.js   
│       └── app.js            
└── README.md                 
```
  
## 🛠️ Setup and Installation
1. 'npm install' - To install all the dependencies
2. 'npm run dev' - To run on local server



## 📱 Key Components

### 1. Employee Manager (`employeeManager.js`)
- Handles all CRUD operations
- Manages employee data validation
- Provides search, filter, and sort functionality
- Maintains data integrity

### 2. UI Controller (`uiController.js`)
- Manages all DOM interactions
- Handles form submissions and modal displays
- Implements pagination and filtering UI
- Provides real-time user feedback

### 3. Utilities (`utils.js`)
- Common helper functions
- Validation utilities
- Data processing functions
- Error handling utilities

### 4. Data Layer (`data.js`)
- Mock employee data
- Simulates backend API responses
- Provides sample data for development

## 🎯 Usage

### Adding an Employee
1. Click "Add Employee" button
2. Fill in all required fields
3. Validation occurs in real-time
4. Submit to add the employee

### Editing an Employee
1. Click "Edit" button on any employee card
2. Modify the information in the modal
3. Save changes to update the employee

### Deleting an Employee
1. Click "Delete" button on any employee card
2. Confirm deletion in the prompt
3. Employee is removed from the list

### Searching and Filtering
- Use the search bar to find employees by name or email
- Click "Filter" to open the filter panel
- Filter by first name, department, or role
- Use the sort dropdown to organize results

### Pagination
- Choose page size from the dropdown (10, 25, 50, 100)
- Navigate using Previous/Next buttons
- Click page numbers for direct navigation
