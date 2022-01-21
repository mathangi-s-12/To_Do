//libs
import React from "react";
//styles
import styles from "./TaskList.module.css";
//assets
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

const TaskList = ({ taskList, deleteTask, toggleTaskStatus }) => {
  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  const handleToggleTaskStatus = (id) => {
    toggleTaskStatus(id);
  };

  return (
    <div className={`${styles.taskList} flex-column flex-align-center`}>
      {taskList?.map((task) => {
        const date = new Date(task.createdAt);

        return (
          <div
            key={task.id}
            className={`${styles.taskRow} ${
              task.completed ? styles.completed : styles.notCompleted
            } flex-row`}
          >
            <div
              className={`${styles.circleCheckbox} ${task.completed ? styles.completedCheck : ""}`}
              onClick={() => handleToggleTaskStatus(task.id)}
            ></div>
            <div>{task.name}</div>
            <div>{task.timeInHrs || "--"} hr</div>
            <div className="flex-center-center">{date.toLocaleString()}</div>
            <div
              onClick={() => handleDeleteTask(task.id)}
              className={`${styles.deleteIcon} flex-center-center`}
            >
              <DeleteIcon />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
