import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import html2pdf from 'html2pdf.js';

function App() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/generate-cover-letter', {
        resume: resume,
        job_description: jobDescription
      });
      setCoverLetter(response.data.cover_letter);
    } catch (error) {
      console.error(error);
      alert('Something wrong while generating cover letter.');
    }
    setLoading(false);
  }


  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-3xl font-bold text-center text-blue-700 mb-6'>Resume Genie</h1>

        <div className='mb-4'>
          <label className='block font-medium mb-2 text-gray-700'>Your Resume</label>
          <textarea
            className="w-full h-40 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Job Description</label>
          <textarea
            className="w-full h-40 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>

        { coverLetter && (
          <div className='mt-6'>
            <h2 className='text-xl font-semidbold mb-2 text-gray-800'>Generated Cover Letter</h2>
            <div
              className="whitespace-pre-wrap p-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              id="cover-letter-output"
            >
              {coverLetter}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const element = document.getElementById('cover-letter-output');
            if (element) {
              setTimeout(() => {
                html2pdf().from(element).save("cover-letter.pdf");
              }, 100); // small delay to ensure render
            }
          }}
          className="mt-4 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

export default App;