import React from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
    }
  }
`;

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

function App() {
  const hello = useQuery(HELLO_QUERY);
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
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <form method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input type="submit" value="login" />
        </form>
        {JSON.stringify(hello.data) || ""}
      </header>
    </div>
  );
}

export default App;
