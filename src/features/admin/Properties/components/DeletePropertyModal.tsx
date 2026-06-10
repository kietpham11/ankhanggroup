import React from 'react';
import { X, Trash2 } from 'lucide-react';
import './DeletePropertyModal.css';

interface DeletePropertyModalProps {
  propertyName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePropertyModal({ propertyName, onClose, onConfirm }: DeletePropertyModalProps) {
  return (
    <div className="dpm-overlay" onClick={onClose}>
      <div className="dpm-modal" onClick={e => e.stopPropagation()}>
        <button className="dpm-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="dpm-icon-wrapper">
          <Trash2 size={32} />
        </div>
        
        <h3 className="dpm-title">Xóa bất động sản</h3>
        
        <p className="dpm-desc">
          Bạn có chắc chắn muốn xóa bất động sản <span className="dpm-desc-highlight">"{propertyName}"</span>?
        </p>
        
        <p className="dpm-subdesc">
          Hành động này không thể hoàn tác.
        </p>
        
        <div className="dpm-actions">
          <button className="dpm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="dpm-btn-delete" onClick={onConfirm}>Xóa bất động sản</button>
        </div>
      </div>
    </div>
  );
}
