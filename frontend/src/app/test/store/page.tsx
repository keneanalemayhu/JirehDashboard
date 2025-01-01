'use client';

import { useState, useEffect } from 'react';
import { storeApi, Store, StoreFormData } from '@/lib/api/store';

export default function TestStorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    contactNumber: '',
    registrationNumber: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await storeApi.getStores();
      setStores(data);
    } catch (err) {
      console.error('Error loading stores:', err);
      setError('Failed to load stores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const store = await storeApi.createStore(formData);
      setSuccess(`Store created successfully with ID: ${store.id}`);
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        registrationNumber: '',
      });
      loadStores();
    } catch (err: any) {
      console.error('Error creating store:', err);
      setError(err.response?.data?.errors || 'Failed to create store');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Store Management</h1>

      {/* Create Store Form */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Store</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="+251-XX-XXX-XXXX"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Store
          </button>
        </form>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>

      {/* Stores List */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Existing Stores</h2>
        <div className="space-y-4">
          {stores.map(store => (
            <div key={store.id} className="p-4 border rounded">
              <h3 className="font-bold">{store.name}</h3>
              <p>ID: {store.id}</p>
              <p>Address: {store.address}</p>
              <p>Contact: {store.contactNumber}</p>
              <p>Registration: {store.registrationNumber}</p>
            </div>
          ))}
          {stores.length === 0 && (
            <p className="text-gray-500">No stores found</p>
          )}
        </div>
      </div>
    </div>
  );
}
