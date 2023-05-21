import {
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from "@apollo/client/core";

import { provideApolloClient, useQuery } from "@vue/apollo-composable";

const httpLink = createHttpLink({
    uri: 'https://countries.trevorblades.com/',
})

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const studyClient = new ApolloClient({
    link: httpLink,
    cache,
})

provideApolloClient(studyClient);

const workspaceQuery = useQuery;

export { workspaceQuery }