import React, { useState } from 'react';
import * as api from "../services/api";

function Create() {
  console.log(process.env);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    street_Address: "",
    apt: "",
    State: "",
    Zipcode: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    api.createPizzaRequest(formData).then((r) => {
      console.log(r);
    });
  };

  const handleAddress = () => {
  console.log("click handled");
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      api.getStreetAddress(position.coords).then(res=>{
        console.log(res);
      });
    }, (err) => {
      console.log("timed out", err);
    }, { timeout:20000 });
  }

  return (
    <div className="create-container">
    title: <input onChange={handleChange} name="title" />
    description: <input onChange={handleChange} name="description" />
    Address Info (This is not shared with the individual fulfilling your order) <br />
    Street Address: <input onChange={handleChange} name="streetAddress" />
    apt: <input onChange={handleChange} name="apt" />
    State: <input onChange={handleChange} name="state" />
    Zipcode: <input onChange={handleChange} name="zipCode" />
      <button type="button" onClick={handleSubmit}> Create Pizza request!</button>
      <button type="button" onClick={handleAddress}> Get Address </button>
    </div>


  );
}

export default Create;
