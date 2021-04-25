import { useQuery, gql } from "@apollo/client";

const HELLO_QUERY = gql`
  query {
    users {
      name
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:(</p>;

  const setToken = () => {
    localStorage.setItem("token", "TEST_TOKEN");
  };

  console.log(data);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <button onClick={setToken}>set token</button>
      </header>
    </div>
  );
}

export default App;
