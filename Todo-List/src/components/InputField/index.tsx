import { FunctionComponent as FC, useRef } from "react";
import "./index.scss";

interface props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

const InputField: FC<props> = ({ todo, setTodo, handleAdd }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="px-8 flex justify-center items-center"
      onSubmit={(e) => {
        handleAdd(e);
        inputRef.current?.blur();
      }}
    >
      <input
        type="text"
        placeholder="Enter a Task"
        value={todo}
        ref={inputRef}
        onChange={(e) => setTodo(e.target.value)}
        className="flex-1 py-5 px-8 rounded-full text-xl border-none shadow-md focus:outline-none"
      />
      <button
        type="submit"
        className="flex-none ml-2 w-16 h-16 rounded-full duration-200 opacity-80 hover:opacity-100 active:scale-75 hover:scale-105 bg-[#008fff] text-white shadow-md"
      >
        ADD
      </button>
    </form>
  );
};

export default InputField;
