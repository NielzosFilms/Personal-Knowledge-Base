import { useState, useEffect, cloneElement } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Box, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";

const SEND_CHANGE_PASSWORD_EMAIL = gql`
    mutation SendChangePasswordEmail($email: String!) {
        sendChangePasswordEmail(email: $email)
    }
`;

const SEND_VERIFY_EMAIL = gql`
    mutation SendVerifyEmail($email: String!) {
        sendVerifyEmail(email: $email)
    }
`;

const emailSuccessMessage =
    "The email has been sent, please check your inbox! (it could be in the spam folder)";

export function EmailProvider({ children, ...props }) {
    const [sendChangePasswordEmail, sendChangePasswordEmailRes] = useMutation(
        SEND_CHANGE_PASSWORD_EMAIL
    );
    const [sendVerifyEmail, sendVerifyEmailRes] =
        useMutation(SEND_VERIFY_EMAIL);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const handleChangePassword = (email) => {
        sendChangePasswordEmail({
            variables: {
                email,
            },
        }).catch((e) => console.log(e));
    };

    const handleVerify = (email) => {
        sendVerifyEmail({
            variables: {
                email,
            },
        }).catch((e) => console.log(e));
    };

    useEffect(() => {
        if (sendVerifyEmail.error) {
            enqueueSnackbar(sendVerifyEmail.error.graphQLErrors[0].message, {
                variant: "error",
            });
        }
        if (sendVerifyEmail.data?.sendVerifyEmail) {
            enqueueSnackbar(emailSuccessMessage, {
                variant: "info",
            });
        }
    }, [sendVerifyEmail.loading]);

    useEffect(() => {
        if (sendChangePasswordEmailRes.error) {
            enqueueSnackbar(sendChangePasswordEmailRes.error.message, {
                variant: "error",
            });
        }
        if (sendChangePasswordEmailRes?.data?.sendChangePasswordEmail) {
            enqueueSnackbar(emailSuccessMessage, {
                variant: "info",
            });
        }
    }, [sendChangePasswordEmailRes.loading]);

    if (sendChangePasswordEmailRes.loading || sendVerifyEmail.loading)
        return (
            <Box position="absolute" style={{ bottom: 20, left: 20 }}>
                <CircularProgress />
            </Box>
        );

    const returnData = {
        sendVerifyEmail: handleVerify,
        sendChangePasswordEmail: handleChangePassword,
        ...props,
    };

    if (Array.isArray(children)) {
        return <>{children.map((child) => cloneElement(child, returnData))}</>;
    }
    return <>{cloneElement(children, returnData)}</>;
}
