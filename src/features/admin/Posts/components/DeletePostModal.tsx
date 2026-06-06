import React from 'react';
import { X, Trash2 } from 'lucide-react';
import '../../Projects/components/DeleteProjectModal.css'; // Reusing the same CSS for identical layout

interface DeletePostModalProps {
  postTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePostModal({ postTitle, onClose, onConfirm }: DeletePostModalProps) {
  return (
    <div className="dpm-overlay" onClick={onClose}>
      <div className="dpm-modal" onClick={e => e.stopPropagation()}>
        <button className="dpm-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="dpm-icon-wrapper">
          <Trash2 size={32} />
        </div>
        
        <h3 className="dpm-title">Xóa bài viết</h3>
        
        <p className="dpm-desc">
          Bạn có chắc chắn muốn xóa bài viết <span className="dpm-desc-highlight">"{postTitle}"</span>?
        </p>
        
        <p className="dpm-subdesc">
          Hành động này không thể hoàn tác.
        </p>
        
        <div className="dpm-actions">
          <button className="dpm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="dpm-btn-delete" onClick={onConfirm}>Xóa bài viết</button>
        </div>
      </div>
    </div>
  );
}
