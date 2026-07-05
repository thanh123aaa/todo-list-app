import type { PageResponse, Todo, TodoRequest, Priority } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/todos';

export interface FetchTodosParams {
  search?: string;
  completed?: boolean;
  priority?: Priority;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export const api = {
  async getTodos(params: FetchTodosParams = {}): Promise<PageResponse<Todo>> {
    const url = new URL(API_BASE_URL);
    
    if (params.search) url.searchParams.append('search', params.search);
    if (params.completed !== undefined) url.searchParams.append('completed', String(params.completed));
    if (params.priority) url.searchParams.append('priority', params.priority);
    if (params.page !== undefined) url.searchParams.append('page', String(params.page));
    if (params.size !== undefined) url.searchParams.append('size', String(params.size));
    if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
    if (params.direction) url.searchParams.append('direction', params.direction);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Lỗi khi tải danh sách công việc.');
    }
    return response.json();
  },

  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Lỗi khi tải chi tiết công việc ID: ${id}`);
    }
    return response.json();
  },

  async createTodo(request: TodoRequest): Promise<Todo> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Lỗi khi tạo công việc mới.');
    }
    return response.json();
  },

  async updateTodo(id: number, request: TodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi khi cập nhật công việc ID: ${id}`);
    }
    return response.json();
  },

  async toggleTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi cập nhật trạng thái công việc ID: ${id}`);
    }
    return response.json();
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi xóa công việc ID: ${id}`);
    }
  }
};
