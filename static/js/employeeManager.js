

class EmployeeManager {
    constructor() {
        this.employees = [...window.mockEmployeeList];
        this.nextId = Math.max(...this.employees.map(emp => emp.id)) + 1;
    }

    /**
     * Get all employees
     * @returns {Array} - Array of employees
     */
    getAllEmployees() {
        return [...this.employees];
    }

    /**
     * Get employee by ID
     * @param {number} id - Employee ID
     * @returns {Object|null} - Employee object or null if not found
     */
    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === parseInt(id)) || null;
    }

    /**
     * Add new employee
     * @param {Object} employeeData - Employee data
     * @returns {Object} - Added employee
     */
    addEmployee(employeeData) {
        const newEmployee = {
            id: this.nextId++,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            department: employeeData.department,
            role: employeeData.role
        };

        this.employees.push(newEmployee);
        return newEmployee;
    }

    /**
     * Update employee
     * @param {number} id - Employee ID
     * @param {Object} employeeData - Updated employee data
     * @returns {Object|null} - Updated employee or null if not found
     */
    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === parseInt(id));
        
        if (index === -1) {
            return null;
        }

        this.employees[index] = {
            ...this.employees[index],
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            department: employeeData.department,
            role: employeeData.role
        };

        return this.employees[index];
    }

    /**
     * Delete employee
     * @param {number} id - Employee ID
     * @returns {boolean} - True if deleted, false if not found
     */
    deleteEmployee(id) {
        const index = this.employees.findIndex(emp => emp.id === parseInt(id));
        
        if (index === -1) {
            return false;
        }

        this.employees.splice(index, 1);
        return true;
    }

    /**
     * Validate employee data
     * @param {Object} employeeData - Employee data to validate
     * @returns {Object} - Validation result with errors
     */
    validateEmployee(employeeData) {
        const errors = {};

        // Validate first name
        if (!Utils.validateRequired(employeeData.firstName)) {
            errors.firstName = 'First name is required';
        }

        // Validate last name
        if (!Utils.validateRequired(employeeData.lastName)) {
            errors.lastName = 'Last name is required';
        }

        // Validate email
        if (!Utils.validateRequired(employeeData.email)) {
            errors.email = 'Email is required';
        } else if (!Utils.validateEmail(employeeData.email)) {
            errors.email = 'Please enter a valid email address';
        } else if (this.isEmailTaken(employeeData.email, employeeData.id)) {
            errors.email = 'This email is already taken';
        }

        // Validate department
        if (!Utils.validateRequired(employeeData.department)) {
            errors.department = 'Department is required';
        }

        // Validate role
        if (!Utils.validateRequired(employeeData.role)) {
            errors.role = 'Role is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * Check if email is already taken
     * @param {string} email - Email to check
     * @param {number} excludeId - ID to exclude from check (for updates)
     * @returns {boolean} - True if email is taken
     */
    isEmailTaken(email, excludeId = null) {
        return this.employees.some(emp => 
            emp.email.toLowerCase() === email.toLowerCase() && 
            emp.id !== excludeId
        );
    }

    /**
     * Search employees
     * @param {string} searchTerm - Search term
     * @returns {Array} - Filtered employees
     */
    searchEmployees(searchTerm) {
        if (!searchTerm) return this.employees;
        
        return Utils.searchArray(
            this.employees, 
            searchTerm, 
            ['firstName', 'lastName', 'email']
        );
    }

    /**
     * Filter employees
     * @param {Object} filters - Filter criteria
     * @returns {Array} - Filtered employees
     */
    filterEmployees(filters) {
        return Utils.filterArray(this.employees, filters);
    }

    /**
     * Sort employees
     * @param {Array} employees - Employees to sort
     * @param {string} sortBy - Field to sort by
     * @param {string} sortDirection - Sort direction ('asc' or 'desc')
     * @returns {Array} - Sorted employees
     */
    sortEmployees(employees, sortBy, sortDirection = 'asc') {
        if (!sortBy) return employees;
        
        return Utils.sortArray(employees, sortBy, sortDirection);
    }

    /**
     * Get paginated employees
     * @param {Array} employees - Employees to paginate
     * @param {number} page - Current page
     * @param {number} pageSize - Items per page
     * @returns {Object} - Paginated result
     */
    paginateEmployees(employees, page, pageSize) {
        return Utils.paginate(employees, page, pageSize);
    }

    /**
     * Get filtered and sorted employees
     * @param {Object} options - Options object
     * @returns {Array} - Processed employees
     */
    getProcessedEmployees(options = {}) {
        let employees = [...this.employees];

        // Apply search
        if (options.searchTerm) {
            employees = this.searchEmployees(options.searchTerm);
        }

        // Apply filters
        if (options.filters) {
            employees = Utils.filterArray(employees, options.filters);
        }

        // Apply sorting
        if (options.sortBy) {
            employees = this.sortEmployees(employees, options.sortBy, options.sortDirection);
        }

        return employees;
    }

    /**
     * Get employee statistics
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        const departments = {};
        const roles = {};

        this.employees.forEach(emp => {
            departments[emp.department] = (departments[emp.department] || 0) + 1;
            roles[emp.role] = (roles[emp.role] || 0) + 1;
        });

        return {
            totalEmployees: this.employees.length,
            departments: departments,
            roles: roles
        };
    }
}