
import React, { useState, useEffect, useRef } from 'react';

export default function Typeahead({ fetchFn, placeholder, onSelect, value, onChange }) {
  const [q, setQ] = useState(value || '');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQ(value);
    }
  }, [value]);

  useEffect(() => {
    if (!q || q.length < 1) { setItems([]); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetchFn(q).then(res => { setItems(res || []); setOpen(true); }).catch(()=>{});
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQ(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleItemSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
    setQ(item.vpa || item.name || item.title || item.label || '');
    if (onChange) {
      onChange(item.vpa || item.name || item.title || item.label || '');
    }
    setOpen(false);
  };

  return (
    <div style={{position:'relative'}}>
      <input value={q} onChange={handleInputChange} placeholder={placeholder} className="input" />
      {open && items.length>0 && (
        <div className="card" style={{position:'absolute', zIndex:50, width:'100%'}}>
          {items.slice(0,8).map(it => (
            <div key={it.id} style={{padding:8, cursor:'pointer'}} onClick={() => handleItemSelect(it)}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                {it.avatar && <img src={it.avatar} style={{width:32,height:32,borderRadius:16}} alt="a"/>}
                <div>
                  <div style={{fontWeight:600}}>{it.name || it.title || it.label || it.name}</div>
                  <div className="muted" style={{fontSize:12}}>{it.phone || it.language || ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
