import { Grid } from "@mui/material";
import BoardTab from "./BoardTab";
import AddTaskModal from "./AddTaskModal";
import { useState, useEffect, useCallback } from "react";
import useApp from "../../hooks/useApp";
import  { DragDropContext }  from "react-beautiful-dnd";
import AppLoader from "../../components/layout/AppLoader";
import useStore from "../../store";

const statusMap = {
  todos: "Todos",
  inProgress: "In Progress",
  completed: "Completed",
};

const BoardInterface = ({ boardData, boardId , updateLastUpdated }) => {

  const[loading,setLoading] = useState(false);
  const [addTaskTo, setAddTaskTo] = useState("");
  const [tabs, setTabs] = useState(structuredClone(boardData));
  const { updateBoardData } = useApp();
  const { setToastr } = useStore();

  const handleUpdateBoardData = async (dClone) => {
    setLoading(true);
    await updateBoardData(boardId,dClone);
    setTabs(dClone);
    updateLastUpdated();
    setToastr('Board updated!')
  }

  const handleRemoveTask = useCallback(
    async (tab, taskId) => {
      const dClone = structuredClone(tabs);
      const taskIdx = dClone[tab].findIndex((t) => t.id === taskId);
      dClone[tab].splice(taskIdx, 1);

      try {
        handleUpdateBoardData(dClone);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [tabs]
  );

  const handleAddTask = async (text) => {
    if (!text.trim()) return setToastr("Task cannot be empty!"); 
    const dClone = structuredClone(tabs);
    dClone[addTaskTo].unshift({ text, id: crypto.randomUUID() });
    try {
      handleUpdateBoardData(dClone);
      setAddTaskTo("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddTaskModal = useCallback( (status) => setAddTaskTo(status) ,[]);

  const handleDnd = async ({ source, destination }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const dClone = structuredClone(tabs);

    // remove the task from tab 1
    const [draggedTask] = dClone[source.droppableId].splice(source.index, 1);

    // add it to the tab 2
    dClone[destination.droppableId].splice(destination.index, 0, draggedTask);
    try {
        handleUpdateBoardData(dClone);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  if(loading) return <AppLoader />;
  
  return (
    <>
      {!!addTaskTo && (
        <AddTaskModal
          tabName={statusMap[addTaskTo]}
          onClose={() => setAddTaskTo("")}
          addTask={handleAddTask}
          loading= {loading}
        />
      )}

      <DragDropContext onDragEnd={handleDnd}>

      <Grid container px={4} spacing={2} mt={2}>
        {Object.keys(statusMap).map((status) => (
            <BoardTab
            tasks={tabs[status] || []}
            status={status}
            openAddTaskModal={handleOpenAddTaskModal}
            key={status}
            name={statusMap[status]}
            removeTask= {handleRemoveTask}
            />
        ))}
      </Grid>
      </DragDropContext>
    </>
  );
};

export default BoardInterface;
