import { collection, addDoc, serverTimestamp, 
    getDocs , query , orderBy, doc , getDoc , updateDoc,
    deleteDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import useStore from "../store";
import { useNavigate } from "react-router-dom";


const useApp = () => {

    const navigate= useNavigate();
    const { boards , addBoard, setBoards , setToastr } = useStore();
    const { currentUser : {uid}, } = getAuth();
    const boardColRef = collection(db, `users/${uid}/boards`);

    const deleteBoard = async (boardId) => {
        try {
          // delete the doc from the DB
          const docRef = doc(db, `users/${uid}/boards/${boardId}`);
          await deleteDoc(docRef);
    
          // update the boards in the store
          const tBoards = boards.filter((board) => board.id !== boardId);
          setBoards(tBoards);
    
          // navigate to the boards screen
          navigate("/boards");
        } catch (err) {
          setToastr("Error deleting the board");
          throw err;
        }
      };

    const updateBoardData = async (boardId, tabs) => {
        const docRef = doc(db, `users/${uid}/boardsData/${boardId}`);
        try {
          await updateDoc(docRef, { tabs , lastUpdated : serverTimestamp() });
        } catch (err) {
            setToastr('Error Updating Board');
          throw err;
        }
    };

    const createBoard = async ({name, color}) => {
        try {
            const doc =  await addDoc(boardColRef, {
                name,
                color,
                createdAt: serverTimestamp(),
            });
            
            addBoard({name,color,createdAt: new Date().toLocaleString("en-US") , id : doc.id });
        } catch(err) {
            console.error('Error creating board:', err);
            throw err;
        }
    };

    const fetchBoard = async (boardId) => {
        const dorRef = doc(db,`users/${uid}/boardsData/${boardId}`)
        try{
            const doc = await getDoc(dorRef);
            if(doc.exists){
                return doc.data();
            }
            else{
                return null;
            }
        }
        catch(err){
            setToastr('Error fetching board');
            throw err;
        }
    }

    const fetchBoards = async (setLoading) => {
        const q = query(boardColRef , orderBy("createdAt",'desc'))
        try{
            const querySnapshot = await getDocs(q);
            const boards = querySnapshot.docs.map( (doc) => ({
                ...doc.data(),
                id : doc.id,
                createdAt: doc.data().createdAt.toDate().toLocaleString("en-US"),
            }));

            setBoards(boards);
            
        }
        catch(err){
            setToastr('Error fetching boards');
            throw err;
        }
        finally {
            if(setLoading) setLoading(false);
        }
    }

    return { createBoard , fetchBoards , fetchBoard , updateBoardData ,deleteBoard};
}

export default useApp;