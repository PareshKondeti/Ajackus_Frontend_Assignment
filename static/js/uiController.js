/**
 * UI Controller
 * Handles all UI interactions and DOM manipulation
 */

class UIController {
    constructor(employeeManager) {
        this.employeeManager = employeeManager;
        this.currentPage = 1;
        this.pageSize = 10;
        this.currentSort = { field: '', direction: 'asc' };
        this.currentFilters = {};
        this.currentSearch = '';
        this.editingEmployeeId = null;

        this.initializeEventListeners();
        this.renderEmployees();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', 
            Utils.debounce((e) => this.handleSearch(e.target.value), 300)
        );

        // Sort functionality
        const sortSelect = document.getElementById('sortBy');
        sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));

        // Page size functionality
        const showSelect = document.getElementById('showEntries');
        showSelect.addEventListener('change', (e) => this.handlePageSizeChange(e.target.value));

        // Filter functionality
        const filterBtn = document.getElementById('filterBtn');
        filterBtn.addEventListener('click', () => this.toggleFilterPanel());

        const applyFilterBtn = document.getElementById('applyFilterBtn');
        applyFilterBtn.addEventListener('click', () => this.applyFilters());

        const resetFilterBtn = document.getElementById('resetFilterBtn');
        resetFilterBtn.addEventListener('click', () => this.resetFilters());

        // Modal functionality
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        addEmployeeBtn.addEventListener('click', () => this.showAddEmployeeModal());

        const closeModal = document.getElementById('closeModal');
        closeModal.addEventListener('click', () => this.hideModal());

        const cancelBtn = document.getElementById('cancelBtn');
        cancelBtn.addEventListener('click', () => this.hideModal());

        // Form submission
        const employeeForm = document.getElementById('employeeForm');
        employeeForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Modal backdrop click
        const modal = document.getElementById('employeeModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });

        // Close filter panel when clicking outside
        document.addEventListener('click', (e) => {
            const filterPanel = document.getElementById('filterPanel');
            const filterBtn = document.getElementById('filterBtn');
            
            if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
                filterPanel.classList.remove('active');
            }
        });

        // Pagination
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        nextPageBtn.addEventListener('click', () => this.goToNextPage());

        // Form field change listeners for real-time validation
        const formFields = ['firstName', 'lastName', 'email', 'department', 'role'];
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('input', () => Utils.clearError(fieldId));
        });
    }

    /**
     * Handle search functionality
     * @param {string} searchTerm - Search term
     */
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm;
        this.currentPage = 1; // Reset to first page
        this.renderEmployees();
    }

    /**
     * Handle sort functionality
     * @param {string} sortField - Field to sort by
     */
    handleSort(sortField) {
        if (!sortField) {
            this.currentSort = { field: '', direction: 'asc' };
        } else if (this.currentSort.field === sortField) {
            // Toggle direction if same field
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, start with ascending
            this.currentSort = { field: sortField, direction: 'asc' };
        }
        
        this.currentPage = 1; // Reset to first page
        this.renderEmployees();
    }

    /**
     * Handle page size change
     * @param {string} pageSize - New page size
     */
    handlePageSizeChange(pageSize) {
        this.pageSize = parseInt(pageSize);
        this.currentPage = 1; // Reset to first page
        this.renderEmployees();
    }

    /**
     * Toggle filter panel
     */
    toggleFilterPanel() {
        const filterPanel = document.getElementById('filterPanel');
        filterPanel.classList.toggle('active');
    }

    /**
     * Apply filters
     */
    applyFilters() {
        const filters = {};
        
        const firstNameFilter = document.getElementById('filterFirstName').value;
        const departmentFilter = document.getElementById('filterDepartment').value;
        const roleFilter = document.getElementById('filterRole').value;
        
        if (firstNameFilter) filters.firstName = firstNameFilter;
        if (departmentFilter) filters.department = departmentFilter;
        if (roleFilter) filters.role = roleFilter;
        
        this.currentFilters = filters;
        this.currentPage = 1; // Reset to first page
        this.renderEmployees();
        
        // Close filter panel
        document.getElementById('filterPanel').classList.remove('active');
    }

    /**
     * Reset filters
     */
    resetFilters() {
        document.getElementById('filterFirstName').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('filterRole').value = '';
        
        this.currentFilters = {};
        this.currentPage = 1; // Reset to first page
        this.renderEmployees();
    }

    /**
     * Show add employee modal
     */
    showAddEmployeeModal() {
        this.editingEmployeeId = null;
        document.getElementById('modalTitle').textContent = 'Add Employee';
        document.getElementById('employeeForm').reset();
        Utils.clearAllErrors();
        document.getElementById('employeeModal').classList.add('active');
    }

    /**
     * Show edit employee modal
     * @param {number} employeeId - Employee ID to edit
     */
    showEditEmployeeModal(employeeId) {
        const employee = this.employeeManager.getEmployeeById(employeeId);
        if (!employee) {
            Utils.showErrorMessage('Employee not found');
            return;
        }

        this.editingEmployeeId = employeeId;
        document.getElementById('modalTitle').textContent = 'Edit Employee';
        
        // Populate form with employee data
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('role').value = employee.role;
        
        Utils.clearAllErrors();
        document.getElementById('employeeModal').classList.add('active');
    }

    /**
     * Hide modal
     */
    hideModal() {
        document.getElementById('employeeModal').classList.remove('active');
        this.editingEmployeeId = null;
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const employeeData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            department: formData.get('department'),
            role: formData.get('role')
        };

        // Validate data
        const validation = this.employeeManager.validateEmployee({
            ...employeeData,
            id: this.editingEmployeeId
        });

        if (!validation.isValid) {
            // Show validation errors
            Object.keys(validation.errors).forEach(field => {
                Utils.showError(field, validation.errors[field]);
            });
            return;
        }

        // Save employee
        try {
            if (this.editingEmployeeId) {
                // Update existing employee
                this.employeeManager.updateEmployee(this.editingEmployeeId, employeeData);
                Utils.showSuccess('Employee updated successfully');
            } else {
                // Add new employee
                this.employeeManager.addEmployee(employeeData);
                Utils.showSuccess('Employee added successfully');
            }

            this.hideModal();
            this.renderEmployees();
        } catch (error) {
            Utils.showErrorMessage('An error occurred while saving the employee');
        }
    }

    /**
     * Handle employee deletion
     * @param {number} employeeId - Employee ID to delete
     */
    handleEmployeeDelete(employeeId) {
        const employee = this.employeeManager.getEmployeeById(employeeId);
        if (!employee) {
            Utils.showErrorMessage('Employee not found');
            return;
        }

        if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            if (this.employeeManager.deleteEmployee(employeeId)) {
                Utils.showSuccess('Employee deleted successfully');
                this.renderEmployees();
            } else {
                Utils.showErrorMessage('Failed to delete employee');
            }
        }
    }

    /**
     * Go to previous page
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderEmployees();
        }
    }

    /**
     * Go to next page
     */
    goToNextPage() {
        this.currentPage++;
        this.renderEmployees();
    }

    /**
     * Go to specific page
     * @param {number} page - Page number
     */
    goToPage(page) {
        this.currentPage = page;
        this.renderEmployees();
    }

    /**
     * Render employees with current filters, search, and pagination
     */
    renderEmployees() {
        // Get processed employees
        const processedEmployees = this.employeeManager.getProcessedEmployees({
            searchTerm: this.currentSearch,
            filters: this.currentFilters,
            sortBy: this.currentSort.field,
            sortDirection: this.currentSort.direction
        });

        // Paginate employees
        const paginatedResult = this.employeeManager.paginateEmployees(
            processedEmployees,
            this.currentPage,
            this.pageSize
        );

        // Render employee grid
        this.renderEmployeeGrid(paginatedResult.data);

        // Update pagination
        this.updatePagination(paginatedResult.pagination);
    }

    /**
     * Render employee grid
     * @param {Array} employees - Employees to render
     */
    renderEmployeeGrid(employees) {
        const grid = document.getElementById('employeeGrid');
        
        if (employees.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No employees found</h3>
                    <p>Try adjusting your search criteria or add a new employee.</p>
                    <button class="btn btn-primary" onclick="app.uiController.showAddEmployeeModal()">
                        Add Employee
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = employees.map(employee => Utils.formatEmployeeCard(employee)).join('');

        // Add event listeners to action buttons
        grid.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = parseInt(e.target.dataset.id);
                this.showEditEmployeeModal(employeeId);
            });
        });

        grid.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = parseInt(e.target.dataset.id);
                this.handleEmployeeDelete(employeeId);
            });
        });
    }

    /**
     * Update pagination controls
     * @param {Object} pagination - Pagination info
     */
    updatePagination(pagination) {
        // Update pagination info
        const infoElement = document.getElementById('paginationInfo');
        infoElement.textContent = `Showing ${pagination.startIndex} to ${pagination.endIndex} of ${pagination.totalItems} entries`;

        // Update page buttons
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        prevBtn.disabled = pagination.currentPage === 1;
        nextBtn.disabled = pagination.currentPage === pagination.totalPages;

        // Update page numbers
        this.renderPageNumbers(pagination);
    }

    /**
     * Render page numbers
     * @param {Object} pagination - Pagination info
     */
    renderPageNumbers(pagination) {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        pageNumbersContainer.innerHTML = '';

        if (pagination.totalPages <= 1) return;

        // Calculate page range to show
        const maxPagesToShow = 5;
        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            this.createPageButton(1, pagination.currentPage, pageNumbersContainer);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'page-ellipsis';
                pageNumbersContainer.appendChild(ellipsis);
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            this.createPageButton(i, pagination.currentPage, pageNumbersContainer);
        }

        // Add last page and ellipsis if needed
        if (endPage < pagination.totalPages) {
            if (endPage < pagination.totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'page-ellipsis';
                pageNumbersContainer.appendChild(ellipsis);
            }
            this.createPageButton(pagination.totalPages, pagination.currentPage, pageNumbersContainer);
        }
    }

    /**
     * Create page button
     * @param {number} pageNum - Page number
     * @param {number} currentPage - Current page
     * @param {HTMLElement} container - Container element
     */
    createPageButton(pageNum, currentPage, container) {
        const button = document.createElement('button');
        button.textContent = pageNum;
        button.className = `page-number ${pageNum === currentPage ? 'active' : ''}`;
        button.addEventListener('click', () => this.goToPage(pageNum));
        container.appendChild(button);
    }
}