import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Employee } from '../types/Employee';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      onDelete(employee.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-600">ID: {employee.id}</p>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Email: </span>
            <span className="text-sm text-gray-600">{employee.email}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Department: </span>
            <span className="text-sm text-gray-600">{employee.department}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Role: </span>
            <span className="text-sm text-gray-600">{employee.role}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;