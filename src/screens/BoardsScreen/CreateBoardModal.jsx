import { Typography , Stack  , Dialog, IconButton, TextField, Box, Button} from "@mui/material";
import ModalHeader from "../../components/layout/ModalHeader";
import { colors } from "../../theme";
import { useState } from "react";
import useApp from "../../hooks/useApp";

const CreateBoardModal = ({closeModal}) => {

    const { createBoard } = useApp();
 
    const[name,setName] = useState('');
    const[color,setColor] = useState(0);
    const[loading,setloading] = useState(false);

    const handleCreate = async () => {
        
        try{
            setloading(true);
            await createBoard({name,color});
            closeModal();
        }
        catch(err){
            setloading(false);
            console.log(err);
        }
    }


    return (
        <Dialog  open fullWidth maxWidth="xs" onClose={closeModal} >
            <Stack p={2}>
               <ModalHeader title="Create Board !" onClose={closeModal} />
               <Stack my={5} spacing={3}>
                    <TextField 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    label="Board Name" />
                    <Stack direction="row" spacing={1.5}>
                        <Typography>Color :</Typography>
                        <Stack direction="row" spacing={1}>
                            {colors.map( (clr,idx) => 
                                <Box 
                                sx={{
                                    cursor: "pointer",
                                    border:  color === idx ? "3px solid #383838" : "none" , 
                                    outline: `2px solid ${clr}`,
                                }}
                                key={clr}
                                width={25}
                                height={25}
                                bgcolor={clr}
                                borderRadius="50%"
                                onClick={() => setColor(idx)}
                                />
                            )}
                        </Stack>
                    </Stack>
               </Stack>
               <Button 
               disabled={loading}
               onClick={handleCreate} 
               variant="contained" 
               size="large">
                Create
                </Button>
            </Stack>
        </Dialog>
    )

}

export default CreateBoardModal;