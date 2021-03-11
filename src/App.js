import logo from './logo.svg';
import './App.css';
import React from 'react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code> src/App.js </code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/ciphertrick"; //connecting to ciphertrick
const options = {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
};

mongoose.connect(mongoURI, options);

mongoose.connection.on('connected', ()=>{  
    console.log('Mongoose default connection open to ' + mongoURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err)=>{  
    console.log('handle mongo errored connections: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', ()=>{  
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', ()=>{
    mongoose.connection.close(()=>{
        console.log('App terminated, closing mongo connections');
        process.exit(0);
    });
});


export default App;
