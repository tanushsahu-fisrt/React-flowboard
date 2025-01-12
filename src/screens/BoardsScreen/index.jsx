import { useEffect, useState } from "react";
import CreateBoardModal from "./CreateBoardModal";
import Topbar from "./TopBar";

import { Stack , Typography , Grid , IconButton , Box} from "@mui/material";
import NoBoards from "./NoBoards";
import BoardCard from "./BoardCard";
import useApp from "../../hooks/useApp";
import AppLoader from "../../components/layout/AppLoader";
import useStore from "../../store";


const BoardsScreen = () => {

    const { fetchBoards } = useApp();
    const { boards , areBoardsFetched} = useStore();

    const[showModal,setShowModal] = useState(false);
    const[loading,setLoading] = useState(true);

    useEffect( () => {
        if(!areBoardsFetched){ 
            fetchBoards(setLoading);
        }
        else{
            setLoading(false);
        }
    },[])

    if(loading) return <AppLoader />;

    return (
        <>
        <Topbar openModal= {() => setShowModal(true)}/>
        {showModal && <CreateBoardModal closeModal= {() => setShowModal(false)} /> }

        {/* <NoBoards /> */}

        { !boards.length ? <NoBoards /> : <Stack mt={5} px={3}>
            <Grid container spacing={4}>
                {boards.map( (board) => 
                    <BoardCard key={board.id} {...board}/>
                )}
            </Grid>
        </Stack>}
        </>
    )
}

export default BoardsScreen;