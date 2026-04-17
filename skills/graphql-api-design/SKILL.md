---
name: graphql-api-design
description: GraphQL API patterns — schema design, resolvers, DataLoader, subscriptions, federation
triggers: [GraphQL, API design, GraphQL schema, resolvers, DataLoader, GraphQL subscriptions, Apollo]
---

# SKILL: GraphQL API Design

## Schema Design Patterns

### Pattern 1: Type-First Schema
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

### Pattern 2: Resolvers
```typescript
const resolvers = {
  Query: {
    user: async (_parent, { id }, context) => {
      return await context.db.user.findUnique({ where: { id } })
    },
    
    users: async (_parent, { limit = 10, offset = 0 }, context) => {
      return await context.db.user.findMany({
        take: limit,
        skip: offset
      })
    }
  },
  
  Mutation: {
    createUser: async (_parent, { input }, context) => {
      return await context.db.user.create({
        data: input
      })
    }
  },
  
  User: {
    // Field resolver (N+1 problem without DataLoader)
    posts: async (parent, _args, context) => {
      return await context.db.post.findMany({
        where: { authorId: parent.id }
      })
    }
  }
}
```

### Pattern 3: DataLoader (Solve N+1)
```typescript
import DataLoader from 'dataloader'

// Batch loader
const batchUsers = async (ids: string[]) => {
  const users = await db.user.findMany({
    where: { id: { in: ids } }
  })
  
  // Return in same order as requested
  return ids.map(id => users.find(u => u.id === id))
}

// Create loader
const userLoader = new DataLoader(batchUsers)

// Resolvers
const resolvers = {
  Post: {
    author: (parent) => {
      // Batches requests automatically
      return userLoader.load(parent.authorId)
    }
  }
}

// Instead of N queries:
// SELECT * FROM users WHERE id = 1
// SELECT * FROM users WHERE id = 2
// SELECT * FROM users WHERE id = 3

// DataLoader batches into 1 query:
// SELECT * FROM users WHERE id IN (1, 2, 3)
```

### Pattern 4: Pagination (Cursor-Based)
```graphql
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type UserEdge {
  node: User!
  cursor: String!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Query {
  users(first: Int, after: String): UserConnection!
}
```

```typescript
const resolvers = {
  Query: {
    users: async (_parent, { first = 10, after }, context) => {
      const users = await context.db.user.findMany({
        take: first + 1,  // Fetch one extra to check hasNextPage
        ...(after && { cursor: { id: after }, skip: 1 })
      })
      
      const hasNextPage = users.length > first
      const edges = users.slice(0, first).map(user => ({
        node: user,
        cursor: user.id
      }))
      
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges[edges.length - 1]?.cursor
        }
      }
    }
  }
}
```

### Pattern 5: Subscriptions (Real-time)
```graphql
type Subscription {
  postAdded: Post!
  commentAdded(postId: ID!): Comment!
}
```

```typescript
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const resolvers = {
  Mutation: {
    createPost: async (_parent, { input }, context) => {
      const post = await context.db.post.create({ data: input })
      
      // Publish event
      pubsub.publish('POST_ADDED', { postAdded: post })
      
      return post
    }
  },
  
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED'])
    }
  }
}
```

### Pattern 6: Error Handling
```typescript
class UserInputError extends Error {
  constructor(message: string) {
    super(message)
    this.extensions = { code: 'USER_INPUT_ERROR' }
  }
}

const resolvers = {
  Mutation: {
    createUser: async (_parent, { input }) => {
      // Validate input
      if (!input.email.includes('@')) {
        throw new UserInputError('Invalid email format')
      }
      
      try {
        return await db.user.create({ data: input })
      } catch (error) {
        if (error.code === 'P2002') {  // Unique constraint
          throw new UserInputError('Email already exists')
        }
        throw error
      }
    }
  }
}
```

## Quality Checks
- [ ] Schema follows naming conventions
- [ ] DataLoader used (no N+1 queries)
- [ ] Pagination implemented (cursor-based)
- [ ] Error handling with proper codes
- [ ] Authorization in resolvers
- [ ] Input validation
- [ ] Depth limiting (prevent deep queries)
- [ ] Query complexity analysis
