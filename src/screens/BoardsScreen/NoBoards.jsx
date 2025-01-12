import { Stack , Typography } from "@mui/material";
const NoBoards = () => {

    return(
        <Stack mt={15} spacing={1} textAlign="center">
            <Typography variant="h5">No Boards Created</Typography>
            <Typography >Create your first board today!</Typography>
        </Stack>
    )
}

export default NoBoards;