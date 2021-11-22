import gql from 'graphql-tag';

export const editCodeReviewRequestMutation = gql`
  mutation EditCodeReviewRequest($id: ID!, $links: [CodeReviewRequestLinkInput!]!) {
    editCodeReviewRequest(input: { id: $id, links: $links }) {
      codeReviewRequest {
        id
        links {
          name
          url
        }
      }
    }
  }
`;
