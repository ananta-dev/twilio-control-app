import { useState, useEffect } from "react";

function App() {
    return (
        <div>
            <List />
        </div>
    );
}

const List = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");

    const fetchTodos = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos`);
        const retrievedTodos = await res.json();
        console.log(retrievedTodos);
        setTodos(retrievedTodos);
    };

    const addTodo = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ desc: text, done: false }),
        });

        fetchTodos();
        setText("");
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const itemList = todos.map(todo => (
        <Item key={todo._id} todo={todo} fetchTodos={fetchTodos} />
    ));

    return (
        <div className='ui card'>
            <div className='content'>
                <div className='header'>Todo List in 30 min</div>
            </div>
            <div className='content'>
                <div className='ui relaxed divided list'>{itemList}</div>
            </div>
            <div className='extra content'>
                <div className='fluid ui action input'>
                    <input
                        type='text'
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                        }}
                    />
                    <button
                        className='ui teal right labeled icon button'
                        onClick={addTodo}
                    >
                        <i className='plus icon'></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

const Item = props => {
    const { done, desc, _id } = props.todo;

    const deleteTodo = async () => {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${_id}`, {
            method: "DELETE",
        });
        props.fetchTodos();
    };

    const toggleDone = async () => {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ done: !done, desc }),
        });
        props.fetchTodos();
    };

    return (
        <div className='item'>
            {done ? (
                <i
                    className='left floated green check square outline icon'
                    onClick={toggleDone}
                ></i>
            ) : (
                <i
                    className='left floated square outline icon'
                    onClick={toggleDone}
                ></i>
            )}
            {desc}
            <i
                className='right floated red trash icon'
                onClick={deleteTodo}
            ></i>
        </div>
    );
};

export default App;
