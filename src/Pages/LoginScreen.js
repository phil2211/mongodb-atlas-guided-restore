import React from "react";
import styled from "@emotion/styled";
import { useMsal } from "@azure/msal-react";

import { useRealmApp } from "../RealmApp";
import Container from "../Components/Container";
import Loading from "../Components/Loading";
import { MicrosoftLoginButton } from "react-social-login-buttons";


const LoginScreen = () => {
    const app = useRealmApp();
    const [error, setError] = React.useState({});
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);
    const { instance, accounts } = useMsal();
 
    const handleSSOLogin = async () => {
        try {
            //setIsLoggingIn(true);

            let jwt = await instance.acquireTokenPopup({
                scopes: [`${process.env.REACT_APP_APPID}/.default`],
                account: accounts[0]
            });
    
            jwt = await JSON.stringify(jwt.accessToken).slice(1,-1);
            await app.logInJwt(jwt);
        } catch (err) {
            console.log(err);
            handleAuthenticationError(err, setError);
        }
    }

    const handleAuthenticationError = (err, setError) => {
        const { status, message } = parseAuthenticationError(err);
        const errorType = message || status;
        console.log(errorType);
        switch (errorType) {
            case "invalid username":
                setError((prevErr) => ({ ...prevErr, email: "Invalid email address"}));
                break;
            case "invalid username/password":
            case "invalid password":
            case "401":
                setError((err) => ({ ...err, password: "Incorrect password"}));
                break;
            default:
                break;
        }
    }

    return (
        <Container>
            {isLoggingIn ? (
                <Loading />
            ) : (
                <>
                <LoginFormRow>
                    <MicrosoftLoginButton onClick={() => handleSSOLogin()} />
                </LoginFormRow>
                </>
            )}
        </Container>
    )
}

export default LoginScreen;

function parseAuthenticationError(err) {
    const parts = err.message.split(":");
    const reason = parts[parts.length - 1].trimStart();
    if (!reason) return { status: "", message: "" };
    const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
    const match = reason.match(reasonRegex);
    const { status, message } = match?.groups ?? {};
    return { status, message };
}

const LoginFormRow = styled.div`
  margin-bottom: 16px;
`;