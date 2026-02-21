// import logo from './logo.svg';
import './App.css';
import { useState } from "react";

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

// function CD() {
//   return (
//     <img
//       src="icons/cd.png"
//       alt="CD icon"
//     />
//   );
// }
// function CD_Rack() {
//   return (
//     <img
//       src="icons/cd_rack.png"
//       alt="CD Rack icon"
//     />
//   );
// }
// function Rack_spinner() {
//   return (
//     <img
//       src="icons/rack_spinner.png"
//       alt="Rack spinner icon"
//     />
//   );
// }

function Icon({ className, src, alt, onClick}) {
  return (
    <img className={className} src={src} alt={alt} onClick={onClick} style={{cursor: "pointer"}} />
  );
}
const visibleIconsCount = 5;
const allIcons = ["/cd1.png", "/cd2.png", "/cd3.png", "/cd4.png", "/cd5.png", "/cd6.png", "/cd7.png", "/cd8.png", "/cd9.png", "/cd10.png"];

function addRack({ src, alt}) {

}

function addIcon({ src}) {
  allIcons.push(src);
}

export function CDCarousel() {

  const [rotation, setRotation] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [hiddenIndex, setHiddenIndex] = useState(null);

  function hideImage(index) {
    setHiddenIndex(index);

    setTimeout(() => {
      setHiddenIndex(null); // show it again
    }, 325);
  }

  const visibleIcons = Array.from({ length: visibleIconsCount }, (_, i) => allIcons[(startIndex + i) % allIcons.length]);
  const angleStep = 180 / (visibleIconsCount - 1);
  // const handleUp = () => {setStartIndex(prev => (prev + 1) % allIcons.length);};
  // const handleDown = () => {setStartIndex(prev => (prev - 1 + allIcons.length) % allIcons.length);};

  const handleUp = () => {
    setStartIndex(prev => {
      const newStart = (prev + 1) % allIcons.length;
      // the icon that just entered on the right
      const enteringIndex = (newStart + visibleIconsCount - 1) % allIcons.length;
      hideImage(enteringIndex);

      return newStart;
    });
  };

  const handleDown = () => {
    setStartIndex(prev => {
      const newStart = (prev - 1 + allIcons.length) % allIcons.length;
      // the icon that entered on the left
      const enteringIndex = newStart;
      hideImage(enteringIndex);

      return newStart;
    });
  };

  return (
    <div className="carousel-container">

      {/* Button left */}
      <Icon className = "arrow1" src="/arrow-left.png" alt="Left Arrow" onClick={handleUp}/>

      {/* Wheel */}
      <div className="wheel"> 
        {visibleIcons.map((src, i) => {

          const angle = -90 + i * angleStep;
          const scale = Math.abs(angle) < 20 ? 1.4 : 0.9;
          const realIndex = (startIndex + i) % allIcons.length;

          return (
            <img className = "cd" key={src} src={src} alt="CD" style = {{visibility: hiddenIndex === realIndex ? "hidden" : "visible", transform: `rotate(${angle}deg) translateX(250px) rotate(${-angle}deg) scale(${scale})`}}/>
            // <div className= "cd" key={src}  style = {{visibility: hiddenIndex === realIndex ? "hidden" : "visible", transform: `rotate(${angle}deg) translateX(250px) rotate(${-angle}deg) scale(${scale})`}}>
            //   {src}
            // </div>
          );
        })}
      </div>

      {/* Button right */}
      <Icon className = "arrow2" src="/arrow-right.png" alt="Right Arrow" onClick={handleDown}/>
    </div>
  );
}

function Preview() {
  return (
    <div className="preview-container">
      <div className="preview-label">Disc Preview</div>
    </div>
  );
}

function App() {
  return (
    <header className="App-header">
      <CDCarousel />
      <Preview />
    </header>
  );
}

 export default App;

