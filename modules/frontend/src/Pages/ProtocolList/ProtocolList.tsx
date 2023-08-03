import { useEffect, useState } from "react";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";
import { getComparator } from "sharedlib/collection.util";
import { getRequest, makeRequest } from "common/util";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAppSelector, useAppDispatch } from "state/hooks";
import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./ProtocolList.css";

function Protocol(props: any) {
  let navigate = useNavigate();
  const [open, setActive] = useState(false);
  const [div, setDiv] = useState<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  let disableLaunch = useAppSelector((state) => state.isRunning);

  let protocolStatus: string;
  let protoInList = useAppSelector((state) => state.protocols).find(
    (e) => e.protocol.id == props.id
  );
  if (protoInList != undefined) {
    switch (protoInList.status) {
      case "ONGOING":
        protocolStatus = "Ongoing";
        break;
      case "ERROR":
        protocolStatus = "Error occured";
        break;
      case "FINISHED":
        protocolStatus = "Finished";
        break;
      default:
        protocolStatus = "Undefined";
    }
  } else if (useAppSelector((state) => state.protocols).length == 0) {
    protocolStatus = "Ready to launch";
  } else {
    protocolStatus = "Launch prohibited";
  }

  return (
    <div className={`protocol ${open ? "open" : ""}`} onClick={() => setActive(!open)}>
      <div className={classNames("protocol-general", { active: open })}>
        <div className="info-cell-container">
          <div className="info-cell">
            <p className="label">ID: </p>
            <p>{props.id}</p>
            <span className="launch-status">{protocolStatus}</span>
          </div>
          <div className="info-cell">
            <p className="label">Name: </p>
            <p>{props.name}</p>
          </div>
          <div className="info-cell">
            <p className="label">Author: </p>
            <p>{props.authorName}</p>
          </div>
          <div className="info-cell">
            <p className="label">Date of creation: </p>
            <p>{props.creationDate}</p>
          </div>
        </div>
      </div>

      <div
        ref={(div) => setDiv(div)}
        className="protocol-body"
        style={{ maxHeight: open ? `${div?.scrollHeight}px` : 0 }}
      >
        <div className="protocol-body-content">
          <div>
            <p>
              Description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat,
              repellendus sit! Cum numquam eveniet vel a hic pariatur quod. Cumque quibusdam magnam
              odio commodi{" "}
            </p>
          </div>

          <div className="protocol-options">
            <div className="protocol-options">
              <button
                className={`proto-btn ${disableLaunch ? "unavail" : "avail"}`}
                onClick={() => navigate(`/prepare/${props.id}`)}
              >
                <i className="fas fa-play"></i>Prepare to Launch
              </button>

              <button className="proto-btn">
                <i className="fas fa-code-branch"></i>Use as template
              </button>
            </div>

            <div className="protocol-options">
              <button
                className="proto-btn"
                onClick={() => navigate(`/create/protocol/${props.id}`)}
              >
                {/* <a href={`/launch/${props.id}`} onClick={() => navigate(`/edit/protocol/${props.id}`)}> */}
                <i className="fas fa-puzzle-piece"></i>Edit
                {/* </a> */}
              </button>

              <button
                className="proto-btn"
                onClick={() =>
                  makeRequest("DELETE", `/protocol/${props.id}`).then(() => props.listInitializer())
                }
              >
                <i className="fas fa-trash-alt"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="arrow">
          <div className="right-bar"></div>
          <div className="left-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolList() {
  const [protocols, setProtocols] = useState<ProtocolDto[]>([]);

  const listInitilizer = () => {
    getRequest<ProtocolDto[]>("/protocols").then((r) => setProtocols(r.data));
  };
  useEffect(listInitilizer, []);

  const [filterInput, setfilterInput] = useState("");
  let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    var lowerCase = e.target.value.toLowerCase();
    setfilterInput(lowerCase);
  };

  function filterAndSort() {
    let filteredList = protocols.filter((e) =>
      filterInput === "" ? e : e.name.toLowerCase().includes(filterInput.toLowerCase())
    );
    let sortedList = filteredList.sort(getComparator((e) => e.creationDate.getTime())).reverse();
    return sortedList;
  }

  return (
    <>
      <NavigationBar selectedItem="Protocol List" />
      <div id="main">
        <div className="page-header">
          <h2>Protocol List</h2>
          <input
            value={filterInput}
            type="text"
            className="search-bar"
            placeholder="🔎 Search for protocols..."
            onChange={inputHandler}
          ></input>
        </div>
        <div className="protocol-list">
          {filterAndSort().map(function (protocol) {
            return (
              <Protocol
                listInitializer={listInitilizer}
                id={protocol.id}
                key={protocol.id}
                name={protocol.name}
                authorName={protocol.author}
                creationDate={protocol.creationDate.toLocaleDateString()}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
