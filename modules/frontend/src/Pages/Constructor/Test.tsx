import NavigationBar from "NavigationBar/NavigationBar"
import { DragDropContext } from "react-beautiful-dnd"

export default function Test(){

    const tests = {
        'task1':{id:1, content:'abs'},
        'task2':{id:2, content:'abs'},
        'task3':{id:3, content:'abs'},
        'task4':{id:4, content:'abs'},
        'task5':{id:5, content:'abs'}
    }
    
    return(
        <>
        <NavigationBar />
        <div className="font-rb" id="main">
        <div id='container'>
            <div id="workspace">
                <div className="options">
                    <button className="construct-btn" id="cb-washing"><span className="fas fa-water"></span></button>
                    <button className="construct-btn" id="cb-reagent"><span className="fas fa-flask"></span></button>
                    <button className="construct-btn" id="cb-temperat"><span className="fas fa-temperature-low"></span></button>
                </div>

                <div id="block-edit">
                </div>

                <div className="options">
                    <button className="construct-btn" id="cb-save"><span className="fas fa-download"></span></button>
                    <button className="construct-btn" id="cb-settings"><span className="fas fa-wrench"></span></button>
                    <button className="construct-btn" id="cb-info"><span className="fas fa-info"></span></button>
                </div>

            </div>

            <div id="timeline">
                
                
            </div>
                </div>
            </div>

        </>
    )
}