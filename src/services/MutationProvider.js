import { useState, useEffect, cloneElement } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CircularProgress, Box, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

export function MutationProvider({
    mutation,
    returnName = null,
    children,
    ...props
}) {
    const [doMutation, mutationResult] = useMutation(mutation);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (mutationResult.error) {
            enqueueSnackbar(mutationResult.error.message, { variant: "error" });
        }
    }, [mutationResult.loading]);

    if (mutationResult.loading)
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress color="primary" />
            </Box>
        );
    if (mutationResult.error)
        return (
            <>
                <Typography variant="h2">Error :(</Typography>
                <Typography>{mutationResult.error.message}</Typography>
            </>
        );

    return (
        <>
            {cloneElement(children, {
                [returnName ? returnName : "doMutation"]: doMutation,
                [returnName ? `${returnName}Result` : "mutationResult"]:
                    mutationResult,
                ...props,
            })}
        </>
    );
}
