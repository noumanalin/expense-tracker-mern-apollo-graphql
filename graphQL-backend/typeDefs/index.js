import { mergeTypeDefs } from "@graphql-tools/merge";

import { userTypeDefs } from './user.typeDefs.js';
import { transactionTypeDef } from "./transaction.typeDefs.js";

const mergedTypeDefs = mergeTypeDefs([ userTypeDefs, transactionTypeDef ]); 

export default mergedTypeDefs;


// Why we Merge Type Definitions? 🤔

// Modularity: Merging type definitions allows you to keep related schema components in separate files, promoting modularity and organization.

// Easier Collaboration: In a team environment, different developers can work on different parts of the schema without causing merge conflicts in a single large file.

// Reuse

// Clear Separation of Concerns: Each file can focus on a specific domain or type of data