
window.app = {};


document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Directory Application Starting...');
    
    try {
 
        app.employeeManager = new EmployeeManager();
        console.log('Employee Manager initialized');
    
        app.uiController = new UIController(app.employeeManager);
        console.log('UI Controller initialized');
        

        const stats = app.employeeManager.getStatistics();
        console.log('Application Statistics:', stats);
        
        console.log('Employee Directory Application Ready!');
        
    } catch (error) {
        console.error('Error initializing application:', error);
        

        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error';
        errorDiv.innerHTML = `
            <h3>Application Error</h3>
            <p>There was an error initializing the Employee Directory application.</p>
            <p>Please refresh the page or contact support if the problem persists.</p>
        `;
        
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
});


window.addEventListener('error', function(event) {
    console.error('Application Error:', event.error);
    

    Utils.showErrorMessage('An unexpected error occurred. Please try again.');
});


window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    

    Utils.showErrorMessage('An unexpected error occurred. Please try again.');
});


window.Utils = Utils;


document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 'a') {
        event.preventDefault();
        app.uiController.showAddEmployeeModal();
    }
    

    if (event.altKey && event.key === 'f') {
        event.preventDefault();
        app.uiController.toggleFilterPanel();
    }
    
  
    if (event.key === 'Escape') {
        const modal = document.getElementById('employeeModal');
        const filterPanel = document.getElementById('filterPanel');
        
        if (modal.classList.contains('active')) {
            app.uiController.hideModal();
        } else if (filterPanel.classList.contains('active')) {
            filterPanel.classList.remove('active');
        }
    }
});

if (window.performance && window.performance.mark) {
    window.performance.mark('employee-directory-start');
    
    window.addEventListener('load', function() {
        window.performance.mark('employee-directory-end');
        window.performance.measure('employee-directory-load', 'employee-directory-start', 'employee-directory-end');
        
        const measure = window.performance.getEntriesByName('employee-directory-load')[0];
        console.log(`Employee Directory loaded in ${measure.duration.toFixed(2)}ms`);
    });
}


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}