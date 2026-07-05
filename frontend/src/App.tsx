import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoRequest, Priority } from './types';
import { api } from './services/api';
import { TodoStats } from './components/TodoStats';
import { Filters } from './components/Filters';
import { TodoList } from './components/TodoList';
import { TodoFormModal } from './components/TodoFormModal';
import { ConfirmModal } from './components/ConfirmModal';

type ActiveView = 'inbox' | 'today' | 'upcoming' | 'completed' | 'high' | 'medium' | 'low';

function App() {
  // Navigation active view
  const [activeView, setActiveView] = useState<ActiveView>('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // States for list, loading and error
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default to 10 for clean Todoist rows
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global counts for sidebar items
  const [counts, setCounts] = useState({
    all: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
  });

  // Filter and Sort states (excluding search, which is in Header)
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>(undefined);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('DESC');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [todoToDeleteId, setTodoToDeleteId] = useState<number | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0);
    }, 400); // Fast response for quick find
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page and filters when view changes
  useEffect(() => {
    setCurrentPage(0);
    setCompletedFilter(undefined);
    setPriorityFilter(undefined);
  }, [activeView]);

  // Fetch counts for sidebar
  const fetchCounts = useCallback(async () => {
    try {
      const res = await api.getTodos({ page: 0, size: 10000 });
      const todayStr = new Date().toISOString().split('T')[0];
      
      const all = res.content.length;
      const completed = res.content.filter(t => t.completed).length;
      const pending = all - completed;
      const today = res.content.filter(t => !t.completed && t.dueDate && t.dueDate.startsWith(todayStr)).length;
      const upcoming = res.content.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).length;

      setCounts({ all, today, upcoming, completed, pending });
    } catch (err) {
      console.error('Không thể tải số lượng công việc:', err);
    }
  }, []);

  // Fetch todos depending on active view and filters
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Determine query filters based on active sidebar view
      let completedParam: boolean | undefined = undefined;
      let priorityParam: Priority | undefined = undefined;
      
      if (activeView === 'inbox') {
        completedParam = undefined;
      } else if (activeView === 'completed') {
        completedParam = true;
      } else if (activeView === 'high') {
        completedParam = undefined;
        priorityParam = 'HIGH';
      } else if (activeView === 'medium') {
        completedParam = undefined;
        priorityParam = 'MEDIUM';
      } else if (activeView === 'low') {
        completedParam = undefined;
        priorityParam = 'LOW';
      }

      // Apply extra filter overrides from the local Filters bar
      if (completedFilter !== undefined) {
        completedParam = completedFilter;
      }
      if (priorityFilter !== undefined) {
        priorityParam = priorityFilter;
      }

      // If Today or Upcoming view, retrieve all pending items and filter on client to preserve correct dates
      if (activeView === 'today' || activeView === 'upcoming') {
        const res = await api.getTodos({
          search: debouncedSearch,
          completed: false, // only pending tasks
          priority: priorityParam,
          page: 0,
          size: 10000, // retrieve all to filter
          sortBy,
          direction
        });

        let filtered = res.content;
        if (activeView === 'today') {
          filtered = res.content.filter(t => t.dueDate === todayStr);
        } else {
          filtered = res.content.filter(t => t.dueDate && t.dueDate > todayStr);
        }

        // Apply client-side pagination
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setTodos(filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
      } else {
        // Standard server-side pagination for other views
        const res = await api.getTodos({
          search: debouncedSearch,
          completed: completedParam,
          priority: priorityParam,
          page: currentPage,
          size: pageSize,
          sortBy,
          direction
        });

        setTodos(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối đến máy chủ API.');
    } finally {
      setLoading(false);
    }
  }, [activeView, debouncedSearch, completedFilter, priorityFilter, currentPage, pageSize, sortBy, direction]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, todos]);

  // Actions
  const handleToggleTodo = async (id: number) => {
    try {
      await api.toggleTodo(id);
      fetchTodos();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái.');
    }
  };

  const handleEditRequest = (todo: Todo) => {
    setTodoToEdit(todo);
    setIsModalOpen(true);
  };

  const handleAddNewRequest = () => {
    setTodoToEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = (id: number) => {
    setTodoToDeleteId(id);
  };

  const confirmDeleteTodo = async () => {
    if (todoToDeleteId === null) return;
    try {
      await api.deleteTodo(todoToDeleteId);
      if (todos.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchTodos();
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa công việc.');
    } finally {
      setTodoToDeleteId(null);
    }
  };

  const handleFormSubmit = async (request: TodoRequest) => {
    if (todoToEdit) {
      await api.updateTodo(todoToEdit.id, request);
    } else {
      await api.createTodo(request);
      if (activeView === 'completed') {
        setActiveView('inbox'); // Switch to inbox to see the new task
      }
      setCurrentPage(0);
    }
    fetchTodos();
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'today': return 'Hôm nay';
      case 'upcoming': return 'Sắp tới';
      case 'completed': return 'Đã hoàn thành';
      case 'high': return 'Ưu tiên Cao';
      case 'medium': return 'Ưu tiên Trung bình';
      case 'low': return 'Ưu tiên Thấp';
      default: return 'Tất cả';
    }
  };

  return (
    <div>
      {/* Red Header */}
      <header className="todoist-header">
        <div className="header-left">
          <button 
            type="button" 
            className="hamburger-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Đóng/Mở thanh Sidebar"
          >
            {/* Hamburger 3 line SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Quick Find Search Box */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm nhanh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Search SVG icon */}
            <svg className="search-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div className="header-right">
          <button 
            type="button" 
            className="header-add-btn" 
            onClick={handleAddNewRequest}
            title="Thêm công việc nhanh"
          >
            {/* Plus Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="todoist-layout">
        
        {/* Left Sidebar */}
        <aside className={`todoist-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-menu">
            <div 
              className={`sidebar-item ${activeView === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveView('inbox')}
            >
              <div className="sidebar-item-left">
                {/* Inbox Blue SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#246fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
                <span>Tất cả</span>
              </div>
              <span className="sidebar-count">{counts.all}</span>
            </div>

            <div 
              className={`sidebar-item ${activeView === 'today' ? 'active' : ''}`}
              onClick={() => setActiveView('today')}
            >
              <div className="sidebar-item-left">
                {/* Calendar Green SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#058527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <text x="12" y="18" fontSize="8" fill="#058527" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                    {new Date().getDate()}
                  </text>
                </svg>
                <span>Hôm nay</span>
              </div>
              <span className="sidebar-count">{counts.today}</span>
            </div>

            <div 
              className={`sidebar-item ${activeView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveView('upcoming')}
            >
              <div className="sidebar-item-left">
                {/* Upcoming Purple SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#692fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <polyline points="8 14 12 14 16 18"></polyline>
                </svg>
                <span>Sắp tới</span>
              </div>
              <span className="sidebar-count">{counts.upcoming}</span>
            </div>

            <div 
              className={`sidebar-item ${activeView === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveView('completed')}
            >
              <div className="sidebar-item-left">
                {/* Check Circle Grey/Green SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Đã hoàn thành</span>
              </div>
              <span className="sidebar-count">{counts.completed}</span>
            </div>
          </div>

          {/* Collapsible priority section */}
          <div className="sidebar-section-title">
            <span>Độ ưu tiên</span>
          </div>
          
          <div className="sidebar-menu">
            <div 
              className={`sidebar-item ${activeView === 'high' ? 'active' : ''}`}
              onClick={() => setActiveView('high')}
            >
              <div className="sidebar-item-left">
                <span className="priority-dot HIGH"></span>
                <span>Ưu tiên Cao</span>
              </div>
            </div>

            <div 
              className={`sidebar-item ${activeView === 'medium' ? 'active' : ''}`}
              onClick={() => setActiveView('medium')}
            >
              <div className="sidebar-item-left">
                <span className="priority-dot MEDIUM"></span>
                <span>Ưu tiên Trung bình</span>
              </div>
            </div>

            <div 
              className={`sidebar-item ${activeView === 'low' ? 'active' : ''}`}
              onClick={() => setActiveView('low')}
            >
              <div className="sidebar-item-left">
                <span className="priority-dot LOW"></span>
                <span>Ưu tiên Thấp</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Area */}
        <main className={`todoist-main ${sidebarCollapsed ? 'expanded' : ''}`}>
          
          {/* Main Title Section */}
          <div className="view-title-container">
            <h1 className="view-title">{getViewTitle()}</h1>
            {activeView === 'today' && (
              <span className="view-subtitle">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}</span>
            )}
          </div>

          {/* Stats Bar */}
          <TodoStats 
            total={counts.all}
            completed={counts.completed}
            pending={counts.pending}
          />

          {/* Sub Filters Toolbar (Sort & secondary filtering) */}
          <Filters
            completed={completedFilter}
            setCompleted={setCompletedFilter}
            priority={priorityFilter}
            setPriority={setPriorityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            direction={direction}
            setDirection={setDirection}
          />

          {/* Database connection error if any */}
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '4px', margin: '1rem 0', fontSize: '0.85rem' }}>
              <strong>Lỗi kết nối MySQL:</strong> {error}
            </div>
          )}

          {/* Todos List Component */}
          <TodoList
            todos={todos}
            loading={loading}
            totalPages={totalPages}
            totalElements={totalElements}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
            onToggle={handleToggleTodo}
            onEdit={handleEditRequest}
            onDelete={handleDeleteTodo}
            onAddTask={handleAddNewRequest}
          />

        </main>
      </div>

      {/* Popup Form Modal */}
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        todoToEdit={todoToEdit}
      />

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={todoToDeleteId !== null}
        title="Xác nhận xóa công việc"
        message="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDeleteTodo}
        onCancel={() => setTodoToDeleteId(null)}
      />
    </div>
  );
}

export default App;
