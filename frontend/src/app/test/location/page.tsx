'use client';

import { useState, useEffect } from 'react';
import { locationApi } from '@/lib/api/location';
import { storeApi, Store } from '@/lib/api/store';

interface Location {
  id: number;
  businessId: number;
  name: string;
  address: string;
  contactNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LocationFormData {
  name: string;
  address: string;
  contactNumber: string;
}

export default function TestLocationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(1); // Default to store 1
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    contactNumber: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStores();
    if (selectedStoreId) {
      loadLocations(selectedStoreId);
    }
  }, [selectedStoreId]);

  const loadStores = async () => {
    try {
      const response = await storeApi.getStores();
      if (response.success && Array.isArray(response.data)) {
        setStores(response.data);
      } else {
        setError('Invalid store data format');
      }
    } catch (err) {
      console.error('Error loading stores:', err);
      setError('Failed to load stores');
    }
  };

  const loadLocations = async (storeId: number) => {
    setIsLoading(true);
    try {
      const data = await locationApi.getLocations(storeId);
      setLocations(data);
      setError('');
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!selectedStoreId) {
      setError('Please select a store first');
      setIsLoading(false);
      return;
    }

    try {
      const location = await locationApi.createLocation(selectedStoreId, formData);
      setSuccess(`Location "${location.name}" created successfully!`);
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
      });
      loadLocations(selectedStoreId);
    } catch (err: any) {
      console.error('Error creating location:', err);
      setError(err.response?.data?.errors || 'Failed to create location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStoreId(Number(e.target.value));
  };

  const handleRefresh = () => {
    if (selectedStoreId) {
      loadLocations(selectedStoreId);
    }
  };

  const selectedStore = stores.find(s => s.id === selectedStoreId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Location Management</h1>

      {/* Store Selection */}
      <div className="mb-4">
        <label className="block mb-1">Select Store</label>
        <div className="flex gap-2">
          <select
            value={selectedStoreId}
            onChange={handleStoreChange}
            className="flex-1 p-2 border rounded"
          >
            {stores.length > 0 ? (
              stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} (ID: {store.id})
                </option>
              ))
            ) : (
              <option value="">Loading stores...</option>
            )}
          </select>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Create Location Form */}
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create New Location</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Location Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Location'}
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

      {/* Locations List */}
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Locations for {selectedStore?.name || 'Loading...'}
          </h2>
          <span className="text-sm text-gray-500">
            Total: {locations.length} location(s)
          </span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading locations...</div>
        ) : (
          <div className="space-y-4">
            {locations.map(location => (
              <div key={location.id} className="p-4 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    location.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {location.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600">ID: {location.id}</p>
                <p className="text-gray-600">Address: {location.address}</p>
                <p className="text-gray-600">Contact: {location.contactNumber}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(location.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No locations found for this store
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
