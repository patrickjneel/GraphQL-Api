const { ApolloServer } = require("apollo-server");
const fetch = require("node-fetch");

// Construct a schema, using GraphQL schema language
const typeDefs = `
type Ships {
  crew: String
  name: String
  passengers: String
  manufacturer: String
  model: String
  class: String
  pilots: [Pilots]
}

type Pilots {
  name: String
}

type People {
  name: String
  height: String
  mass: String
  gender: String
}

  type Query {
    starships: [Ships]
    people: [People]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    starships: async () => {
      const starshipResults = await fetch(`https://swapi.co/api/starships/`)
      const starshipJson = await starshipResults.json();
      return starshipJson.results;
    },
    people: async () => {
      const peopleResults = await fetch(`https://swapi.co/api/people/`);
      const peopleJson = await peopleResults.json();
      return peopleJson.results;
    }
  },
  Pilots: {
    name: async (url) => {
      try {
        const results = await fetch(url);
        const data = await results.json();
        return data.name ? data.name : null;

      } catch (e) {
        console.error(e);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
