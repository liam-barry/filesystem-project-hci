// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
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
      { id: "disc1", name: "Disc 1", type: "disc" },
      { id: "disc2", name: "Disc 2", type: "disc" },
    ]
  },
  { id: "rack2", name: "Jazz Classics", type: "rack", children: [
      { id: "disc3", name: "Disc 3", type: "disc" },
    ]
  },
  { id: "rack3", name: "Pop Hits", type: "rack", children: [] },
  { id: "rack4", name: "Classical", type: "rack", children: [
      { id: "rack5", name: "Symphonies", type: "rack", children: [
          { id: "disc4", name: "Disc 4", type: "disc" },
        ]
      },
    ]
  },
  { id: "rack6", name: "Electronic", type: "rack", children: [
      { id: "disc5", name: "Disc 5", type: "disc" },
    ]
  },
  { id: "rack7", name: "Hip Hop", type: "rack", children: [] },
  { id: "rack8", name: "Country", type: "rack", children: [
      { id: "disc6", name: "Disc 6", type: "disc" },
    ]
  },
  { id: "rack9", name: "Blues", type: "rack", children: [
      { id: "disc7", name: "Disc 7", type: "disc" },
    ]
  },
  { id: "rack10", name: "Metal", type: "rack", children: [] },
  { id: "rack11", name: "Folk", type: "rack", children: [
      { id: "disc8", name: "Disc 8", type: "disc" },
    ]
  },
];

function getIcon(item) {
  if (item.type === "disc") return discIcon;
  if (item.type === "rack") {
    return (item.children && item.children.length > 0) ? fullRack : emptyRack;
  }
}

function getCurrentItemsFromPath(items, path) {
  let currentItems = items;

  for (let id of path) {
    const found = currentItems.find(item => item.id === id);
    if (found && found.children) {
      currentItems = found.children;
    }
  }

  return currentItems;
}

function getItemFromPath(items, path) {
  let currentItems = items;
  let currentItem = null;

  for (let id of path) {
    currentItem = currentItems.find((item) => item.id === id) || null;

    if (!currentItem) {
      return null;
    }

    currentItems = currentItem.children || [];
  }

  return currentItem;
}

function updateItemsAtPath(items, path, updater) {
  if (path.length === 0) {
    return updater(items);
  }

  const [targetId, ...restPath] = path;

  return items.map((item) => {
    if (item.id !== targetId || item.type !== "rack") {
      return item;
    }

    return {
      ...item,
      children: updateItemsAtPath(item.children || [], restPath, updater),
    };
  });
}

function getNextDefaultName(type, items) {
  const isDisc = type === "disc";
  const matcher = isDisc ? /^Disc\s+(\d+)$/i : /^Rack\s+(\d+)$/i;
  const maxNumber = items.reduce((max, item) => {
    if (item.type !== type) {
      return max;
    }

    const match = item.name.match(matcher);
    if (!match) {
      return max;
    }

    return Math.max(max, Number(match[1]));
  }, 0);

  return `${isDisc ? "Disc" : "Rack"} ${maxNumber + 1}`;
}

