import { useEffect, useState } from "react";

const URL = "http://localhost:4000";

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(`${URL}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  function handleAdd() {
    //update the value in the backend
    fetch(`${URL}/todos`, {
      method: "POST",
      body: JSON.stringify({
        content: input,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([
          ...todos,
          {
            id: data.id,
            content: input,
          },
        ]);
      });
  }

  function handleDelete(todo){
    
      setTodos((prev) => {
        const temp = [...prev];
        return temp.filter((t) => {
          if (t.id === todo.id) return false;
          return true;
        });
      });

      fetch(`${URL}/todos/${todo.id}`, {
        method: "DELETE",
      });
    }
  

  return (
    <div className="App">
      <div>
        {todos.map((todo) => {
          return (
            <div key={todo.id}>
              <span>{todo.content}</span>
              <button
                onClick={()=>{handleDelete(todo)}}
              >
                DELETE
              </button>
              <EditTodo id={todo.id} setTodos={setTodos}/>
              <br />
              <br />
            </div>
          );
        })}
      </div>
      <div>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button onClick={handleAdd}>ADD TODO</button>
      </div>
    </div>
  );
}

function EditTodo({id,setTodos}){
  const [input,setInput] = useState("");
  function handleEdit(){
    fetch(`${URL}/todos/${id}`,{
      method: "PATCH",
      body: JSON.stringify({
        content: input
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(res=>res.json())
    .then(data=>{
      setTodos(prev=>{
        return prev.map(t=>{
          if(t.id===id) return {
            ...t,
            content: data.content
          }
          return t
        })
      })
    })
  }
  return <div>
    <input value={input} onChange={(e)=>{
      setInput(e.target.value);
    }}/>
    <button onClick={handleEdit}>EDIT</button>
  </div>
}

export default App;
