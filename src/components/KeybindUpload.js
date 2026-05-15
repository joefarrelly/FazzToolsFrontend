import React, { useState } from 'react';
import axios from 'axios';
import { cookies } from 'cookies';
import { config } from 'Constants';

function KeybindUpload({ inputKey, onChange }) {
  const [disable, setDisable] = useState(true);
  const [selectedFile, setSelectedFile] = useState();

  function changeHandler(event) {
    setSelectedFile(event.target.files[0]);
    setDisable(false);
  }

  async function submitHandler() {
    const formData = new FormData();
    formData.append('userId', cookies.get('userid'));
    formData.append('userFile', selectedFile);
    formData.append('userLastUpdate', new Date().toISOString());
    await axios.put(
      config.url.API_URL + '/api/profile/users/' + cookies.get('userid') + '/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    onChange(Date.now());
    setSelectedFile('');
    setDisable(true);
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded px-4 py-3 w-fit">
      <input
        type="file"
        name="file"
        accept=".lua"
        key={inputKey}
        onChange={changeHandler}
        className="text-sm text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600 file:cursor-pointer file:transition-colors"
      />
      <button
        disabled={disable}
        onClick={submitHandler}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold px-3 py-1.5 rounded text-sm transition-colors"
      >
        Submit
      </button>
    </div>
  );
}

export default KeybindUpload;
