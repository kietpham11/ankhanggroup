import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Plus, Check, Loader2 } from 'lucide-react';
import { postsAPI } from '../../../../lib/api';

interface CategoryModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

export default function CategoryModal({ onClose, onUpdate }: CategoryModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for adding/editing
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return setError('Tên danh mục không được để trống');
    try {
      setSaving(true);
      await postsAPI.createCategory({ name: newName, description: newDesc });
      setIsAdding(false);
      setNewName('');
      setNewDesc('');
      fetchCategories();
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi thêm danh mục');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return setError('Tên danh mục không được để trống');
    try {
      setSaving(true);
      await postsAPI.updateCategory(id, { name: editName, description: editDesc });
      setIsEditing(null);
      fetchCategories();
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi sửa danh mục');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, count: number) => {
    if (count > 0) {
      alert(`Không thể xoá danh mục này vì đang có ${count} bài viết.`);
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xoá danh mục này?')) return;
    try {
      setSaving(true);
      await postsAPI.deleteCategory(id);
      fetchCategories();
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xoá danh mục');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat: any) => {
    setIsEditing(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '600px', maxWidth: '95%' }}>
        <div className="modal-header">
          <h2>Quản lý Danh mục Tin tức</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1.5rem' }}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                style={{ 
                  background: 'var(--gold-accent)', color: 'white', border: 'none', 
                  padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Plus size={16} /> Thêm danh mục
              </button>
            )}
          </div>

          {isAdding && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Thêm danh mục mới</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input 
                  type="text" 
                  placeholder="Tên danh mục (*)" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <input 
                  type="text" 
                  placeholder="Mô tả (không bắt buộc)" 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setIsAdding(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>Huỷ</button>
                  <button onClick={handleAdd} disabled={saving} style={{ padding: '0.5rem 1rem', border: 'none', background: 'var(--gold-accent)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                    {saving ? <Loader2 size={16} className="spin" /> : 'Lưu'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>Tên danh mục</th>
                  <th style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Số bài viết</th>
                  <th style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>
                      {isEditing === cat.id ? (
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)}
                          style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                        />
                      ) : (
                        <div>
                          <div style={{ fontWeight: 500 }}>{cat.name}</div>
                          {cat.description && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{cat.description}</div>}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.85rem' }}>
                        {cat._count?.posts || 0}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                      {isEditing === cat.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => handleUpdate(cat.id)} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }}><Check size={18} /></button>
                          <button onClick={() => setIsEditing(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                          <button onClick={() => startEdit(cat)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Sửa"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(cat.id, cat._count?.posts || 0)} style={{ background: 'transparent', border: 'none', color: cat._count?.posts > 0 ? '#cbd5e1' : '#ef4444', cursor: cat._count?.posts > 0 ? 'not-allowed' : 'pointer' }} title={cat._count?.posts > 0 ? 'Không thể xoá vì đang có bài viết' : 'Xoá'} disabled={cat._count?.posts > 0}><Trash2 size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Chưa có danh mục nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
