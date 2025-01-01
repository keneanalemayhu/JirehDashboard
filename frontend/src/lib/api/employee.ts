import api from '../axios';
import { Employee, EmployeeFormData } from '@/types/dashboard/business/employee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export const employeeApi = {
  getEmployees: async (storeId: number): Promise<Employee[]> => {
    const response = await api.get<ApiResponse<Employee[]>>(`/api/store/${storeId}/employees/`);
    return response.data.data.map((employee: any) => ({
      id: employee.id,
      storeId: employee.store,
      locationId: employee.location,
      fullName: employee.full_name,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      hireDate: employee.hire_date,
      isActive: employee.is_active,
      salary: employee.salary,
      employmentStatus: employee.employment_status,
      createdAt: employee.created_at,
      updatedAt: employee.updated_at,
    }));
  },

  createEmployee: async (storeId: number, data: EmployeeFormData): Promise<Employee> => {
    // Clean up phone number - remove any formatting
    const cleanPhone = data.phone.replace(/[^\d+]/g, "");
    
    const response = await api.post<ApiResponse<any>>(`/api/store/${storeId}/employees/`, {
      store: storeId,
      location: data.locationId,
      full_name: data.fullName,
      position: data.position,
      phone: cleanPhone, // Send clean phone number
      email: data.email,
      hire_date: data.hireDate,
      is_active: data.isActive,
      salary: data.salary,
      employment_status: data.employmentStatus,
    });
    
    const employee = response.data.data;
    return {
      id: employee.id,
      storeId: employee.store,
      locationId: employee.location,
      fullName: employee.full_name,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      hireDate: employee.hire_date,
      isActive: employee.is_active,
      salary: employee.salary,
      employmentStatus: employee.employment_status,
      createdAt: employee.created_at,
      updatedAt: employee.updated_at,
    };
  },

  updateEmployee: async (storeId: number, employeeId: number, data: EmployeeFormData): Promise<Employee> => {
    // Clean up phone number - remove any formatting
    const cleanPhone = data.phone.replace(/[^\d+]/g, "");
    
    const response = await api.put<ApiResponse<any>>(`/api/store/${storeId}/employees/${employeeId}/`, {
      store: storeId,
      location: data.locationId,
      full_name: data.fullName,
      position: data.position,
      phone: cleanPhone, // Send clean phone number
      email: data.email,
      hire_date: data.hireDate,
      is_active: data.isActive,
      salary: data.salary,
      employment_status: data.employmentStatus,
    });
    
    const employee = response.data.data;
    return {
      id: employee.id,
      storeId: employee.store,
      locationId: employee.location,
      fullName: employee.full_name,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      hireDate: employee.hire_date,
      isActive: employee.is_active,
      salary: employee.salary,
      employmentStatus: employee.employment_status,
      createdAt: employee.created_at,
      updatedAt: employee.updated_at,
    };
  },

  deleteEmployee: async (storeId: number, employeeId: number): Promise<void> => {
    await api.delete(`/api/store/${storeId}/employees/${employeeId}/`);
  },
};
