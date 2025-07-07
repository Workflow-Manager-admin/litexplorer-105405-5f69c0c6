import React, { useState } from 'react';

// PUBLIC_INTERFACE
function AddBookForm({ genres, onAddBook, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: genres && genres.length ? genres[0].name : '',
    description: '',
    image: '',
  });
  const [error, setError] = useState('');
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onAddBook(form);
  }
  return (
    <form onSubmit={handleSubmit} className="add-book-form"
      style={{
        background: '#fff',
        borderRadius: '1.2em',
        boxShadow: '0 4px 24px rgba(99,102,241,0.08), 0 2px 6px rgba(251,191,36,0.06)',
        padding: '2.1em 2.4em',
        maxWidth: 440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5em',
        border: '1.2px solid var(--border-color, #e9ecef)'
      }}
    >
      <h2 style={{margin:'0 0 0.5em 0', color: 'var(--primary-color, #374151)', fontWeight: 900}}>Add New Book</h2>
      <div style={{display:'flex',flexDirection:'column',gap:'0.28em'}}>
        <label htmlFor="title" style={{fontWeight:600}}>Title*</label>
        <input id="title" name="title" value={form.title} onChange={handleChange}
          required minLength={2} maxLength={80}
          style={{padding: '0.6em 1em', borderRadius:8, border:'1.2px solid var(--border-color, #e9ecef)'}} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'0.28em'}}>
        <label htmlFor="author" style={{fontWeight:600}}>Author*</label>
        <input id="author" name="author" value={form.author} onChange={handleChange}
          required minLength={2} maxLength={44}
          style={{padding: '0.6em 1em', borderRadius:8, border:'1.2px solid var(--border-color, #e9ecef)'}} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'0.28em'}}>
        <label htmlFor="genre" style={{fontWeight:600}}>Genre*</label>
        <select id="genre" name="genre" value={form.genre} onChange={handleChange}
          required
          style={{padding: '0.6em 1em', borderRadius:8, border:'1.2px solid var(--border-color, #e9ecef)'}} >
          {genres && genres.map((g) =>
            <option key={g.name} value={g.name}>{g.name}</option>
          )}
        </select>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'0.28em'}}>
        <label htmlFor="description" style={{fontWeight:600}}>Description*</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange}
          required minLength={5} maxLength={400}
          style={{padding: '0.6em 1em', borderRadius:8, border:'1.2px solid var(--border-color, #e9ecef)', minHeight:80, resize:'vertical'}} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'0.28em'}}>
        <label htmlFor="image" style={{fontWeight:600}}>Image Link</label>
        <input id="image" name="image" value={form.image} onChange={handleChange}
          type="url"
          placeholder="https://"
          style={{padding: '0.6em 1em', borderRadius:8, border:'1.2px solid var(--border-color, #e9ecef)'}} />
      </div>
      {error && <div style={{color:'#e53935', fontWeight:600}}>{error}</div>}
      <div style={{display:'flex',justifyContent:'flex-end',gap:'1em'}}>
        <button type="button" onClick={onCancel}
          style={{
            background: 'var(--border-color, #e9ecef)',
            color: 'var(--primary-color, #374151)',
            border: 'none', padding: '0.55em 1.4em', borderRadius:'2em',
            cursor: 'pointer', fontWeight:600
          }}>Cancel</button>
        <button type="submit"
          style={{
            background: 'var(--secondary-color, #6366f1)',
            color: '#fff', fontWeight:'bold',
            border: 'none', padding: '0.55em 1.7em', borderRadius:'2em',
            cursor: 'pointer', boxShadow:'0 2px 7px rgba(99,102,241,0.09)',
            letterSpacing:'0.02em'
          }}>Add Book</button>
      </div>
    </form>
  );
}

export default AddBookForm;
