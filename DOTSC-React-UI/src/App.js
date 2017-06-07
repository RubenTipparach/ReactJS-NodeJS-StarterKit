import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Button } from 'semantic-ui-react'

class App extends Component {
  activateLasers = (e) => {
	  console.log("pew");

/*
	  var instance = axios.create({
		  baseURL: 'http://localhost:3001',
		  timeout: 1000,
		  headers: {"Access-Control-Allow-Origin": "*",
			  "Access-Control-Allow-Headers": "X-Requested-With"}
		});
*/
		axios.post('http://localhost:3001/comms',  {
			firstName: 'Fred',
			lastName: 'Flintstone'
		  })
		  .then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
		<Button onClick={this.activateLasers}>
		  Activate Lasers
		</Button>
      </div>
    );
  }


}

export default App;
