import React from 'react';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  
  const isOverdue = (): boolean => {
    if (!todo.dueDate || todo.completed) return false;
    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < now;
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      if (dateStr.includes('T')) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
      }
      
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="todoist-task-row fade-in">
      {/* Circular checkbox */}
      <div 
        className={`circular-checkbox priority-${todo.priority} ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        title={todo.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
      />

      {/* Task Details */}
      <div className="task-details">
        <div className="task-title-line">
          <span className={`task-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </span>
        </div>
        
        {todo.description && (
          <p className="task-desc">{todo.description}</p>
        )}

        <div className="task-meta-line">
          {todo.dueDate && (
            <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {isOverdue() ? 'Quá hạn: ' : ''}{formatDate(todo.dueDate)}
            </span>
          )}
          
          <span style={{ color: 'var(--text-muted)' }}>
            Độ ưu tiên: {todo.priority === 'HIGH' ? 'Cao' : todo.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
          </span>
        </div>
      </div>

      {/* Action buttons visible on hover */}
      <div className="task-actions">
        <button 
          type="button" 
          className="action-btn"
          onClick={() => onEdit(todo)}
          title="Chỉnh sửa công việc"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          type="button" 
          className="action-btn delete"
          onClick={() => onDelete(todo.id)}
          title="Xóa công việc"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
