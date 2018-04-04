import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

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
        
        $.post('http://localhost:3001/api/comms',  {
            firstName: 'Fred',
            lastName: 'Flintstone'
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
        */

        // ajax replacement with jquery

        var dataType = 'application/json; charset=utf-8';
        $.ajax({
            type: 'POST',
            url: `http://localhost:3001/api/comms`, // node js connection
            data: { FirstName: 'Fred', LastName: 'Flintstone' }, //node js data

        })
        .done((data) => {
            console.log(data);
        })
        .fail((error) => {
            console.log(error);
        });
    }

    activateAspLasers = (e) => {
        console.log("pew");
        
        // ajax replacement with jquery
        var dataType = 'application/json; charset=utf-8';
        $.ajax({
            type: 'POST',
            url: `http://localhost:54768/api/comms`, // asp connection
            data: JSON.stringify({ FirstName: 'Fred', LastName: 'Flintstone' }), // asp data
            contentType: "application/json; charset=utf-8", //asp requirement
            dataType: "json" //asp requirement
        })
        .done((data) => {
            console.log(data);
        })
        .fail((error) => {
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
                    Test Node JS call
                </Button>

                <Button onClick={this.activateAspLasers}>
                    Test ASP .Net Core call
                </Button>
            </div>
        );
    }
}

export default App;
