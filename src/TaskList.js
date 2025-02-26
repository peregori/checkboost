// TaskList.js
import React, { useState, useEffect } from "react";
import { FaPlay, FaStop, FaCheckSquare } from 'react-icons/fa';

function TaskList({ list, onClearList, onSelect, onCompleteTask, isSelected, darkMode }) {
  const [taskTimers, setTaskTimers] = useState({});
  const [listTitle, setListTitle] = useState(list.name || "");
  const [tasks, setTasks] = useState(list.tasks || []);

  useEffect(() => {
    setTasks(list.tasks);
  }, [list.tasks]);

  const handleStartTimer = (taskIndex) => {
    setTaskTimers((prevTimers) => ({
      ...prevTimers,
      [taskIndex]: {
        startTime: Date.now(),
        elapsedTime: tasks[taskIndex].timeSpent || 0,
      },
    }));
  };

  const handleStopTimer = (taskIndex) => {
    if (taskTimers[taskIndex]) {
      const currentTime = Date.now();
      const elapsedTime =
        taskTimers[taskIndex].elapsedTime +
        (currentTime - taskTimers[taskIndex].startTime) / 60000; // convert to minutes

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].timeSpent = elapsedTime;

      setTaskTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        delete updatedTimers[taskIndex];
        return updatedTimers;
      });

      setTasks(updatedTasks);
    }
  };

  const handleCompleteTask = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].completed = true;

    // Move the completed task to the bottom
    const completedTask = updatedTasks.splice(taskIndex, 1)[0];
    updatedTasks.push(completedTask);

    setTasks(updatedTasks); // Update the local task state with reordered tasks
    if (onCompleteTask) onCompleteTask(taskIndex); // Update the parent state (if callback provided)
  };

  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}h`;
  };

  return (
    <div className={`task-list ${isSelected ? "selected" : ""} ${darkMode ? "dark-mode" : ""}`} onClick={onSelect}>
      <div className="task-list-header">
        <input
          type="text"
          className="list-title-input"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          placeholder="Add title"
        />
        <button className="clear-list-button" onClick={(e) => {
          e.stopPropagation(); // Prevent triggering list selection when clearing
          onClearList();
        }} title="Clear">
          Clear
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-info">
              <span className={`task-name ${task.completed ? "task-completed" : ""}`}>
                {task.name}
              </span>
              <div className="task-actions">
                <span className="time-spent">
                  {formatTimeSpent(task.timeSpent || 0)}
                </span>
                {task.completed ? (
                  <button className="timer-button completed-button">
                    <FaCheckSquare />
                  </button>
                ) : taskTimers[index] ? (
                  <button
                    className="timer-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStopTimer(index);
                      handleCompleteTask(index);
                    }}
                  >
                    <FaStop />
                  </button>
                ) : (
                  <button
                    className="timer-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTimer(index);
                    }}
                  >
                    <FaPlay />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
