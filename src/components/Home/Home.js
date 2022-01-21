//libs
import React, { useState, useEffect } from "react";
import queryString from "query-string";
//assets
import addTaskIcon from "../../assets/add-task.svg";
import { ReactComponent as Tick } from "../../assets/tick.svg";
//components
import TaskList from "../TaskList/TaskList";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import Popup from "../../reusables/Popup/Popup";
//styles
import styles from "./Home.module.css";

const localStorageKeys = {
  taskData: "taskData",
  searchTerm: "searchTerm",
  filters: "filters",
};

const filterTypes = {
  completed: "completed",
  notCompleted: "notCompleted",
};

const setLocalStorageKey = (key, value) => {
  localStorage.setItem(key, value);
};

const pushFilterSearchUrl = (filters) => {
  window.history.pushState(
    null,
    "",
    `/?${queryString.stringify(
      { ...filters },
      {
        skipEmptyString: true,
      }
    )}`
  );
};

const getParsedQuery = () => {
  const searchQuery = window.location.search;
  const parsedQuery = queryString.parse(searchQuery, { parseBooleans: true });
  return parsedQuery;
};

const Home = () => {
  const [taskList, setTaskList] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    completed: true,
    notCompleted: true,
  });
  const [isOpenAddTaskPopup, setIsOpenAddTaskPopup] = useState(false);

  useEffect(() => {
    const localTaskData = JSON.parse(localStorage.getItem(localStorageKeys.taskData));
    const localSearchTerm = getParsedQuery().searchTerm;
    const localFilters = {
      notCompleted: getParsedQuery().not_completed,
      completed: getParsedQuery().completed,
    };
    setTaskList(localTaskData ?? {});
    setSearchTerm(localSearchTerm ?? "");
    setFilters(
      Object.values(localFilters).filter((value) => value !== undefined).length
        ? localFilters
        : {
            completed: true,
            notCompleted: true,
          }
    );
  }, []);

  const filteredTaskList = Object.values(taskList)?.filter((task) => {
    const { name: taskName, completed: taskCompleted } = task;
    return (
      taskName.includes(searchTerm) &&
      (filters.completed || filters.notCompleted) &&
      (taskCompleted === filters.completed || !taskCompleted === filters.notCompleted)
    );
  });

  const handleAddNewTask = (taskData) => {
    const currentValue = { ...taskList };
    const existingIds = Object.keys(currentValue);
    const nextId = existingIds.length ? Math.max(...existingIds) + 1 : 1;
    const nextValue = {
      ...currentValue,
      [nextId]: {
        id: nextId,
        ...taskData,
      },
    };
    setTaskList({ ...nextValue });
    setLocalStorageKey(localStorageKeys.taskData, JSON.stringify({ ...nextValue }));
  };

  const handleToggleTaskStatus = (id) => {
    const currentValue = { ...taskList };
    const taskData = currentValue[id];
    const nextValue = {
      ...currentValue,
      [id]: {
        ...taskData,
        completed: !taskData.completed,
      },
    };
    setTaskList({ ...nextValue });
    setLocalStorageKey(localStorageKeys.taskData, JSON.stringify({ ...nextValue }));
  };

  const handleChangeSearchTerm = (e) => {
    const searchTermInput = e.target.value.trim();
    setSearchTerm(searchTermInput);
    pushFilterSearchUrl({
      ...getParsedQuery(),
      searchTerm: searchTermInput,
    });
  };

  const handleFilterChange = (filterType) => {
    const filterState = { ...filters };
    filterState[filterType] = !filterState[filterType];
    setFilters({ ...filterState });
    pushFilterSearchUrl({
      ...getParsedQuery(),
      completed: filterState.completed,
      not_completed: filterState.notCompleted,
    });
  };

  const deleteTask = (id) => {
    const tasks = { ...taskList };
    delete tasks[id];
    setTaskList({ ...tasks });
    setLocalStorageKey(localStorageKeys.taskData, JSON.stringify({ ...tasks }));
  };

  const closeAddTaskPopup = () => setIsOpenAddTaskPopup(false);

  const openAddTaskPopup = () => setIsOpenAddTaskPopup(true);

  const triggerSearchBlur = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div className={`${styles.home} flex-column`}>
      <div className={styles.header}>My Tasks</div>
      <div className={styles.search}>
        <input
          className={styles.searchInput}
          onKeyDown={triggerSearchBlur}
          onBlur={handleChangeSearchTerm}
          placeholder="Type to search..."
          defaultValue={getParsedQuery().searchTerm}
        />
      </div>
      <div className={`${styles.filters} flex-center-center`}>
        <div
          className={`${styles.filterBlock} flex-align-center`}
          onClick={() => handleFilterChange(filterTypes.completed)}
        >
          <span className={`${styles.checkbox} flex-center-center`}>
            {filters.completed ? <Tick /> : null}
          </span>
          Completed
        </div>
        <div
          className={`${styles.filterBlock} flex-align-center`}
          onClick={() => handleFilterChange(filterTypes.notCompleted)}
        >
          <span className={`${styles.checkbox} flex-center-center`}>
            {filters.notCompleted ? <Tick /> : null}
          </span>
          Not Completed
        </div>
      </div>
      <div className={styles.taskList}>
        <TaskList
          taskList={filteredTaskList}
          deleteTask={deleteTask}
          toggleTaskStatus={handleToggleTaskStatus}
        />
      </div>
      <div className={`${styles.addIcon} flex-center-center`} onClick={openAddTaskPopup}>
        <img src={addTaskIcon} alt="add-task-button" />
      </div>
      <Popup open={isOpenAddTaskPopup} onClose={closeAddTaskPopup} popupClass={styles.popupClass}>
        <CreateTaskForm addTask={handleAddNewTask} closeForm={closeAddTaskPopup} />
      </Popup>
    </div>
  );
};

export default Home;
