
const addTask = "add/type";
const deleteTask = "add/delete";

const initialState = {
    task: []
}


const taskReducer = (state = initialState, action) => {

    switch (action.type) {
        case addTask:
            return {
                ...state,
                task: [...state.task, action.payload]
            }

        case deleteTask:
            const updateTask = state.task.filter((curState, index) => index !== action.payload
            )
            return {
                ...state,
                task: [...state.task, updateTask]
            }
        default: return state

    }
}