import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState('');

  const handleGenerate = async () =>{
    setLoading(true);
    setCoverLetter('');

    try{
      const response = await axios.post('http://localhost:8000/generate-cover-letter', {
        resume: resume,
        job_description : jobDescription
      });
      setCoverLetter(response.data.cover_letter);
    } catch (error) {
      console.error(error);
      setCoverLetter('Error generating cover letter.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="App">
      <h1>🎯 Resume Genie</h1>

      <textarea
        placeholder='Paste your resume here...'
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        rows={8}
      />

      <textarea
        placeholder='Paste your job description here...'
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
      />
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>

      { coverLetter && (
        <div className='output'>
          <h2> Generated Cover Letter</h2>
          <pre>{coverLetter}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
