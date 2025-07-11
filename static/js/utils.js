
const Utils = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email format
     */
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate required field
     * @param {string} value - Value to validate
     * @returns {boolean} - True if not empty
     */
    validateRequired: function(value) {
        return value && value.trim().length > 0;
    },

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Generate unique ID
     * @returns {number} - Unique ID
     */
    generateId: function() {
        return Date.now() + Math.random();
    },

    /**
     * Show error message for form field
     * @param {string} fieldId - Field ID
     * @param {string} message - Error message
     */
    showError: function(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    },

    /**
     * Clear error message for form field
     * @param {string} fieldId - Field ID
     */
    clearError: function(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    },

    /**
     * Clear all form errors
     */
    clearAllErrors: function() {
        const errorElements = document.querySelectorAll('.error-message');
        const fieldElements = document.querySelectorAll('.form-control.error');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        fieldElements.forEach(element => {
            element.classList.remove('error');
        });
    },

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess: function(message) {
        // Create and show success message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message success';
        messageDiv.textContent = message;
        
        // Insert at the top of main content
        const main = document.querySelector('.main .container');
        main.insertBefore(messageDiv, main.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage: function(message) {
        // Create and show error message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.textContent = message;
        
        // Insert at the top of main content
        const main = document.querySelector('.main .container');
        main.insertBefore(messageDiv, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    },

    /**
     * Format employee data for display
     * @param {Object} employee - Employee object
     * @returns {string} - Formatted HTML
     */
    formatEmployeeCard: function(employee) {
        return `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-header">
                    <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
                    <span class="employee-id">ID: ${employee.id}</span>
                </div>
                <div class="employee-details">
                    <p><strong>Email:</strong> ${employee.email}</p>
                    <p><strong>Department:</strong> ${employee.department}</p>
                    <p><strong>Role:</strong> ${employee.role}</p>
                </div>
                <div class="employee-actions">
                    <button class="btn btn-edit" data-id="${employee.id}">Edit</button>
                    <button class="btn btn-delete" data-id="${employee.id}">Delete</button>
                </div>
            </div>
        `;
    },

    /**
     * Sort array of objects by property
     * @param {Array} array - Array to sort
     * @param {string} property - Property to sort by
     * @param {string} direction - 'asc' or 'desc'
     * @returns {Array} - Sorted array
     */
    sortArray: function(array, property, direction = 'asc') {
        return array.sort((a, b) => {
            let valueA = a[property];
            let valueB = b[property];
            
            // Handle case-insensitive string sorting
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            if (direction === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
    },

    /**
     * Filter array of objects by multiple criteria
     * @param {Array} array - Array to filter
     * @param {Object} criteria - Filter criteria
     * @returns {Array} - Filtered array
     */
    filterArray: function(array, criteria) {
        return array.filter(item => {
            return Object.keys(criteria).every(key => {
                if (!criteria[key]) return true; // Skip empty criteria
                
                const itemValue = item[key];
                const criteriaValue = criteria[key];
                
                if (typeof itemValue === 'string') {
                    return itemValue.toLowerCase().includes(criteriaValue.toLowerCase());
                }
                
                return itemValue === criteriaValue;
            });
        });
    },

    /**
     * Search array of objects by text
     * @param {Array} array - Array to search
     * @param {string} searchText - Text to search for
     * @param {Array} searchFields - Fields to search in
     * @returns {Array} - Filtered array
     */
    searchArray: function(array, searchText, searchFields) {
        if (!searchText) return array;
        
        const searchLower = searchText.toLowerCase();
        
        return array.filter(item => {
            return searchFields.some(field => {
                const fieldValue = item[field];
                if (typeof fieldValue === 'string') {
                    return fieldValue.toLowerCase().includes(searchLower);
                }
                return false;
            });
        });
    },

    /**
     * Paginate array
     * @param {Array} array - Array to paginate
     * @param {number} page - Current page (1-based)
     * @param {number} pageSize - Items per page
     * @returns {Object} - Paginated result with data and pagination info
     */
    paginate: function(array, page, pageSize) {
        const total = array.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const data = array.slice(startIndex, endIndex);
        
        return {
            data: data,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalPages: totalPages,
                totalItems: total,
                startIndex: startIndex + 1,
                endIndex: Math.min(endIndex, total)
            }
        };
    }
};