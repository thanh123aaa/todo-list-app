import React from 'react';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onAddTask: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  totalPages,
  totalElements,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onToggle,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <div style={{ 
          display: 'inline-block', 
          width: '30px', 
          height: '30px', 
          border: '3px solid rgba(219, 76, 63, 0.1)', 
          borderTopColor: 'var(--header-bg)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ fontSize: '0.9rem' }}>Đang tải công việc...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Calculate elements range
  const startElement = currentPage * pageSize + 1;
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

  const pageNumbers: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      
      {/* List of Tasks */}
      {todos.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Không có công việc nào trong mục này.
        </div>
      )}

      {/* Add Task Placeholder Button at the bottom of the list */}
      <button 
        type="button" 
        className="add-task-placeholder"
        onClick={onAddTask}
      >
        <span className="add-task-placeholder-plus">+</span>
        <span>Thêm công việc</span>
      </button>

      {/* Pagination Container - Minimalist */}
      {totalElements > 0 && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem',
            marginTop: '2.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            Hiển thị <strong>{startElement}-{endElement}</strong> / <strong>{totalElements}</strong>
          </div>

          {/* Page numbers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              className="action-btn"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            >
              Trước
            </button>
            
            {pageNumbers.map(page => (
              <button
                key={page}
                type="button"
                className="action-btn"
                style={{ 
                  padding: '0.25rem 0.5rem', 
                  fontSize: '0.8rem',
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                  color: page === currentPage ? 'var(--header-bg)' : 'var(--text-secondary)',
                  backgroundColor: page === currentPage ? 'var(--hover-bg)' : 'transparent',
                  minWidth: '24px'
                }}
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </button>
            ))}

            <button
              type="button"
              className="action-btn"
              disabled={currentPage === totalPages - 1 || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            >
              Sau
            </button>
          </div>

          {/* Page size dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Hiện:</span>
            <select
              className="glass-input glass-select"
              style={{ padding: '0.15rem 1.5rem 0.15rem 0.5rem', width: 'auto', fontSize: '0.8rem', height: 'auto', border: 'none', background: 'transparent' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5 dòng</option>
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
            </select>
          </div>
        </div>
      )}

    </div>
  );
};
