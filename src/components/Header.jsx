import React, { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'ahooks';
import { Input } from 'antd';

const HISTORY_KEY = 'search_history';

const Header = ({ search, onSearchChange }) => {
  const [value, setValue] = useState(search || '');
  const [open, setOpen] = useState(false);
  
  // Debounce the search value to avoid too frequent API calls
  const debouncedSearchValue = useDebounce(value, { wait: 300 });

  useEffect(() => {
    setValue(search || '');
  }, [search]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== search) {
      onSearchChange?.(debouncedSearchValue);
    }
  }, [debouncedSearchValue, search, onSearchChange]);

  const history = useMemo(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [open]);

  const saveHistory = (term) => {
    if (!term) return;
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const newList = [term, ...list.filter((t) => t !== term)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newList));
    } catch {}
  };

  const commitSearch = (term) => {
    onSearchChange?.(term);
    saveHistory(term);
    setOpen(false);
  };

  return (
    <header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px'
    }}>
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#1890ff'
      }}>
        腾讯文档克隆
      </div>
      <div style={{ position: 'relative', width: '300px' }}>
        <Input.Search
          placeholder="搜索文档标题..."
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            // onSearchChange will be called automatically via debounced effect
          }}
          onSearch={(val) => commitSearch(val.trim())}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          style={{ width: '100%' }}
        />
        {open && history.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: '4px'
          }}>
            {history.map((h, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: idx < history.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
                onMouseDown={() => commitSearch(h)}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = '#fff'}
              >
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


