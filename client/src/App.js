import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import pic from './pictures/darknet.jpeg';

function App() {

  return (
    <div className="App" style={{background:pic}}>
      <Main/>
    </div>
  );
}

export default App;
