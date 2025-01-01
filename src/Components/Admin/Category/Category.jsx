import React, { useState, useEffect } from 'react';
import Modal from '../../OtherComponents/Modal';
import Button from '../../OtherComponents/Button';
import DataTable from 'react-data-table-component';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Alert from '../../OtherComponents/Alert';
import { addCategory, fetchCategories, toggleBlockCategory, updateCategory } from '../../../Utility/Category';

const Category = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    parentCategory: '',
  });

  const auth = useSelector((store) => store.adminAuth);
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Filtered data
  const [allCategories, setAllCategories] = useState([]); // Original data
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const location = useLocation();
  const [fields, setFields] = useState([
    { label: 'Category Name', name: 'name', type: 'text' },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Parent Category', name: 'parentCategory', type: 'select', options: [] },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      setShowAlert(true);

      // Clear the state after setting the alert
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch categories and set parent category options
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(auth.adminJwt);
        setAllCategories(data); // Save the original list
        setCategories(data); // Set the displayed list
        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === 'parentCategory'
              ? { ...field, options: data.map((cat) => ({ id: cat.categoryId, name: cat.categoryName })) }
              : field
          )
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, [auth.adminJwt]);

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async (values) => {
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
      if (isEditing) {
        try {
          await updateCategory(editingCategoryId, values, auth.adminJwt);
            setAlert({message:'Category Updated successfuly',status:'success'});
            setShowAlert(true)
        } catch (error) {
          setAlert({message:'Error updating category. Please try again.',status:'error'});
          setShowAlert(true)
        }
      } else {
        try {
            await addCategory(values, auth.adminJwt);
            setAlert({message:'Category Added successfuly',status:'success'});
            setShowAlert(true)
        } catch (error) {
          setAlert({message:'Category already exist!!! Try to add new One',status:'error'});
          setShowAlert(true)
        }
      }
  
      setIsModalOpen(false);
      setFormValues({ name: '', description: '', parentCategory: '' });
      setFormErrors({});
      setIsEditing(false);
      setEditingCategoryId(null);
  
      // Update the categories list to include the new category without refreshing
      const data = await fetchCategories(auth.adminJwt);
      setCategories(data);
  
      // Update the "Parent Category" options in the fields
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.name === 'parentCategory'
            ? { ...field, options: data.map((cat) => ({ id: cat.categoryId, name: cat.categoryName })) }
            : field
        )
      );
  };

  const validateForm = (values) => {
    let errors = {};
    if (!values.name.trim()) {
      errors.name = 'Category name is required';
    } else if (values.name.trim().length < 4) {
      errors.name = 'Category name must contain at least 4 letters';
    }
    if (values.description.trim().length > 0 && values.description.trim().length < 6) {
      errors.description = 'Description must contain at least 6 letters';
    }
    return errors;
  };

  const handleUpdate = (categoryId, categoryDetails) => {
    console.log('categoryDetails',categoryDetails);
    
    navigate(`/admin/category/${categoryId}`, { state: { categoryDetails } });
  };

  // Toggle the block/unblock status
  const handleBlockToggle = async (categoryId, isDeleted) => {
    try {
      await toggleBlockCategory(categoryId, !isDeleted, auth.adminJwt);
      
      const updatedCategories = categories.map((cat) =>
        cat.categoryId === categoryId ? { ...cat, isDeleted: !isDeleted } : cat
      );
      setCategories(updatedCategories);
      console.log(updatedCategories);
      setAlert({
        message: `Category ${isDeleted ? "unblocked" : "blocked"} successfully.`,
        status: "success",
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Error toggling block status:', error);
      setAlert({
        message: `Failed to ${isBlocked ? "unblock" : "block"} category.`,
        status: "error",
      });
      setShowAlert(true);
    }
  };
  
  // Filter categories based on the search input
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    if (searchValue === '') {
      // If search input is cleared, restore the full list
      setCategories(allCategories);
    } else {
      const filteredCategories = allCategories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchValue)
      );
      setCategories(filteredCategories);
    }
  };

  // Define table columns for react-data-table-component
  const columns = [
    {
      name: 'S. No.',
      selector: (_, index) => index + 1, // Serial numbers start at 1
      sortable: false,
    },
    {
      name: 'Category Name',
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: 'Parent Category',
      selector: (row) => row.parentCategoryName,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div>
          <button
            onClick={() => handleUpdate(row.categoryId, row)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
          >
            Update
          </button>
          <button
            onClick={() => handleBlockToggle(row.categoryId, row.isDeleted)}
            className={`${
              row.isDeleted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            } text-white px-3 py-1 rounded`}
          >
            {row.isDeleted ? 'Unblock' : 'Block'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 flex flex-col">     
      <div className='w-full flex items-center'>
        {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      </div>

      <h2 className="text-2xl font-semibold mb-4 self-center p-5">Category</h2>
      <div className="mt-4 self-end p-5">
        <Button onClick={() => setIsModalOpen(true)} text="Add +" />
      </div>
      <DataTable
        title="Categories"
        columns={columns}
        data={categories}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No categories found."
        defaultSortField="name" // Default sort by category name
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search Categories"
            className="border px-3 py-2 rounded-lg"
            onChange={handleSearch} // Updated to handle input dynamically
          />
        }
      />

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Update Category' : 'Add Category'}
          fields={fields}
          values={formValues}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          onChange={handleChange}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

export default Category;
