import React from 'react';

interface TodoStatsProps {
  total: number;
  completed: number;
  pending: number;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ total, completed, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem'
        }}
      >
        <div>
          <span>Hoàn thành: <strong>{completed}</strong></span>
          <span style={{ margin: '0 0.5rem' }}>•</span>
          <span>Chưa xong: <strong>{pending}</strong></span>
        </div>
        <span style={{ fontWeight: '500', color: 'var(--header-bg)' }}>{completionRate}% hoàn thành</span>
      </div>
      
      {/* Small Thin Progress Bar */}
      <div style={{ background: 'rgba(0, 0, 0, 0.05)', height: '4px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div 
          style={{ 
            background: 'var(--header-bg)', 
            height: '100%', 
            width: `${completionRate}%`, 
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }} 
        />
      </div>
    </div>
  );
};
