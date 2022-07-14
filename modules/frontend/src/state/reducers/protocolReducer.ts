type Action = {
    type: string
}

const reducer = (state: boolean = false, action: Action) => {
    switch (action.type) {
        case "ONGOING":
            return !state;
        case "ERROR":
            return !state;    
        default:
            return state;
    }
}

export default reducer