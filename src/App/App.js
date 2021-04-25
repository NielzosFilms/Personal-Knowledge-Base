import { useQuery, gql } from "@apollo/client";

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

function App() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:(</p>;

  console.log(data);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <p>Query: {data.hello}</p>
      </header>
    </div>
  );
}

export default App;
