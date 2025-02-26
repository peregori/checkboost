// App.js
import React, { useState } from "react";
import "./App.css";
import TaskList from "./TaskList";
import Analytics from "./Analytics";
import { FaSun, FaMoon } from 'react-icons/fa';
import Switch from "react-switch";

function App() {
  const [lists, setLists] = useState([
    { name: '', tasks: [] },
    { name: '', tasks: [] },
    { name: '', tasks: [] }
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedListIndex, setSelectedListIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");

  const handleAddTask = () => {
    if (selectedListIndex !== null && newTask.trim()) {
      const updatedLists = [...lists];
      updatedLists[selectedListIndex].tasks.push({
        name: newTask.trim(),
        timeSpent: 0,
        completed: false
      });
      setLists(updatedLists);
      setNewTask("");
    }
  };

  const handleClearList = (listIndex) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].tasks = [];
    setLists(updatedLists);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleCompleteTask = (listIndex, taskIndex) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].tasks[taskIndex].completed = true;

    // Move the completed task to the bottom of the list
    const completedTask = updatedLists[listIndex].tasks.splice(taskIndex, 1)[0];
    updatedLists[listIndex].tasks.push(completedTask);

    setLists(updatedLists);
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="header-container">
        <h1>CheckBoost</h1>
        <div className="tabs-container">
          <button className={`tab ${activeTab === "tasks" ? "active" : ""}`} onClick={() => setActiveTab("tasks")}>
            Tasks
          </button>
          <button className={`tab ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            Analytics
          </button>
        </div>
      </header>
      <main>
        {activeTab === "tasks" && (
          <div>
            <div className="top-bar wide-bar">
              <div className="add-task-bar">
                <input
                  type="text"
                  className="task-input-wide"
                  placeholder="New Task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddTask();
                    }
                  }}
                />
                <button className="add-task-embedded" onClick={handleAddTask} disabled={selectedListIndex === null}>
                  ➜
                </button>
              </div>
            </div>
            <div className="lists-container-wrapper">
              <div className="lists-container responsive-lists">
                {lists.map((list, index) => (
                  <TaskList
                    key={index}
                    list={list}
                    onClearList={() => handleClearList(index)}
                    onSelect={() => setSelectedListIndex(index)}
                    onCompleteTask={(taskIndex) => handleCompleteTask(index, taskIndex)}
                    isSelected={selectedListIndex === index}
                    darkMode={darkMode}  // Added this line to pass darkMode prop to TaskList
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "analytics" && <Analytics lists={lists} darkMode={darkMode} />}
      </main>
      <div className="theme-switch-container bottom-right">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          uncheckedIcon={<div className="icon-container"><FaSun /></div>}
          checkedIcon={<div className="icon-container"><FaMoon /></div>}
          offColor="#f3f0d9"
          onColor="#282c34"
        />
      </div>
    </div>
  );
}

export default App;
