import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Todo } from "../../Interface/ITodo";
import { Draggable } from "react-beautiful-dnd";
import "./index.scss";

interface Props {
  index: number;
  todo: Todo;
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
}

const SingleTodo: React.FC<Props> = ({
  index,
  todo,
  todos,
  setTodos,
  updateTodo,
  deleteTodo,
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();

    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo))
    );
    setEdit(false);

    let newTodo = todos.filter((todo) => todo.id === id)[0];
    newTodo.todo = editTodo;
    updateTodo(newTodo);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));

    let newTodo = todos.filter((todo) => todo.id === id)[0];
    deleteTodo(newTodo);
  };

  const handleDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );

    let newTodo = todos.filter((todo) => todo.id === id)[0];
    newTodo.isDone = !newTodo.isDone;
    updateTodo(newTodo);
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`flex shadow-md p-5 mt-4 bg-[#eeff6b] rounded-xl opacity-95 scale-100 hover:opacity-100 ${
            snapshot.isDragging ? "shadow-2xl" : ""
          }`}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="flex-1 truncate pl-2 rounded-xl focus:outline-none"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="flex-1 truncate pl-2">{todo.todo}</s>
          ) : (
            <span className="flex-1 truncate pl-2">{todo.todo}</span>
          )}
          <div className="flex">
            <span
              className="ml-2 text-2xl cursor-pointer"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span
              className="ml-2 text-2xl cursor-pointer"
              onClick={() => handleDelete(todo.id)}
            >
              <AiFillDelete />
            </span>
            <span
              className="ml-2 text-2xl cursor-pointer"
              onClick={() => handleDone(todo.id)}
            >
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
