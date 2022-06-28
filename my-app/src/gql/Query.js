import { gql } from "@apollo/client";


export const GET_DATA = gql`
{
  search(query: "facebook/react sort:best-match-asc", type: REPOSITORY, first: 100) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        updatedAt
        createdAt
        stargazerCount,
        forkCount,
        url
      }
    }
  }
}
`;