export function CDCarousel({ allItems, onCenterItemChange, onItemsChange }) {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState([]);
  const [hiddenIndex, setHiddenIndex] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [newItemType, setNewItemType] = useState("disc");
  const [newItemName, setNewItemName] = useState("");

  function hideImage(index) {
    setHiddenIndex(index);

    setTimeout(() => {
      setHiddenIndex(null); // show it again
    }, 325);
  }

  // look inside of the current folder
  const currentItems = getCurrentItemsFromPath(allItems, currentPath);
  const currentRack = getItemFromPath(allItems, currentPath);

  const visibleIconsCount = Math.min(5, currentItems.length);
  const centerOffset = Math.floor(visibleIconsCount / 2);
  const centerItem = currentItems.length > 0
    ? currentItems[(startIndex + centerOffset) % currentItems.length]
    : null;
  const visibleItems = Array.from(
    { length: visibleIconsCount },
    (_, i) => currentItems[(startIndex + i) % currentItems.length]
  );

  const angleStep = currentItems.length > 1
    ? 180 / (visibleIconsCount % 2 === 0 ? visibleIconsCount : (visibleIconsCount - 1))
    : 0;

  useEffect(() => {
    onCenterItemChange(centerItem);
  }, [centerItem, onCenterItemChange]);

  useEffect(() => {
    if (currentItems.length === 0) {
      setStartIndex(0);
      return;
    }

    setStartIndex((prev) => prev % currentItems.length);
  }, [currentItems.length]);

  // const handleUp = () => {
  //   setStartIndex(prev => (prev + 1) % currentItems.length);
  // };

  // const handleDown = () => {
  //   setStartIndex(prev => (prev - 1 + currentItems.length) % currentItems.length);
  // };
  const handleUp = () => {
    if (currentItems.length === 0) return;

    setStartIndex(prev => {
      const newStart = (prev + 1) % currentItems.length;
      // the icon that just entered on the right
      const enteringIndex = (newStart + visibleIconsCount - 1) % currentItems.length;
      hideImage(enteringIndex);

      return newStart;
    });
  };

  const handleDown = () => {
    if (currentItems.length === 0) return;

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

  const openAddForm = () => {
    const defaultType = "disc";
    setNewItemType(defaultType);
    setNewItemName(getNextDefaultName(defaultType, currentItems));
    setDeleteCandidate(null);
    setIsAddFormOpen(true);
  };

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setNewItemType(selectedType);
    setNewItemName(getNextDefaultName(selectedType, currentItems));
  };

  const handleCreateItem = () => {
    const itemName = newItemName.trim();
    if (!itemName) {
      window.alert("Name cannot be empty.");
      return;
    }

    const idPrefix = newItemType === "disc" ? "disc" : "rack";
    const newItem = {
      id: `${idPrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: itemName,
      type: newItemType,
      ...(newItemType === "rack" ? { children: [] } : {}),
    };

    const updatedItems = updateItemsAtPath(allItems, currentPath, (items) => [...items, newItem]);
    onItemsChange(updatedItems);
    setIsAddFormOpen(false);
  };

  const handleRemove = () => {
    if (!centerItem) return;

    setIsAddFormOpen(false);
    setDeleteCandidate(centerItem);
  };

  const confirmRemove = () => {
    if (!deleteCandidate) return;

    const updatedItems = updateItemsAtPath(allItems, currentPath, (items) =>
      items.filter((item) => item.id !== deleteCandidate.id)
    );
    onItemsChange(updatedItems);
    setDeleteCandidate(null);
  };

  const cancelRemove = () => {
    setDeleteCandidate(null);
  };

  return (
    <div className="carousel-container">
      {currentPath.length > 0 && (
        <button className="back-button" onClick={handleBack}>← Back</button>
      )}
      <div className="carousel-header">
        <h2>{currentPath.length === 0 ? "Library" : currentRack?.name || "Folder"}</h2>
      </div>

      <Icon className="arrow1" src="/arrow-left.png" alt="Left Arrow" onClick={handleUp} />

      <div className="wheel">
        {visibleItems.map((item, i) => {
          const angle = (i - centerOffset) * angleStep;
          const scale = Math.abs(angle) < 20 ? 1.4 : 0.9;
          const realIndex = (startIndex + i) % currentItems.length;

          return (
            <div
              className="cd-item"
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                cursor: item.type === "rack" ? "pointer" : "default",
                visibility: hiddenIndex === realIndex ? "hidden" : "visible",
                transform: `rotate(${angle}deg) translateX(var(--orbit-radius)) rotate(${-angle}deg) scale(${scale})`
              }}
            >
              <img
                className="cd"
                src={getIcon(item)}
                alt={item.name}
              />
              <div className="cd-name">{item.name}</div>
            </div>
          );
        })}
      </div>

      <div className="mid-action-buttons">
        <button className="action-button" onClick={openAddForm}>+</button>
        <button className="action-button" onClick={handleRemove}>−</button>
      </div>

      {isAddFormOpen && (
        <div className="add-form-panel">
          <label className="add-form-label" htmlFor="item-type-select">Type</label>
          <select id="item-type-select" className="add-form-select" value={newItemType} onChange={handleTypeChange}>
            <option value="disc">Disc</option>
            <option value="rack">Rack</option>
          </select>
          <label className="add-form-label" htmlFor="item-name-input">Name</label>
          <input
            id="item-name-input"
            className="add-form-input"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
          />
          <div className="add-form-actions">
            <button className="add-form-button" onClick={handleCreateItem}>Add</button>
            <button className="add-form-button" onClick={() => setIsAddFormOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {deleteCandidate && (
        <div className="delete-confirm-panel">
          <div className="delete-confirm-text">
            Remove {deleteCandidate.type} "{deleteCandidate.name}"?
          </div>
          <div className="add-form-actions">
            <button className="add-form-button" onClick={confirmRemove}>Confirm</button>
            <button className="add-form-button" onClick={cancelRemove}>Cancel</button>
          </div>
        </div>
      )}

      <Icon className="arrow2" src="/arrow-right.png" alt="Right Arrow" onClick={handleDown} />
    </div>
  );
}

function Preview({ centerItem }) {
  const previewItems = centerItem?.type === "rack" ? (centerItem.children || []) : [];

  return (
    <div className="preview-container">
      <div className="preview-label">Preview</div>
      <div className="preview-list">
        <div className="preview-rack">
          <div className="preview-rack-name">{centerItem ? centerItem.name : "No selection"}</div>
          {previewItems.length > 0 ? (
            <div className="preview-items">
              {previewItems.map((rackItem) => (
                <div className="preview-item" key={rackItem.id}>
                  <img className="preview-item-icon" src={getIcon(rackItem)} alt={rackItem.name} />
                  <div className="preview-item-name">{rackItem.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="preview-empty">No items</div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [allItems, setAllItems] = useState(initialRacks);
  const [centerItem, setCenterItem] = useState(null);

  return (
    <header className="App-header">
      <CDCarousel allItems={allItems} onCenterItemChange={setCenterItem} onItemsChange={setAllItems} />
      <Preview centerItem={centerItem} />
    </header>
  );
}

export default App;