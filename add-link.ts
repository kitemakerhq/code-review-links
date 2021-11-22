import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import commandLineArgs from 'command-line-args';
import 'cross-fetch/polyfill';
import { editCodeReviewRequestMutation } from './mutations/editCodeReviewRequest';
import { codeRevieRequestQuery } from './queries/codeReviewRequest';

if (!process.env.KITEMAKER_TOKEN) {
  console.error(
    'Could not find Kitemaker token. Make sure the KITEMAKER_TOKEN environment variable is set.'
  );
  process.exit(-1);
}

const opts = commandLineArgs([
  { name: 'request', alias: 'r', type: String },
  { name: 'name', alias: 'n', type: String },
  { name: 'url', alias: 'u', type: String },
]);

if (!opts.request || !opts.name || !opts.url) {
  console.error(
    'Please provide the URL of the review request (-r), the name of the link (-n) and the url of the link (-u)'
  );
  process.exit(-1);
}

const host = process.env.KITEMAKER_HOST ?? 'https://toil.kitemaker.co';

const httpLink = new HttpLink({
  uri: `${host}/developers/graphql`,
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.KITEMAKER_TOKEN}`,
    },
  };
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: { __schema: { types: [] } },
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ fragmentMatcher }),
});

async function fetchCodeReview(): Promise<{
  id: string;
  links: Array<{ name: string; url: string }>;
}> {
  try {
    const result = await client.query({
      query: codeRevieRequestQuery,
      variables: { url: opts.request },
    });
    if (result.errors) {
      console.error(
        'Unable to fetch code review request',
        JSON.stringify(result.errors, null, '  ')
      );
      process.exit(-1);
    }
    return result.data.codeReviewRequest;
  } catch (e) {
    console.error('Unable to fetch code review request', e);
    process.exit(-1);
  }
}

async function addUrl(request: { id: string; links: Array<{ name: string; url: string }> }) {
  try {
    await client.mutate({
      mutation: editCodeReviewRequestMutation,
      variables: {
        id: request.id,
        links: [
          ...request.links.filter((link) => link.name !== opts.name),
          { name: opts.name, url: opts.url },
        ],
      },
    });
  } catch (e) {
    console.error('Unable to add link to code review request', e);
    process.exit(-1);
  }
}

async function run() {
  const request = await fetchCodeReview();
  await addUrl(request);
}

run();
