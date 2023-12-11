import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import tiktoken from 'tiktoken';
import { Pinecone } from '@pinecone-database/pinecone';
const OPENAI_API_KEY = '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';
const tokenizer = tiktoken.get_encoding('cl100k_base');
const tiktoken_len = (text) => {
    const tokens = tokenizer.encode(text);
    return tokens.length;
};
const textToChunks = async (textdata) => {
    const textsplitter = new RecursiveCharacterTextSplitter();
    textsplitter.chunkSize = 250;
    textsplitter.chunkOverlap = 20;
    textsplitter.lengthFunction = tiktoken_len;
    textsplitter.separators = ["\n\n", "\n", " ", ""];
    return await textsplitter.splitText(textdata);
};
const model_name = 'text-embedding-ada-002';
const embed = new OpenAIEmbeddings({
    modelName: model_name,
    openAIApiKey: OPENAI_API_KEY
});
const Embeddings = (chunks) => {
    console.log(chunks);
    return embed.embedDocuments(chunks);
};
const PINE_API_KEY = '9af21f05-e4b8-4131-a5b5-9393df693a33';
const PINE_ENV = 'asia-southeast1-gcp-free';
const pinecone = new Pinecone({
    apiKey: PINE_API_KEY,
    environment: PINE_ENV,
});
const CreateIndex = async (name, namespace, res, chunks) => {
    try {
        const indexes = await pinecone.listIndexes();
        if (!indexes.includes(name)) {
            await pinecone.createIndex({
                name: name,
                dimension: 1536,
                metric: 'cosine'
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    const index = pinecone.index(name);
    const currentNamespace = index.namespace(namespace);
    let toUpsert = [];
    for (let i = 0; i < res.length; i++) {
        toUpsert.push({ id: "vec" + i.toString(), values: res[i], metadata: { "text": chunks[i] } });
    }
    try {
        await currentNamespace.upsert(toUpsert);
    }
    catch (error) {
        console.log(error);
    }
};
export const QueryPine = async (name, namespace, query) => {
    try {
        const index = pinecone.index(name);
        const currentNamespace = index.namespace(namespace);
        console.log(await Embeddings([query]));
        const querychunk = await Embeddings([query]);
        const response = await currentNamespace.query({
            topK: 4,
            vector: querychunk[0],
            includeMetadata: true,
        });
        return response.matches;
    }
    catch (error) {
        console.log(error);
    }
};
//exported functions
export const PineUpload = async (index, namespace, text) => {
    try {
        const chunks = await textToChunks(text);
        const embeddings = await Embeddings(chunks);
        await CreateIndex(index, namespace, embeddings, chunks);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
//# sourceMappingURL=pinecone.js.map