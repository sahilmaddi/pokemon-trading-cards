
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { API_URL, AI_API_URL } from './config/api';




function App() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', hp: '', rarity: '', generation: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [generationFilter, setGenerationFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [imageSource, setImageSource] = useState('url'); // 'url', 'upload', 'ai'
  const fileInputRef = useRef();
  // AI Chat state
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAIMessages] = useState([
    { sender: 'ai', text: 'Hi! Ask me any Pokémon question.' }
  ]);
  const [aiInput, setAIInput] = useState('');
  // Dummy AI response (replace with real API if needed)
  const handleAIChatSend = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAIMessages(msgs => [...msgs, { sender: 'user', text: userMsg }]);
    let aiReply = '';
    if (/which pokemon card can beat all pokemon/i.test(userMsg)) {
      aiReply = 'There is no single Pokémon card that can beat all others, as strengths and weaknesses depend on type matchups, HP, and abilities. However, cards like Arceus, Mewtwo, or powerful Legendary Pokémon are often considered top-tier in many games.';
    } else {
      aiReply = 'I am a Pokémon AI! Ask me about Pokémon cards, types, or battles.';
    }
    setTimeout(() => {
      setAIMessages(msgs => [...msgs, { sender: 'ai', text: aiReply }]);
    }, 800);
    setAIInput('');
  };


  // Fetch all cards
  const fetchCards = async () => {
    const res = await axios.get(API_URL);
    setCards(res.data);
  };


  useEffect(() => {
    fetchCards();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerationFilter = (e) => {
    setGenerationFilter(e.target.value);
  };

  // handleSubmit removed (inlined in form)

  // Edit card
  const handleEdit = (card) => {
    setForm({ name: card.name, type: card.type, hp: card.hp, rarity: card.rarity });
    setEditingId(card.id);
  };

  // Delete card
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchCards();
  };

  return (
    <div className="container">
      <h1>Pokemon Trading Cards</h1>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="generationFilter">Filter by Generation: </label>
        <select id="generationFilter" value={generationFilter} onChange={handleGenerationFilter}>
          <option key="all" value="">All</option>
          {[...new Set(cards.map(card => card.generation))].filter(Boolean).map((gen, idx) => (
            <option key={`gen-${gen}-${idx}`} value={gen}>{gen}</option>
          ))}
        </select>
      </div>
      <button
        className={`arrow-collapse-btn${showForm ? ' open' : ''}`}
        onClick={() => setShowForm(v => !v)}
        aria-expanded={showForm}
        aria-controls="add-edit-form"
        title={showForm ? 'Hide Add/Edit Card' : 'Show Add/Edit Card'}
        style={{ position: 'fixed', top: 80, right: 0, zIndex: 1200 }}
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: showForm ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
          ◀
        </span>
      </button>
      <button onClick={async () => { await fetch(AI_API_URL, { method: 'POST' }); fetchCards(); }} style={{ marginBottom: 16, marginLeft: 8 }}>
        Re-Generate All Cards
      </button>

      {/* Sidebar for Add/Edit Card */}
      {showForm && (
        <div className="collapsible-form right-float" id="add-edit-form" style={{ position: 'fixed', top: 80, right: 60, zIndex: 1100 }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            let finalForm = { ...form };
            if (imageSource === 'upload' && fileInputRef.current?.files?.[0]) {
              // For demo: use a local object URL. In production, upload to server or cloud storage.
              finalForm.imageUrl = URL.createObjectURL(fileInputRef.current.files[0]);
            }
            if (editingId) {
              await axios.put(`${API_URL}/${editingId}`, { ...finalForm, hp: parseInt(finalForm.hp) });
            } else {
              await axios.post(API_URL, { ...finalForm, hp: parseInt(finalForm.hp) });
            }
            setForm({ name: '', type: '', hp: '', rarity: '', generation: '', imageUrl: '' });
            setEditingId(null);
            setShowForm(false);
            fetchCards();
          }} style={{ marginBottom: 24 }}>
            <h2 style={{ textAlign: 'center' }}>{editingId ? 'Edit Card' : 'Add Card'}</h2>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
            <input name="hp" placeholder="HP" type="number" value={form.hp} onChange={handleChange} required />
            <input name="rarity" placeholder="Rarity" value={form.rarity} onChange={handleChange} required />
            <input name="generation" placeholder="Generation" value={form.generation} onChange={handleChange} required />
            <div style={{ margin: '8px 0' }}>
              <span id="imgsrc-label" style={{ fontWeight: 'bold' }}>Image Source:</span>
              <label style={{ marginLeft: 12 }}><input type="radio" aria-labelledby="imgsrc-label" name="imgsrc" value="url" checked={imageSource === 'url'} onChange={() => setImageSource('url')} /> URL</label>
              <label style={{ marginLeft: 12 }}><input type="radio" aria-labelledby="imgsrc-label" name="imgsrc" value="upload" checked={imageSource === 'upload'} onChange={() => setImageSource('upload')} /> Upload</label>
              <label style={{ marginLeft: 12 }}><input type="radio" aria-labelledby="imgsrc-label" name="imgsrc" value="ai" checked={imageSource === 'ai'} onChange={() => setImageSource('ai')} /> AI Search</label>
            </div>
            {imageSource === 'url' && (
              <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} style={{ marginBottom: 8 }} />
            )}
            {imageSource === 'upload' && (
              <input type="file" accept="image/*" ref={fileInputRef} style={{ marginBottom: 8 }} />
            )}
            {imageSource === 'ai' && (
              <button type="button" style={{ marginBottom: 8 }} onClick={async () => {
                if (!form.name) return alert('Enter a name first!');
                const resp = await fetch(`https://api.unsplash.com/search/photos?query=pokemon+${form.name}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
                const data = await resp.json();
                if (data?.results?.[0]) {
                  setForm(f => ({ ...f, imageUrl: data.results[0].urls.small }));
                } else {
                  alert('No image found!');
                }
              }}>
                Generate Image by AI
              </button>
            )}
            <button type="submit">{editingId ? 'Update' : 'Add'} Card</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', type: '', hp: '', rarity: '', generation: '', imageUrl: '' }); }}>Cancel</button>}
          </form>
        </div>
      )}
  <div className="card-grid">
      {/* Floating AI Chat Button and Overlay */}
      <button
        className={`ai-chat-btn${showAIChat ? ' open' : ''}`}
        onClick={() => setShowAIChat(v => !v)}
        aria-expanded={showAIChat}
        aria-controls="ai-chat-panel"
        title={showAIChat ? 'Close Pokémon AI Chat' : 'Open Pokémon AI Chat'}
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: showAIChat ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
          💬
        </span>
      </button>
      {showAIChat && (
        <div className="ai-chat-overlay" id="ai-chat-panel" style={{ position: 'fixed', bottom: 90, right: 32, zIndex: 1299, width: 340, maxWidth: '90vw', background: '#fffbe7', border: '2px solid #e2c044', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: 0 }}>
          <div style={{ padding: '16px 16px 8px 16px', borderBottom: '1.5px solid #e2c044', background: '#e2c044', borderRadius: '16px 16px 0 0', color: '#23272f', fontWeight: 'bold' }}>
            Pokémon AI Chat
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto', padding: 12 }}>
            {aiMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8, textAlign: msg.sender === 'ai' ? 'left' : 'right' }}>
                <span style={{ background: msg.sender === 'ai' ? '#e2c044' : '#23272f', color: msg.sender === 'ai' ? '#23272f' : '#e2c044', borderRadius: 8, padding: '6px 12px', display: 'inline-block', maxWidth: 240, wordBreak: 'break-word' }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAIChatSend} style={{ display: 'flex', borderTop: '1.5px solid #e2c044', padding: 8, background: '#fffbe7', borderRadius: '0 0 16px 16px' }}>
            <input
              type="text"
              value={aiInput}
              onChange={e => setAIInput(e.target.value)}
              placeholder="Ask a Pokémon question..."
              style={{ flex: 1, border: '1.5px solid #e2c044', borderRadius: 8, padding: 8, marginRight: 8, background: '#fff', color: '#23272f' }}
              aria-label="Ask a Pokémon question"
            />
            <button type="submit" style={{ background: '#e2c044', color: '#23272f', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
          </form>
        </div>
      )}
        {cards.filter(card => !generationFilter || card.generation === generationFilter).map(card => (
          <div className="trading-card decorated" key={card.id}>
            <div className="card-decoration-top">
              <span className="sparkle sparkle1">✦</span>
              <span className="sparkle sparkle2">✧</span>
              <span className="sparkle sparkle3">✦</span>
            </div>
            <div className="card-image">
              <div className="card-img-glitter-wrap">
                <img
                  src={card.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.id || ''}.png`}
                  alt={card.name}
                  className="hd-pokemon-img"
                  onError={e => { e.target.onerror = null; e.target.src = `https://img.pokemondb.net/artwork/large/${card.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`; }}
                />
                <div className="glitter-overlay"></div>
              </div>
            </div>
            <div className="card-decoration-bottom">
              <span className="sparkle sparkle4">✧</span>
              <span className="sparkle sparkle5">✦</span>
            </div>
            <div className="card-header">
              <span className="card-name">{card.name}</span>
              <span className="card-hp">HP: {card.hp}</span>
            </div>
            <div className="card-type">Type: {card.type}</div>
            <div className="card-rarity">Rarity: {card.rarity}</div>
            <div className="card-generation">Generation: {card.generation}</div>
            <div className="card-actions">
              <button onClick={() => handleEdit(card)}>Edit</button>
              <button onClick={() => handleDelete(card.id)} style={{ marginLeft: 8 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App
