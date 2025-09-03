import React, {useState} from 'react'

const Edittable = ({ initialNames = [] }) => {

    const [names, setNames] = useState(initialNames);
    const [editIndex, setEditIndex] = useState(null);
    const [tempName, setTempName] = useState('');
  
    const handleEdit = (index) => {
      setEditIndex(index);
      setTempName(names[index]);
    };
  
    const handleSave = () => {
      const updatedNames = [...names];
      updatedNames[editIndex] = tempName;
      setNames(updatedNames);
      setEditIndex(null);
    };

  return (
    <div>
        <ul>
      {names.map((name, index) => (
        <li key={index}>
          {editIndex === index ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              {name} <button onClick={() => handleEdit(index)}>Edit</button>
            </>
          )}
        </li>
      ))}
    </ul>
      
    </div>
  )
}

export default Edittable
