import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 });

export default cache;


// import NodeCache from "node-cache";

// const globalCache = global.cache || new NodeCache({ stdTTL: 300 });

// if (!global.cache) {
//   global.cache = globalCache;
// }

// export default globalCache;
