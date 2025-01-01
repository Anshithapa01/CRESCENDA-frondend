// src/components/RequestTable.js
import React from 'react';

const Request = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thumbnail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Request Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chapter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <img
                src="/path/to/thumbnail.jpg"
                alt="Course Thumbnail"
                className="w-16 h-10 rounded"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">Development Bootcamp</td>
            <td className="px-6 py-4 whitespace-nowrap">Update</td>
            <td className="px-6 py-4 whitespace-nowrap">Content outdated</td>
            <td className="px-6 py-4 whitespace-nowrap">Course Overview</td>
            <td className="px-6 py-4 whitespace-nowrap">Vue Forms</td>
            <td className="px-6 py-4 whitespace-normal w-96">
              <button className="bg-green-500 text-white px-4 py-1 rounded-full mr-2 hover:bg-green-600">
                View
              </button>
              <button className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600">
                Submit
              </button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default Request;
