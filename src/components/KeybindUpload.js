import React, { useState } from 'react';
import axios from 'axios';
import { cookies } from 'cookies';
import { config } from 'Constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateFile(file) {
  if (!file) return null;
  if (!file.name.endsWith('.lua')) return 'File must be a .lua file.';
  if (file.size > MAX_FILE_SIZE) return 'File must be under 5 MB.';
  return null;
}

function KeybindUpload({ inputKey, onChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'

  function changeHandler(event) {
    const file = event.target.files[0] ?? null;
    const error = validateFile(file);
    setSelectedFile(file);
    setValidationError(error);
    setUploadState('idle');
  }

  async function submitHandler() {
    const error = validateFile(selectedFile);
    if (error) {
      setValidationError(error);
      return;
    }

    setUploadState('loading');
    try {
      const formData = new FormData();
      formData.append('user_id', cookies.get('userid'));
      formData.append('user_file', selectedFile);
      formData.append('user_last_update', new Date().toISOString());
      await axios.put(
        config.url.API_URL + '/api/profile/users/' + cookies.get('userid') + '/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploadState('done');
      setSelectedFile(null);
      onChange(Date.now());
      setTimeout(() => setUploadState('idle'), 3000);
    } catch {
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 3000);
    }
  }

  const canSubmit = selectedFile && !validationError && uploadState === 'idle';
  const btnLabel = { idle: 'Submit', loading: 'Uploading…', done: 'Uploaded!', error: 'Failed' }[
    uploadState
  ];
  const btnCls =
    uploadState === 'error'
      ? 'bg-red-700 hover:bg-red-600 text-zinc-100'
      : uploadState === 'done'
        ? 'bg-green-700 text-zinc-100'
        : 'bg-amber-600 hover:bg-amber-500 text-zinc-950';

  return (
    <div className="flex flex-col gap-2 w-fit">
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded px-4 py-3">
        <input
          type="file"
          name="file"
          accept=".lua"
          key={inputKey}
          onChange={changeHandler}
          className="text-sm text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600 file:cursor-pointer file:transition-colors"
        />
        <button
          disabled={!canSubmit}
          onClick={submitHandler}
          className={`${btnCls} disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-3 py-1.5 rounded text-sm transition-colors`}
        >
          {btnLabel}
        </button>
      </div>
      {validationError && <p className="text-red-400 text-xs px-1">{validationError}</p>}
    </div>
  );
}

export default KeybindUpload;
