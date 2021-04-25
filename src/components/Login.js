import { useQuery, useLazyQuery, gql } from "@apollo/client";
import {
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Grid,
} from "@material-ui/core";

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
    }
  }
`;

export default function Login() {
  const [execLogin, loginResult] = useLazyQuery(LOGIN_QUERY);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    execLogin({
      variables: {
        username,
        password,
      },
    });
  };

  React.useEffect(() => {
    if (loginResult.data) {
      if (loginResult.data.login.success) {
        console.log("token", loginResult.data.login.token);
        localStorage.setItem("token", loginResult.data.login.token);
      }
    }
  }, [loginResult]);

  return (
    <FormControl onSubmit={handleSubmit}>
      <TextField
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label="Username"
        variant="filled"
        size="small"
        fullWidth
        margin="normal"
      />
      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        variant="filled"
        size="small"
        fullWidth
        margin="normal"
      />
      <Button type="submit" fullWidth color="primary" variant="contained">
        Login
      </Button>
    </FormControl>
  );
}
