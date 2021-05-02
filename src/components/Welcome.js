import { Typography, Divider } from "@material-ui/core";

const MESSAGES = [
    "Hi :)",
    "Welcome back!",
    "Good luck today!",
    "Remember to take a break!",
    "Learning never stops!",
    "Making notes can help you process things!",
    "Stay hydrated ♡",
];

export default function Welcome() {
    const getMessage = () => {
        return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    };

    return (
        <>
            <Typography variant="h2">{getMessage()}</Typography>
        </>
    );
}
