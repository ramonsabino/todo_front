import "./App.css";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { CircularProgress, Button } from "@mui/material";

import { useState, useEffect } from "react";
import axios from "axios";
import { create } from "@mui/material/styles/createTransitions";

function App() {
  const Todos = ({ todos }) => {
    return (
      <div className="todos">
        {todos.map((todo) => {
          return (
            <div className="todo" key={todo.name}>
              <button
                onClick={() => modifyStatusTodo(todo)}
                className="checkbox"
                style={{ backgroundColor: todo.status ? "#71c0aa" : "white" }}
              ></button>
              <p
                style={{
                  textDecoration: todo.status ? "line-through 10px" : "none",
                }}
              >
                {todo.name}
              </p>
              <button
                onClick={() => handleEditButton(todo)}
                style={{ cursor: "pointer" }}
              >
                <AiOutlineEdit size={24} color={"#64697b"}></AiOutlineEdit>
              </button>
              <button
                onClick={() => deleteTodo(todo)}
                style={{ cursor: "pointer" }}
              >
                <AiOutlineDelete size={24} color={"#64697b"}></AiOutlineDelete>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  async function handleWithNewButton() {
    setLoading(false);
    setInputVisibility(!inputVisibility);
  }

  async function handleEditButton(todos) {
    setSelectTodo(todos);
    setInputVisibility(true);
    console.log("edit");
  }

  async function getTodos() {
    const response = await axios.get("http://localhost:4000/todos");
    setTodos(response.data);
  }

  async function createTodo() {
    setLoading(true);
    setInputVisibility(false);

    const todo = await axios.post("http://localhost:4000/todos", {
      name: inputValue,
    });
    getTodos();
    setLoading(false);
    setInputVisibility(!inputVisibility);
    setInputValue(todo.id);
  }

  async function editTodo() {
    const response = await axios.put("http://localhost:4000/todos", {
      id: selectTodo.id,
      name: inputValue,
    });
    setSelectTodo();
    setInputVisibility(false);
    getTodos();
    setInputValue("");
  }

  async function deleteTodo(todos) {
    const todo = await axios.delete(`http://localhost:4000/todos/${todos.id}`);
    getTodos();
  }

  async function modifyStatusTodo(todo) {
    const response = await axios.put("http://localhost:4000/todos", {
      id: todo.id,
      status: !todo.status,
    });
    getTodos();
  }

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectTodo, setSelectTodo] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1> Lista de Tarefas </h1>
        </div>
        <Todos todos={todos}></Todos>
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          style={{ display: inputVisibility ? "block" : "none" }}
          className="inputName"
        ></input>

        <button
          onClick={
            inputVisibility
              ? selectTodo
                ? editTodo
                : createTodo
              : handleWithNewButton
          }
          className="newTaskButton"
        >
          {loading ? <CircularProgress /> : "Nova tarefa"}
        </button>
      </header>
    </div>
  );
}

export default App;
