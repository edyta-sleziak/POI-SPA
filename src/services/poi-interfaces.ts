export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  signupDate: string;
  lastLoginDate: string;
  _id: string;
}

export interface Island {
  name: string;
  description?: string;
  addedBy?: User;
  modifiedBy?: User;
  longitude?: string;
  latitude?: string;
  category?: Category;
  createdDate?: string;
  lastModifiedDate?: string;
  _id?: string;
}

export interface RawIsland {
  name: string;
  description?: string;
  addedBy?: string;
  modifiedBy?: string;
  longitude: string;
  latitude: string;
  category: string;
  createdDate?: string;
  lastModifiedDate?: string;
  _id?: string;
}

export interface Category {
  name: string;
  _id: string;
}

