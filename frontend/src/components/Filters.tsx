import React from 'react';
import type { Priority } from '../types';

interface FiltersProps {
  completed: boolean | undefined;
  setCompleted: (val: boolean | undefined) => void;
  priority: Priority | undefined;
  setPriority: (val: Priority | undefined) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  direction: 'ASC' | 'DESC';
  setDirection: (val: 'ASC' | 'DESC') => void;
}

export const Filters: React.FC<FiltersProps> = ({
  completed,
  setCompleted,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  direction,
  setDirection,
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        gap: '0.75rem', 
        flexWrap: 'wrap',
        padding: '0.5rem 0',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '0.85rem'
      }}
    >
      {/* Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Lọc:</span>
        <select
          className="glass-input glass-select"
          style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', width: 'auto', fontSize: '0.8rem', height: 'auto', border: 'none', background: 'transparent' }}
          value={completed === undefined ? 'ALL' : String(completed)}
          onChange={(e) => {
            const val = e.target.value;
            setCompleted(val === 'ALL' ? undefined : val === 'true');
          }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="false">Chưa hoàn thành</option>
          <option value="true">Đã hoàn thành</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <select
          className="glass-input glass-select"
          style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', width: 'auto', fontSize: '0.8rem', height: 'auto', border: 'none', background: 'transparent' }}
          value={priority || 'ALL'}
          onChange={(e) => {
            const val = e.target.value;
            setPriority(val === 'ALL' ? undefined : (val as Priority));
          }}
        >
          <option value="ALL">Tất cả độ ưu tiên</option>
          <option value="LOW">Thấp (Low)</option>
          <option value="MEDIUM">Trung bình (Medium)</option>
          <option value="HIGH">Cao (High)</option>
        </select>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Sắp xếp:</span>
        <select
          className="glass-input glass-select"
          style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', width: 'auto', fontSize: '0.8rem', height: 'auto', border: 'none', background: 'transparent' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Ngày tạo</option>
          <option value="dueDate">Hạn hoàn thành</option>
          <option value="title">Tên việc</option>
          <option value="priority">Độ ưu tiên</option>
        </select>
        
        <button
          type="button"
          className="action-btn"
          style={{ padding: '0.2rem', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDirection(direction === 'ASC' ? 'DESC' : 'ASC')}
          title={direction === 'ASC' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
        >
          {direction === 'ASC' ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};
