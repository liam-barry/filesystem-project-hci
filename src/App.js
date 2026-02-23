// import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import discIcon from "./assets/discIcon.png";
import emptyRack from "./assets/emptyRack.png";
import fullRack from "./assets/fullRack.png";

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
// File/Folder data structure
const initialRacks = [
  { id: "rack1", name: "Rock Collection", type: "rack", children: [
      { id: "disc1", name: "Song A", type: "disc" },
      { id: "disc2", name: "Song B", type: "disc" },
    ]
  },
  { id: "rack2", name: "Jazz Classics", type: "rack", children: [
      { id: "disc3", name: "Jazz Track 1", type: "disc" },
    ]
  },
  { id: "rack3", name: "Pop Hits", type: "rack", children: [] },
  { id: "rack4", name: "Classical", type: "rack", children: [
      { id: "rack5", name: "Symphonies", type: "rack", children: [
          { id: "disc4", name: "Symphony No. 5", type: "disc" },
        ]
      },
    ]
  },
  { id: "rack6", name: "Electronic", type: "rack", children: [
      { id: "disc5", name: "Synth Track", type: "disc" },
    ]
  },
  { id: "rack7", name: "Hip Hop", type: "rack", children: [] },
  { id: "rack8", name: "Country", type: "rack", children: [
      { id: "disc6", name: "Country Song", type: "disc" },
    ]
  },
  { id: "rack9", name: "Blues", type: "rack", children: [
      { id: "disc7", name: "Blues Track", type: "disc" },
    ]
  },
  { id: "rack10", name: "Metal", type: "rack", children: [] },
  { id: "rack11", name: "Folk", type: "rack", children: [
      { id: "disc8", name: "Folk Song", type: "disc" },
    ]
  },
];

function getIcon(item) {
  if (item.type === "disc") return discIcon;
  if (item.type === "rack") {
    return (item.children && item.children.length > 0) ? fullRack : emptyRack;
  }
}

export function CDCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState([]);
  const [hiddenIndex, setHiddenIndex] = useState(null);
  const [allItems] = useState(initialRacks);

  function hideImage(index) {
    setHiddenIndex(index);

    setTimeout(() => {
      setHiddenIndex(null); // show it again
    }, 325);
  }

  // look inside of the current folder
  let currentItems = allItems;
  for (let id of currentPath) {
    const found = currentItems.find(item => item.id === id);
    if (found && found.children) {
      currentItems = found.children;
    }
  }

  const visibleIconsCount = Math.min(5, currentItems.length);
  const visibleItems = Array.from(
    { length: visibleIconsCount },
    (_, i) => currentItems[(startIndex + i) % currentItems.length]
  );

  const angleStep = currentItems.length > 1 ? 180 / (visibleIconsCount - 1) : 0;

  // const handleUp = () => {
  //   setStartIndex(prev => (prev + 1) % currentItems.length);
  // };

  // const handleDown = () => {
  //   setStartIndex(prev => (prev - 1 + currentItems.length) % currentItems.length);
  // };
  const handleUp = () => {
    setStartIndex(prev => {
      const newStart = (prev + 1) % currentItems.length;
      // the icon that just entered on the right
      const enteringIndex = (newStart + visibleIconsCount - 1) % currentItems.length;
      hideImage(enteringIndex);

      return newStart;
    });
  };

  const handleDown = () => {
    setStartIndex(prev => {
      const newStart = (prev - 1 + currentItems.length) % currentItems.length;
      // the icon that entered on the left
      const enteringIndex = newStart;
      hideImage(enteringIndex);

      return newStart;
    });
  };

  const handleItemClick = (item) => {
    if (item.type === "rack") {
      setCurrentPath([...currentPath, item.id]);
      setStartIndex(0);
    }
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
    setStartIndex(0);
  };

  return (
    <div className="carousel-container">
      {currentPath.length > 0 && (
        <button className="back-button" onClick={handleBack}>← Back</button>
      )}
      <h2>{currentPath.length === 0 ? "Library" : allItems.find(i => i.id === currentPath[currentPath.length - 1])?.name || "Folder"}</h2>

      <Icon className="arrow1" src="/arrow-left.png" alt="Left Arrow" onClick={handleUp} />

      <div className="wheel">
        {visibleItems.map((item, i) => {
          const angle = -90 + i * angleStep;
          const scale = Math.abs(angle) < 20 ? 1.4 : 0.9;
          const realIndex = (startIndex + i) % currentItems.length;

          return (
            <img
              className="cd"
              key={item.id}
              src={getIcon(item)}
              alt={item.name}
              onClick={() => handleItemClick(item)}
              style={{
                visibility: hiddenIndex === realIndex ? "hidden" : "visible",
                transform: `rotate(${angle}deg) translateX(250px) rotate(${-angle}deg) scale(${scale})`
              }}
            />
          );
        })}
      </div>

      <Icon className="arrow2" src="/arrow-right.png" alt="Right Arrow" onClick={handleDown} />
    </div>
  );
}

function Preview() {
  return (
    <div className="preview-container">
      <div className="preview-label">Preview</div>
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