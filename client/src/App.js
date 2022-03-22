import React from "react";
import { useState } from "react";
import './app.css';
import axios from 'axios';

function App() {
  
  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

//submit button click handler 
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const reqBody = {
      name: name,
      zipCode: zipCode,
    }
    //post request to endpoint
    axios.post('/create_phrase', reqBody)
      .then(res => {
        setIsLoading(false);
        if (res.status === 200) {
          setName("");
          setZipCode("");
          setMessage(res.data.message);
        } else {
          setMessage("Some error occurred");
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
        setMessage("Some error occurred");
      });
  };

  return (
    <div className="app">
      <h1> ZERO Coding Challenge</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        
        <button type="submit" disabled={!((name.length > 0) && (zipCode.length === 5))}>Submit</button>

        <div className="message">
          {isLoading ? 'loading...' : message ? <p>{message}</p> : null}
          </div>
      </form>
    </div>
  );
}

export default App;
