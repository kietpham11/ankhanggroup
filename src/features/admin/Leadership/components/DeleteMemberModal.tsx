import React from 'react';
import { X, Trash2 } from 'lucide-react';
import '../../Projects/components/DeleteProjectModal.css';

interface DeleteMemberModalProps {
  memberName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberModal({ memberName, onClose, onConfirm }: DeleteMemberModalProps) {
  return (
    <div className="dpm-overlay" onClick={onClose}>
      <div className="dpm-modal" onClick={e => e.stopPropagation()}>
        <button className="dpm-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="dpm-icon-wrapper">
          <Trash2 size={32} />
        </div>
        
        <h3 className="dpm-title">Xóa thành viên</h3>
        
        <p className="dpm-desc">
          Bạn có chắc chắn muốn xóa thành viên <span className="dpm-desc-highlight">"{memberName}"</span>?
        </p>
        
        <p className="dpm-subdesc">
          Hành động này không thể hoàn tác.
        </p>
        
        <div className="dpm-actions">
          <button className="dpm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="dpm-btn-delete" onClick={onConfirm}>Xóa thành viên</button>
        </div>
      </div>
    </div>
  );
}
