import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const API_URL = 'http://localhost:5014/api/todos';   // backend portu

  useEffect(() => {
    axios.get(API_URL).then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    const res = await axios.post(API_URL, { title, isCompleted: false });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  const toggle = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, { id, title: 'x', isCompleted: !completed });
    setTodos(todos.map(t => t.id === id ? { ...t, isCompleted: !completed } : t));
  };

  const remove = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">FullStack Todo App</h1>
      <div className="input-group mb-4">
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="Yeni todo ekle..."
        />
        <button className="btn btn-primary" onClick={addTodo}>Ekle</button>
      </div>

      <ul className="list-group">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span
              style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
              onClick={() => toggle(todo.id, todo.isCompleted)}
            >
              {todo.title}
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => remove(todo.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;