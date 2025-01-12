import React, { memo, useCallback, useEffect, useState } from 'react'
import BoardTopbar from './BoardTopbar';
import BoardInterface from './BoardInterface';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../../store';
import { useMemo } from 'react';
import useApp from '../../hooks/useApp';
import AppLoader from '../../components/layout/AppLoader';



const BoardScreen = () => {

  const navigate = useNavigate();
  const {boardId }= useParams();
  const { boards , areBoardsFetched } = useStore();
  const { fetchBoard , deleteBoard } = useApp();

  const[data,setData] = useState(null);
  const[loading,setLoading] = useState(true);
  const[lastUpdated,setLastUpdataed] = useState(null);

  const board = useMemo( () => boards.find(  b => b.id ===  boardId ),[]);
  const boardData = useMemo( () => data,[data]);

  const handleUpdateLastUpdated = useCallback( () => setLastUpdataed(new Date().toLocaleString('en-US') ),[] );

  const handleFetch = async  () => {
    try{
      const boardData = await fetchBoard(boardId);
      if(boardData){
        const {lastUpdated , tabs} = boardData;
        setData(tabs);
        setLastUpdataed(lastUpdated.toDate().toLocaleString('en-US'));
      };
      setLoading(false);
    }
    catch(err){
      console.log(err);
    }
  }

  const handleDeleteBoard = useCallback(async () => {
    if (!window.confirm("Do you want to delete this board?")) return;
    try {
      setLoading(true);
      await deleteBoard(boardId);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  useEffect( () => {
    if(!areBoardsFetched || !board){
      navigate("/boards");
    }
    else{
      handleFetch();
    }
  },[])

  if(!board) return null;
  if(loading){ return <AppLoader />}
  if(!data) return <BoardsNotReady />

  return (
    <>
      <BoardTopbar 
      name={board.name} 
      color={board.color} 
      lastUpdated={lastUpdated}
      handleDelete={handleDeleteBoard}
      />
      
      <BoardInterface boardData={boardData}  boardId={boardId} updateLastUpdated={handleUpdateLastUpdated} />
    </>
  )
}

export default memo(BoardScreen);