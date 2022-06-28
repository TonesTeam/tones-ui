import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./LaunchPage.css";
import "common/style.css";
import { useEffect, useState } from "react";

var someError = false;
var forceStopped = false;
var finished = false;

var i = 0;
var width = 1;
function moveBar() {
    /* console.log("Error: " + someError + "/ Force stop" + fs); */
  if (i == 0) {
    i = 1;
    var progBar = document.getElementById("progress-bar");
    var id = setInterval(frame, 1000);
    function frame() {
        if(!someError && !forceStopped){
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                progBar!.style.background = "#6f8b6c";
                finished = true;
            }else {
                width++;
                progBar!.style.width = width + "%";
            }
        }
    }

  }
}

function toggleError(){
    someError = true;

    document.getElementById("fake-error")!.style.visibility = "hidden";
    document.getElementById("progress-bar")!.style.background = "#ae616a";
    // document.getElementById("comment-body")!.innerHTML += fillCommentSection(someError, forceStopped, finished);
    document.getElementById("comment-body")!.style.visibility =  "visible";
    document.getElementById("resume-btn")!.style.visibility = "visible"; 

    console.log("Some error: " + someError);
}

function errorHadler(){
    someError = false;

    document.getElementById("fake-error")!.style.visibility = "visible";
    document.getElementById("progress-bar")!.style.background = "#6191ae";
    //document.getElementById("comment-body")!.innerHTML += fillCommentSection(someError, forceStopped, finished);
    document.getElementById("comment-body")!.style.visibility =  "hidden";
    document.getElementById("resume-btn")!.style.visibility = "hidden"; 

    console.log("Resolving, some error: " + someError);
}

function forceStop(){
    forceStopped = true;

    document.getElementById("progress-bar")!.style.background = "#ddd";
    document.getElementById("comment-body")!.style.visibility =  "visible";

    console.log("Force stopped: " + forceStopped);
}

function resolveComment(){
    if(someError){
        document.getElementById("fake-error")!.style.visibility = "hidden";
        document.getElementById("progress-bar")!.style.background = "#ae616a";
        document.getElementById("comment-body")!.style.visibility =  "visible";
        document.getElementById("resume-btn")!.style.visibility = "visible"; 
    
/*          return(
            <div>
                <h4 id="error-header">Some error occured! Please follow the guide below to detect and fix the error.</h4>
                <ol id="error-guide">
                    <li>Check if any slots are displaced. If any - fix the placing.</li>
                    <li>Make sure that sealing slots cover is closed.</li>
                    <li>Here will be a more precise fixing guide based on the type of error.</li>
                    <li>Or not. In that case, pretend like this is not your fault and act casual.</li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia sunt eaque.</li>
                </ol>
            </div>
        ); */
    }else if(forceStopped){
        document.getElementById("progress-bar")!.style.background = "#ddd";
        document.getElementById("comment-body")!.style.visibility =  "visible";
        /* return(
            <div>
                <h4 id="error-header">Protocol have been force-stopped. It cannot be resumed, but you can launch it again.</h4>
                <button><a href="/list">Go to Protocol List</a></button>
            </div>
        ) */
    }
    else if(finished){
       /*  return(
            <div>
                <h4>Protocol have successfully finished!</h4>
                <button><a href="/list">Go to Protocol List</a></button>
            </div>
        ) */
    }
}

export default function LaunchPage() {

    const [se] = useState(someError);
    const [fn] = useState(finished);
    const [fs] = useState(forceStopped);

    useEffect(() => {
        moveBar()
    })
    
    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="progress-container">
                    <div>
                        <h2><i>Approximate protocol duration: 4 minutes</i></h2>
                    </div>

                    <div id="progress">
                        <div id="progress-bar"></div>
                    </div>
                </div>

                <div className="footer">
                    <div id="comment-body">
{/*                         {fn ? (
                            <div>Finished</div>
                        ) : (
                            <div>Not finished</div>
                        )}

                        {fs ? (
                            <div>Force stopped</div>
                        ) : (
                            <div>Not force stopped</div>
                        )}
                        {se ? (
                            <div>Some error</div>
                        ) : (
                            <div>Not some error</div>
                        )} */}
                    </div> {/* to be filled according to current status */}

                    <div className="btn-panel">
                        <button onClick={() => forceStop()} id="stop-btn">Force stop</button>
                        <button onClick={() => toggleError()} id="fake-error">Toggle fake error</button>
                        <button onClick={() => errorHadler()} id="resume-btn">Resume</button>

{/*                         <button onClick={() => setForceStop(true)} id="stop-btn">Force stop</button>
                        <button onClick={() => setError(true)} id="fake-error">Toggle fake error</button>
                        <button onClick={() => setError(false)} id="resume-btn">Resume</button> */}
                    </div>  
                </div>
            </div>
        </>
    );
}