import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SubCategory from './SubCategory';
import { useSelector } from 'react-redux';
import Alert from '../../OtherComponents/Alert';
import { fetchCategories, updateCategory } from '../../../Utility/Category';

const UpdateCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryDetails, subCategories } = location.state || {};
  const auth=useSelector(store=>store.adminAuth)
  const [newCategoryName, setNewCategoryName] = useState(categoryDetails?.categoryName || '');
  const [newDescription, setNewDescription] = useState(categoryDetails?.categoryDescription || '');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState(categoryDetails?.parentCategoryId);
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(auth.adminJwt);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = {
        name: newCategoryName,
        description: newDescription,
        parentCategory: selectedParentCategoryId ? selectedParentCategoryId : null,
      };
      console.log("Payload:", payload);
        await updateCategory(categoryDetails.categoryId, payload, auth.adminJwt);
        navigate('/admin/category', {
          state: { alert: { message: 'Category updated successfully!', status: 'success' } },
        });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  

  return (
    <div className="p-14">
      {showAlert && (
          <Alert
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <h2 className="text-2xl font-semibold mb-7">Update Category: {newCategoryName}</h2>
      <div className="flex justify-end mt-10">
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Category Name</label>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">Parent Category</label>
        <select
          value={selectedParentCategoryId}
          onChange={(e) => setSelectedParentCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
        >
          <option value="">None</option>
          {categories
            .filter((category) => category.categoryId !== categoryDetails?.categoryId)
            .map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
        </select>
      </div>
      <SubCategory setShowAlert={setShowAlert} setAlert={setAlert} subCategories={subCategories} />
    </div>
  );
};

export default UpdateCategory;
