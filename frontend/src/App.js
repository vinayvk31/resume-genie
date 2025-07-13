import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import html2pdf from 'html2pdf.js';

function App() {
  const backendURL = process.env.REACT_APP_API_BASE_URL;
  
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gryphe/mythomax-l2-13b'); // Default model
  const [tone, setTone] = useState('professional');
  const models = [
    { value: 'gryphe/mythomax-l2-13b', label: 'Mythomax' },
    { value: 'openai/gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16k' },
    { value: 'mistralai/mistral-7b-instruct', label: 'Mistral' }
  ];
  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'concise', label: 'Concise' }
  ];

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/generate-cover-letter`, {
        resume: resume,
        job_description: jobDescription,
        model: selectedModel,
        tone: tone
      });
      setCoverLetter(response.data.cover_letter);
    } catch (error) {
      console.error(error);
      alert('Something wrong while generating cover letter.');
    }
    setLoading(false);
  }

  const handleFileUpload = async (file, setStateFn) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${backendURL}/extract-text`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });

      if(response.data.text) {
        setStateFn(response.data.text);
      } else {
        alert('Failed to extract text from the file.');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file. Please try again.');
    }
  };

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
          <input 
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setResumeFile(file);
                handleFileUpload(file, setResume);
              }
            }}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Job Description</label>
          <textarea
            className="w-full h-40 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <input 
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setJobDescriptionFile(file);
                handleFileUpload(file, setJobDescription);
              }
            }}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Select Model</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {models.map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Select Tone</label>
          <select 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {tones.map(toneOption => (
              <option key={toneOption.value} value={toneOption.value}>
                {toneOption.label}
              </option>
            ))}
          </select>
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