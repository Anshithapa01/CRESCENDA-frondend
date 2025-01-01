import React, { useState, useEffect } from 'react';
import Button from '../../OtherComponents/Button';
import Modal from '../../OtherComponents/Modal';
import DataTable from 'react-data-table-component'; // Import DataTable
import { useLocation } from 'react-router-dom'; // To get the category_id from the URL
import { useSelector } from 'react-redux';
import { addSubCategory, fetchSubCategories, fetchSubCategoryDetails, toggleSubCategoryBlock, updateSubCategory } from '../../../Utility/SubCategory';

const SubCategory = ({setShowAlert,setAlert}) => {
  const location = useLocation();
  const category_id = location.pathname.split('/')[3]; // Get category_id from URL path
  const [subCategories, setSubCategories] = useState([]); // Set initial state to an empty array
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    category_id: category_id || '', // Automatically set category_id from URL
  });
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const auth = useSelector((store) => store.adminAuth);

  const fields = [
    { label: 'Sub Category Name', name: 'name', type: 'text' },
    { label: 'Description', name: 'description', type: 'textarea' },
  ];

  // Fetch SubCategories when the component mounts or category_id changes
  useEffect(() => {
    loadSubCategories();
  }, [category_id]);

  const loadSubCategories = async () => {
    try {
      const data = await fetchSubCategories(category_id, auth.adminJwt);
      setAllSubCategories(data);
      setSubCategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setAllSubCategories([]);
      setSubCategories([]); // Set to empty array on error
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    if (searchValue === '') {
      setSubCategories(allSubCategories); // Restore full list if search input is cleared
    } else {
      const filteredSubCategories = allSubCategories.filter((subcategory) =>
        subcategory.subcategoryName.toLowerCase().includes(searchValue)
      );
      setSubCategories(filteredSubCategories); // Update filtered list
    }
  };

  useEffect(() => {
    // When the category_id in the URL changes, reset the form values with the new category_id
    setFormValues((prevValues) => ({
      ...prevValues,
      category_id: category_id,
    }));
  }, [category_id]); // This will update when category_id changes in the URL

  const validateForm = (values) => {
    let errors = {};
    if (!values.name.trim()) {
      errors.name = 'Sub Category name is required';
    } else if (values.name.trim().length < 4) {
      errors.name = 'Sub Category name must be at least 4 characters long';
    }

    if (values.description.trim().length > 0 && values.description.trim().length < 6) {
      errors.description = 'Description must contain at least 6 characters';
    }
    return errors;
  };

  const handleSave = async (values) => {
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const requestPayload = {
      name: values.name,
      description: values.description,
    };
      if (editingSubCategory && editingSubCategory.subcategoryId) {
        try {
          await updateSubCategory(category_id, editingSubCategory.subcategoryId, values, auth.adminJwt);
          setAlert({message:'Sategory Updated successfuly',status:'success'});
          setShowAlert(true)
        } catch (error) {
          setAlert({message:'Error updating Sub category. Please try again.',status:'error'});
          setShowAlert(true)
        }
      } else {
        try {
          await addSubCategory(category_id, values, auth.adminJwt);
          setAlert({message:'Sub category Added successfuly',status:'success'});
            setShowAlert(true)
        } catch (error) {
          setAlert({message:'Sub category already exist!!! Try to add new One',status:'error'});
          setShowAlert(true)
        }
      }

      loadSubCategories();
      setIsModalOpen(false);
      setFormErrors({});
      setEditingSubCategory(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without saving
    setFormErrors({}); // Clear form errors
  };

  const handleModal = () => {
    setEditingSubCategory(null); // Reset for adding a new subcategory
    setFormValues({ name: '', description: '', category_id: category_id }); // Reset form values with category_id
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdate = async (subCategoryId) => {
    try {
      const subCategory = await fetchSubCategoryDetails(category_id, subCategoryId, auth.adminJwt);
      setFormValues({
        name: subCategory.subcategoryName || '',
        description: subCategory.subCategoryDescription || '',
        category_id: subCategory.categoryId || '',
      });

      setEditingSubCategory(subCategory); // Set the editing state
      setIsModalOpen(true); // Open the modal for editing
    } catch (error) {
      console.error('Error loading subcategory details:', error);
    }
  };

  const handleBlockToggle = async (subCategory_id, isDeleted) => {
    try {
      await toggleSubCategoryBlock(category_id, subCategory_id, !isDeleted, auth.adminJwt);

      const updatedCategories = subCategories.map((cat) =>
        cat.subcategoryId === subCategory_id ? { ...cat, isDeleted: !isDeleted } : cat
      );
      setSubCategories([...updatedCategories]); // Spread into a new array to trigger re-render
      setAlert({
        message: `Subcategory ${isDeleted ? "unblocked" : "blocked"} successfully.`,
        status: "success",
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Error toggling block status:', error);
      setAlert({
        message: `Failed to ${isBlocked ? "unblock" : "block"} subcategory.`,
        status: "error",
      });
      setShowAlert(true);
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      name: 'S. No.',
      selector: (_, index) => index + 1,
      sortable: false,
    },
    {
      name: 'Sub Category Name',
      selector: (row) => row.subcategoryName,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.subCategoryDescription,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div>
          <button
            onClick={() => handleUpdate(row.subcategoryId)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
          >
            Update
          </button>
          <button
            onClick={() => handleBlockToggle(row.subcategoryId, row.isDeleted)}
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
    <div className="flex flex-col">
      <h3 className="text-xl font-semibold mb-4 self-center">Sub Category</h3>
      <div className="self-end p-7">
        <Button onClick={handleModal} width={'w-20'} text={'Add +'} />
      </div>
      <DataTable
        title="Sub Categories"
        columns={columns}
        data={subCategories}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No subcategories found."
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search Sub Categories"
            className="border px-3 py-2 rounded-lg"
            onChange={handleSearch}
          />
        }
      />
      {isModalOpen && (
        <Modal
          title={editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
          fields={fields}
          values={formValues}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={(name, value) => setFormValues({ ...formValues, [name]: value })}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

export default SubCategory;
