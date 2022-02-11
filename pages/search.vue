<template>
  <div>
  	<p>The router-view belong causes the dev server to hang</p>
    <p>Also check the comment in `serverPrefetch`</p>

  	<router-view></router-view>
  </div>
</template>

<script>
import {
  createServerRootMixin,
} from 'vue-instantsearch'; // eslint-disable-line import/no-unresolved
import algoliasearch from 'algoliasearch/lite';
import _renderToString from 'vue-server-renderer/basic';

function renderToString(app) {
  return new Promise((resolve, reject) => {
    _renderToString(app, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

export default {
  mixins: [
    createServerRootMixin({
      searchClient,
      indexName: 'instant_search'
    }),
  ],
  serverPrefetch() {
    // Either uncomment out this promise return, OR
    // remove the <router-view /> from the template,
    // and the server won't hang

    // return new Promise(resolve => {
    //   this.$ssrContext.nuxt.algoliaState = { foo: 'bar' };
    //   resolve()
    // })

    return this.instantsearch
      .findResultsState({ component: this, renderToString })
      .then(algoliaState => {
        this.$ssrContext.nuxt.algoliaState = algoliaState;
      });
  },
  beforeMount() {
    const results =
      (this.$nuxt.context && this.$nuxt.context.nuxtState.algoliaState) ||
      window.__NUXT__.algoliaState;

    this.instantsearch.hydrate(results);

    delete this.$nuxt.context.nuxtState.algoliaState;
    delete window.__NUXT__.algoliaState;
  } 
}
</script>