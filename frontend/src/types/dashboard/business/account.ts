// types/account.ts
export interface AccountData {
    full_name: string;
    email: string;
    phone_number: string;
  }
  
  export interface AccountUpdateData {
    full_name?: string;
    phone_number?: string;
    current_password?: string;
    new_password?: string;
  }