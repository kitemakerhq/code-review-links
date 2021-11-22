import gql from 'graphql-tag';

export const codeRevieRequestQuery = gql`
  query CodeReviewRequest($url: String!) {
    codeReviewRequest(url: $url) {
      id
      links {
        name
        url
      }
    }
  }
`;
