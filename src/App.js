import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function CD() {
  return (
    <img
      src="icons/cd.png"
      alt="CD icon"
    />
  );
}
function CD_Rack() {
  return (
    <img
      src="icons/cd_rack.png"
      alt="CD Rack icon"
    />
  );
}
function Rack_spinner() {
  return (
    <img
      src="icons/rack_spinner.png"
      alt="Rack spinner icon"
    />
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CD />
        <CD_Rack />
        <Rack_spinner />
      </header>
    </div>
  );
}

 export default App;

