const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

  
  var client = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET,
  })


const typeDefs = gql`
  
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    desc: String!
  }

  type Mutation {
    addBookmark(url: String!, desc: String!, title: String!) : Bookmark
  }
`

const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try{
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("fetchBookmarks"))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result)
        return result.data.map(d => {
          return {
            id: d.ref.id,
            url: d.data.url,
            desc: d.data.desc,
            title: d.data.title
          }
        })
      }
      catch(err){
        console.log('err',err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, {url,desc,title}) => {
      try {
        var result = await client.query(
          q.Create(
            q.Collection('Bookmarks'),
            { data: { 
              url,
              desc,
              title
             } },
          )

        );
        //console.log("Document Created and Inserted in Container: " + result.ref.id);
             
        return ({...result.data, id: result.ref.id})

      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }
      
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

exports.handler = server.createHandler()