import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Upload, ChefHat, Flame, Info, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Pilih gambar makanan dulu ya!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Menggunakan relative path agar berfungsi di Vercel maupun local
      const response = await axios.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.details || err.response?.data?.error || "Gagal menganalisis gambar. Coba lagi!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Food Analyzer <ChefHat size={32} color="#6366f1" style={{ verticalAlign: 'middle', marginLeft: '8px' }} /></h1>
        <p className="subtitle">Uji coba AI Kalori dengan Gemini 2.5 Flash Lite</p>

        <div className="form-group">
          <label htmlFor="food-image" className="drop-zone">
            <Upload size={48} color="#94a3b8" />
            <p style={{ marginTop: '12px' }}>{file ? file.name : "Klik atau seret gambar ke sini"}</p>
            <input 
              type="file" 
              id="food-image" 
              hidden 
              accept="image/*" 
              onChange={onFileChange} 
            />
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Pratinjau Makanan" />
          </div>
        )}

        {error && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', margin: '16px 0', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleUpload} 
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Menganalisis...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Cek Kalori
            </>
          )}
        </button>

        {result && (
          <div className="result-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{result.name}</h3>
            <div className="calories-badge">
              <Flame size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {result.calories} kkal
            </div>
            <div style={{ marginTop: '16px', color: '#94a3b8', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '8px' }}>
                <Info size={16} />
                <span style={{ fontWeight: '600' }}>Ringkasan Nutrisi</span>
              </div>
              {result.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
