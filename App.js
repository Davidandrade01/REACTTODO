
import './App.css';
import {useEffect, useState}from 'react'
import{BsTrash,BsBookmarkCheck,BsBookmarkCheckFill} from 'react-icons/bs'

const API=("http://localhost:5000/todos")
// Construção da função que pega os dados dos inputs e guarda em um dicionário
function App() {
  const[time, setTime]=useState("")
  const[title,setTitle]=useState("")
  const[todos,setTodos]=useState([])
  const[loading,setLoading]=useState("false")

  const handleSubmit= async(e)=>{
 e.preventDefault()
const todo={
  id:Math.random(),
  title:title,
  time:time,
  done:false
};

// a apartir do dicionário (em json) levaremos os dados para uma lista lida 
await fetch(API,{
  method:"POST",
  body:JSON.stringify(todo),
  headers:{
    "Content-Type":"application/json"
  }
   
})

setTodos((prevState)=>[...prevState,todo]) //atualização dos dados no setTodo

console.log(todo)
 setTitle("")
 setTime("")

  }

 // load Tasks on page load (method GET)
  // o useEffect aqui, mantém os dados na lista, 
  //independentemente da atualização de página

  useEffect(()=>{
    const loadData = async()=>{
      setLoading(true)

      const res= await fetch(API)
      .then(res => res.json())
      .then((data)=>data)
      .catch((err)=>console.log(err))

      setLoading(false)
      setTodos(res)
    }
    loadData()
    
  },[])

  // Esta função busca na lista (se o id for diferente do buscado"clicado" 
  //ele traz a lista com os elementos diferentes"os não eliminados")

  const handleDelete= async(id)=>{
    await fetch(API +"/"+ id,{
      method:"DELETE"
    })
    setTodos((prevState)=>prevState.filter((element)=>element.id !==id))
    }

    const handleCheck=async(todo)=>{
      todo.done=!todo.done
      const checkTask=await fetch(API +"/"+ todo.id,{
        method:"PUT",
        body:JSON.stringify(todo),
        headers:{
          "Content-Type":"application/json",
        }
      }) 
        setTodos((prevState)=> prevState.filter((e)=>(e.id === checkTask.id) ?(e=checkTask):e))

    }
 if (loading){
  return <p>Charging...</p>
 }

  return (
    <div className="App">
      <h2 className='todo-header'>Todo List</h2>
<form onSubmit={handleSubmit} action="">
  
        <div className='form-control'>
          <label htmlFor="title">
            <input type="text" onChange={(e)=>setTitle(e.target.value)} value={title} name='title'required placeholder='Title for your task' />
          </label>
        

        
          <label htmlFor="time">
            <input type="text" onChange={(e)=>setTime(e.target.value)} value={time} required   name='time' placeholder='Duration' />
          </label>
        

        <input type="submit" value={"Register"} />
        </div>
</form>

  <div className='list-todo'>
    <h2>Tasks:</h2>
    {todos.length === 0 && <p>Empty list...</p>} 
    {todos.map((element)=>(
      
    <li className='todo' key={element.id}><h3 className={element.done ? "todo-done" : ""}>{element.title}</h3><p>Duration:{element.time}</p>
     
      <span onClick={()=>handleCheck(element)}>

        {!element.done? <BsBookmarkCheck/>:<BsBookmarkCheckFill/>} {/* Esta lógica pergunta se os elementos do taskList
                                                                          já estão done. Como eles saem de lá com done:false
                                                                          o marcado só ficaria preenchido(BSBookCheckMarkFill) 
                                                                           como ele está false, apenas fica com check*/}
      </span>
      <span>
        {<BsTrash onClick={()=>handleDelete(element.id)}/>} {/*Daria errado passar a função direto(apenas handleDelete, 
                                                                assim a função espera o usuário clicar por conta da 
                                                                arow fcuntion e envia exatamento o id que 
                                                                quer deletar ao passar o paramentro:"element.id"). */}
      </span>
      <hr />
    </li>))
    
    
    }   

  </div>
    </div>
  );
}

export default App;
