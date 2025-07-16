import { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/api/parse`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setFile(file);
    setJsonData(data);
    setEditedData(data);
  };

  const handleChange = (key, value) => {
    setEditedData({ ...editedData, [key]: value });
  };

  const handleNestedChange = (parent, key, value) => {
    setEditedData({ 
      ...editedData, 
      [parent]: { ...editedData[parent], [key]: value }
    });
  };

  const handleSave = async () => {
    const res = await fetch(`${API}/api/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedData)
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "edited.save";
    a.click();
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Luigi's Mansion 3 Save Editor</h1>
      <input type="file" accept=".save" onChange={handleFileUpload} />

      {jsonData && (
        <div className="space-y-2">
          <div><label>Coins: </label>
            <input type="number" value={editedData.coins} onChange={(e) => handleChange('coins', parseInt(e.target.value))} />
          </div>
          <div><label>Keys: </label>
            <input type="number" value={editedData.keys} onChange={(e) => handleChange('keys', parseInt(e.target.value))} />
          </div>
          <div><label>Weapon Durability: </label>
            <input type="number" value={editedData.weaponDurability} onChange={(e) => handleChange('weaponDurability', parseInt(e.target.value))} />
          </div>
        </div>
      )}
    </div>
  );
}
