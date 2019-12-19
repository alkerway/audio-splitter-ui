import React, {Component} from 'react';
import { Upload } from './Components/Upload';
import './App.css';

interface AppState {
}

class App extends Component<{}, AppState> {
  render() {
    return (
        <div className="App">
          <header className="App-header">
            <p>
              Upload File
            </p>
            <Upload />
          </header>
        </div>
    );
  }
}

export default App;
