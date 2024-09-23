import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Landing.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


function Landing() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [columnDefs] = useState([
    { headerName: "User ID", field: "userId" },
    { headerName: "First Name", field: "firstName" },
    { headerName: "Last Name", field: "lastName" },
    { headerName: "Mobile Number", field: "mobileNumber" },
    { headerName: "Enrolment Date", field: "enrolmentDate" },

    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <>
          <button onClick={() => handleEdit(params.data)}>Edit</button>
          <button onClick={() => handleDelete(params.data)}>Delete</button>
          <button onClick={() => handleView(params.data)}>View</button>
        </>
      )
    }
  ]);

  const handleEdit = (data) => {
    console.log("Edit", data);
  };

  const handleDelete = (data) => {
    const userId = data.userId;

    const deleteData = JSON.stringify({ "UserId": userId });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://localhost:7147/api/user/delete',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: deleteData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setRowData(prevRowData => prevRowData.filter(user => user.userId !== userId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleView = (data) => {
    const userId = data.userId;

    const config = {
      method: 'post',
      url: 'https://localhost:7147/api/user/getbyid',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: JSON.stringify({ userId })
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        setUserDetails(response.data.responseMessage);
        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setUserDetails(null);
  };

  useEffect(() => {
    const axios = require('axios');
    let data = '';

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://localhost:7147/api/user',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        setRowData(response.data.responseMessage);

      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  useEffect(() => {
    console.log(rowData);
  }, [rowData]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const goToAddUser = () => {
    navigate('/add-user');
  };

  return (
    <div className="landing-container">
      <header className="header">
        <h2>Welcome to React App</h2>
        <h4>{user.email}</h4>
      </header>
      <div className="content">
        <nav className="sidebar">
          <ul>
            <li>Dashboard</li>
            <li>Users</li>
            <li>
              <button className="logout-btn btn btn-secondary" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
        <main className="main">
          <h3>User List</h3><br />
          <button className="add-user-btn btn btn-primary" onClick={goToAddUser}>Add User</button><br />

          <div className="ag-theme-alpine" style={{ height: 309, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={5}
            />
          </div>

          {showModal && userDetails && (
            <div className="modal show" style={{ display: 'block' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">User Details</h5>

                  </div>
                  <div className="modal-body">
                    <p><strong>User ID:</strong> {userDetails.userId}</p>
                    <p><strong>First Name:</strong> {userDetails.firstName}</p>
                    <p><strong>Last Name:</strong> {userDetails.lastName}</p>
                    <p><strong>Mobile Number:</strong> {userDetails.mobileNumber}</p>
                    <p><strong>Enrolment Date:</strong> {userDetails.enrolmentDate}</p>
                    <p><strong>Native Place:</strong> {userDetails.nativePlace}</p>
                    <p><strong>Areas of Interest:</strong> {userDetails.areasOfInterest}</p>
                    <p><strong>Gender:</strong> {userDetails.gender}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>)}
        </main>
      </div>
    </div>
  );
}

export default Landing;