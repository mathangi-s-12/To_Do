//libs
import React from "react";
//styles
import styles from "./CreateTaskForm.module.css";

const CreateTaskForm = ({ addTask, closeForm }) => {
  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log([...e.target]);
    const newTaskObj = { createdAt: +new Date(), completed: false };
    //
    [...e.target].slice(0, -1).forEach((inputField) => {
      newTaskObj[inputField.id] = inputField.value.toString().trim();
    });
    addTask(newTaskObj);
    closeForm();
  };

  return (
    <form
      className={`${styles.form} flex-column flex-justify-space-between`}
      onSubmit={onFormSubmit}
    >
      <div className={styles.closeForm} onClick={closeForm}>
        x
      </div>
      <div className={styles.header}>What are you planning to do?</div>
      <div className={`${styles.inputField}`}>
        <label for="name">Give a short description here</label>
        <input id="name" type="text" pattern=".*[^ ].*" autoComplete="off" required />
      </div>
      <div className={`${styles.inputField}`}>
        <label for="timeInHrs">Set a time limit (hrs)</label>
        <input id="timeInHrs" type="number" autoComplete="off" />
      </div>
      <input className={styles.submitBtn} type="submit" value="Add it!" />
    </form>
  );
};

export default CreateTaskForm;
