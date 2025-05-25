import { useState } from "react";
import "./App.css";

function App() {
  
const [todo, setTodo] = useState("");
const [todoList, setTodoList] = useState<String[]>([]);

//array : []
//object : {}
//array of objects : [{}, {}, {}]

function handleTodo(e:React.SyntheticEvent) {
  setTodo(e.target.value)
}

function handleTodoList() {

  setTodoList([...todoList, todo])
  setTodo("")
  // console.log(todoList)
}

function handleDeleteTodo(index: number) {
 setTodoList(todoList.filter((_, i) => i != index))

}
function handleEditTodo(index: number) { 
  if (index === undefined || index === null) {
    console.log("Todo not found");
    return;
  }

  setTodo(todoList[index]);
}


  return (
    <>
      <div>
        {/* <textarea name="" id=""></textarea> */}

        {/* <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} /> */}
        <input type="text" value={todo} onChange={handleTodo} />
        <button onClick={handleTodoList}>Add</button>
      </div>
      <div>
        List
        <ul>
          {todoList.map((todo, index) => (
              <li key={index}>{todo}   <button onClick={() => handleDeleteTodo(index)}>Delete</button>
              <button onClick={() => handleEditTodo(index)}>Edit</button>
              </li>
            
          ))
}

        </ul>
      </div>
    </>
  );
}

export default App;
