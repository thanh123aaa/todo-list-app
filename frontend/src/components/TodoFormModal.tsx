import React, { useState, useEffect } from 'react';
import type { Todo, TodoRequest, Priority } from '../types';

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: TodoRequest) => Promise<void>;
  todoToEdit?: Todo | null;
}

export const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  todoToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset or load data when modal opens/changes edit target
  useEffect(() => {
    if (isOpen) {
      if (todoToEdit) {
        setTitle(todoToEdit.title);
        setDescription(todoToEdit.description || '');
        setCompleted(todoToEdit.completed);
        setPriority(todoToEdit.priority);
        let dateVal = todoToEdit.dueDate || '';
        if (dateVal.length > 16) {
          dateVal = dateVal.substring(0, 16); // Extract "YYYY-MM-DDTHH:mm"
        }
        setDueDate(dateVal);
      } else {
        setTitle('');
        setDescription('');
        setCompleted(false);
        setPriority('MEDIUM');
        setDueDate('');
      }
      setErrors({});
    }
  }, [isOpen, todoToEdit]);

  if (!isOpen) return null;

  const handleValidation = (): boolean => {
    const newErrors: { title?: string; dueDate?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (title.length > 255) {
      newErrors.title = 'Tiêu đề không được vượt quá 255 ký tự';
    }

    if (dueDate) {
      const selectedDateTime = new Date(dueDate);
      const currentDateTime = new Date();
      selectedDateTime.setSeconds(0, 0);
      currentDateTime.setSeconds(0, 0);
      if (selectedDateTime < currentDateTime) {
        newErrors.dueDate = 'Hạn chót phải lớn hơn hoặc bằng thời gian hiện tại';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setSubmitting(true);
    try {
      const request: TodoRequest = {
        title: title.trim(),
        description: description.trim(),
        completed,
        priority,
        dueDate: dueDate ? dueDate : null,
      };
      await onSubmit(request);
      onClose();
    } catch (err: any) {
      setErrors({ title: err.message || 'Lỗi khi gửi yêu cầu.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 3, 10, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div 
        className="todoist-modal" 
        style={{ 
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner modal
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
            {todoToEdit ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              lineHeight: '1'
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Tiêu đề *</label>
            <input
              type="text"
              className="glass-input"
              placeholder="Nhập việc cần làm..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              style={{ borderColor: errors.title ? 'var(--danger)' : undefined }}
            />
            {errors.title && (
              <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Mô tả chi tiết</label>
            <textarea
              className="glass-input"
              placeholder="Nhập thông tin mô tả..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Mức độ ưu tiên</label>
            <select
              className="glass-input glass-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="LOW">Thấp (Low)</option>
              <option value="MEDIUM">Trung bình (Medium)</option>
              <option value="HIGH">Cao (High)</option>
            </select>
          </div>

          {/* Due Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Hạn chót hoàn thành</label>
            <input
              type="datetime-local"
              className="glass-input"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors({});
              }}
              style={{ borderColor: errors.dueDate ? 'var(--danger)' : undefined }}
            />
            {errors.dueDate && (
              <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.dueDate}</span>
            )}
          </div>

          {/* Status Checkbox (Only during edit) */}
          {todoToEdit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                type="checkbox"
                id="modal-completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />
              <label htmlFor="modal-completed" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                Đánh dấu đã hoàn thành công việc này
              </label>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={submitting}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : todoToEdit ? 'Lưu cập nhật' : 'Thêm mới'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
