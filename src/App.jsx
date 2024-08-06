import React, { useState } from 'react';
import Modal from 'react-modal';
import './index.css';

Modal.setAppElement('#root');

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/generate-og-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, image }),
      });

      if (response.ok) {
        const data = await response.json();
        setOgImageUrl(data.imageUrl);
        setIsOpen(true);
      } else {
        console.error('Failed to generate OG image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Create a Post</h1>
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL (optional)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generate OG Image
        </button>
      </form>
      {ogImageUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated OG Image</h2>
          <div
            className="cursor-pointer border rounded-lg shadow-md p-4"
            onClick={() => setIsOpen(true)}
          >
            <img
              src={`http://localhost:3000${ogImageUrl}`}
              alt="Generated OG Image"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Generated OG Image"
        className="max-w-3xl p-6 bg-white rounded-lg shadow-xl m-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Generated OG Image</h2>
        <img
          src={`http://localhost:3000${ogImageUrl}`}
          alt="Generated OG Image"
          className="w-full h-auto rounded-lg"
        />
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default App;
