import { FunctionComponent as FC, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Todo } from "./Interface/ITodo";
import InputField from "./components/InputField";
import SingleTodo from "./components/SingleTodo";
import "./App.scss";
import Axios from "axios";

function makeId(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

var userId: any = localStorage.getItem("user");

if (userId === null) {
  userId = makeId(32);
} else {
  userId = JSON.parse(userId);
}

localStorage.setItem("user", JSON.stringify(userId));

const App: FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [activeTodos, setActiveTodos] = useState<Array<Todo>>([]);
  const [completedTodos, setCompletedTodos] = useState<Array<Todo>>([]);

  const addTodo = (singleTodo: Todo) => {
    Axios.post(
      "https://us-central1-mantasvalentin-portfolio-4f88d.cloudfunctions.net/app/api/insert",
      {
        id: singleTodo.id,
        user: singleTodo.user,
        todo: singleTodo.todo,
        isDone: singleTodo.isDone,
        completed: singleTodo.completed,
      }
    ).then(() => {});
  };

  const updateTodo = (todo: Todo) => {
    Axios.put(
      "https://us-central1-mantasvalentin-portfolio-4f88d.cloudfunctions.net/app/api/update",
      {
        id: todo.id,
        todo: todo.todo,
        isDone: todo.isDone,
        completed: todo.completed,
      }
    ).then(() => {});
  };

  const deleteTodo = (todo: Todo) => {
    Axios.delete(
      `https://us-central1-mantasvalentin-portfolio-4f88d.cloudfunctions.net/app/api/delete/${todo.id}`
    ).then(() => {});
  };

  useEffect(() => {
    Axios.get(
      `https://us-central1-mantasvalentin-portfolio-4f88d.cloudfunctions.net/app/api/get/${userId}`
    ).then((response) => {
      setActiveTodos(response.data.filter((item: Todo) => !item.completed));
      setCompletedTodos(response.data.filter((item: Todo) => item.completed));
    });
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      let newTodo = {
        id: Date.now(),
        user: userId,
        todo: todo,
        isDone: false,
        completed: false,
      };

      setActiveTodos([...activeTodos, newTodo]);
      setTodo("");
      addTodo(newTodo);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = activeTodos;
    let completed = completedTodos;

    // Source Logic
    if (source.droppableId === "Active") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = completed[source.index];
      completed.splice(source.index, 1);
    }

    add.completed = !add.completed;
    updateTodo(add);

    // Destination Logic
    if (destination.droppableId === "Active") {
      active.splice(destination.index, 0, add);
    } else {
      completed.splice(destination.index, 0, add);
    }

    setActiveTodos(active);
    setCompletedTodos(completed);
  };

  return (
    <div className="w-screen h-screen bg-[#72bcff]">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="min-w-max w-screen h-screen max-sm:h-fit">
          <h1 className="text-center py-8 text-white text-5xl max-sm:text-3xl">
            TO-DO LIST
          </h1>
          <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
          <div className="flex max-sm:flex-col px-8 pt-6">
            <Droppable droppableId="Active">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-col flex-1 shadow-md p-4 mr-2 max-sm:mr-0 bg-[#008fff] rounded-2xl h-fit ${
                    snapshot.isDraggingOver ? "bg-[#0060fa]" : ""
                  }`}
                >
                  <div className="text-white text-3xl max-sm:text-2xl max-sm:text-center">
                    Active Tasks
                  </div>
                  {activeTodos.map((item, index) => (
                    <SingleTodo
                      index={index}
                      todos={activeTodos}
                      todo={item}
                      key={item.id}
                      setTodos={setActiveTodos}
                      updateTodo={updateTodo}
                      deleteTodo={deleteTodo}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="Completed">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-col flex-1 shadow-md p-4 ml-2 max-sm:ml-0 max-sm:my-4 bg-[#ff8400] rounded-2xl h-fit ${
                    snapshot.isDraggingOver ? "bg-[#c85100]" : ""
                  }`}
                >
                  <div className="text-white text-3xl max-sm:text-2xl max-sm:text-center">
                    Completed Tasks
                  </div>
                  {completedTodos.map((item, index) => (
                    <SingleTodo
                      index={index}
                      todos={completedTodos}
                      todo={item}
                      key={item.id}
                      setTodos={setCompletedTodos}
                      updateTodo={updateTodo}
                      deleteTodo={deleteTodo}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
