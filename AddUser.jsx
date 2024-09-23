import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const areasOfInterest = ["Technology", "Science", "Arts"];

function AddUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    enrolmentDate: "",
    nativePlace: "",
    areasOfInterest: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        areasOfInterest: checked
          ? [...prev.areasOfInterest, value]
          : prev.areasOfInterest.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    if (!formData.enrolmentDate)
      newErrors.enrolmentDate = "Enrolment date is required";
    if (!formData.nativePlace)
      newErrors.nativePlace = "Native place is required";
    if (formData.areasOfInterest.length === 0)
      newErrors.areasOfInterest = "At least one area of interest is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let newUser = {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          MobileNumber: formData.mobileNumber,
          EnrolmentDate: formData.enrolmentDate,
          NativePlace: formData.nativePlace,
          AreasOfInterest: formData.areasOfInterest.join(", "),
          Gender: formData.gender,
        };

        let config = {
          method: 'post',
          url: 'https://localhost:7147/api/user',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: JSON.stringify(newUser)
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));


        navigate("/Landing", { state: { newUser } });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div className="container my-4 text-bg-success p-5">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input type="text" name="firstName" className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            value={formData.firstName}
            onChange={handleChange} />

          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input type="text" name="lastName" className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            value={formData.lastName}
            onChange={handleChange} />

          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Mobile Number</label>
          <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend"> +91 </span>
            <input type="text" name="mobileNumber" className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
              value={formData.mobileNumber}
              onChange={handleChange} />

            {errors.mobileNumber && (
              <div className="invalid-feedback">{errors.mobileNumber}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label>Enrolment Date</label>
          <input type="date" name="enrolmentDate" className={`form-control ${errors.enrolmentDate ? "is-invalid" : ""}`}
            value={formData.enrolmentDate}
            onChange={handleChange} />

          {errors.enrolmentDate && (
            <div className="invalid-feedback">{errors.enrolmentDate}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="nativePlace" className="form-label">
            Native Place
          </label>
          <select id="nativePlace" name="nativePlace" className={`form-select ${errors.nativePlace ? "is-invalid" : ""}`}
            value={formData.nativePlace}
            onChange={handleChange} >

            <option value="">Select</option>
            <option value="Kurnool">Kurnool</option>
            <option value="Guntur">Guntur</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
          {errors.nativePlace && (
            <div className="invalid-feedback">{errors.nativePlace}</div>
          )}
        </div>

        <fieldset className="mb-3">
          <legend>Areas of Interest</legend>
          {areasOfInterest.map((area, index) => (
            <div className="form-check" key={index}>
              <input type="checkbox" id={`interest-${index}`} name="areasOfInterest" className="form-check-input" value={area}
                checked={formData.areasOfInterest.includes(area)}
                onChange={handleChange} />

              <label className="form-check-label" htmlFor={`interest-${index}`}>
                {area}
              </label>
            </div>
          ))}
          {errors.areasOfInterest && (
            <div className="text-danger">{errors.areasOfInterest}</div>
          )}
        </fieldset>

        <fieldset className="mb-3">
          <legend>Gender</legend>
          <div className="form-check">
            <input id="male" type="radio" name="gender" className="form-check-input" value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange} />

            <label className="form-check-label" for="male">
              Male
            </label>
          </div>
          <div className="form-check">
            <input id="female" type="radio" name="gender" className="form-check-input" value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange} />
            <label className="form-check-label" for="female">
              Female
            </label>
          </div>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
        </fieldset>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddUser;
