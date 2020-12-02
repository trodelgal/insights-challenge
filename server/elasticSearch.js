// const { Client } = require("@elastic/elasticsearch");

// // connect to elastic search
// const client = new Client({
//     node: 'http://insights-challenge_elasticsearch_1:9200'
// });


// //get all
//   const getAllElastic = async () => {
//           const result = await client.search(
//               {
//                 index: "posts-insights",
//                 body: {
//                   query: {
//                    match_all: {},
//                   },
//                 },
//               })
//               return result
// }

// //search in elastic search.
//   const searchElastic = async (search) =>{
//           const result = await client.search(
//               {
//                 index: "posts-insights",
//                 size:1000,
//                 body: {
//                   query: {
//                     prefix: {
//                       title:search
//                     },
//                   },
//                 },
//               })
//               return result
// }

// // get data from sql to elastic(initial elastic)
// const updateElasticData = async(index, dataArray)=>{
//     await client.indices.create(
//         {
//           index: index,
//         }
//       );
//       const body = dataArray.flatMap((doc) => [
//         { index: { _index: index } },
//         doc,
//       ]);
//       const { body: bulkResponse } = await client.bulk({ refresh: true, body:body });
//       if (bulkResponse.errors) {
//         console.log("ERROR");
//         return bulkResponse.errors;
//       } else {
//           const { body: count } = await client.count({ index: index });
//           console.log(count);
//         return bulkResponse;
//       }
// }

// // post to elasticsearch
// const postElastic= async (index, doc)=>{
//     const newPost = await client.index({
//         index: index,
//         body: doc,
//       });
//       return newPost;
// }

// // delete from elasticsearch
// const deletetElastic= async (index, id)=>{
//     const newPost = await client.deleteByQuery({
//         index: index,
//         id: id,
//       });
//       return newPost;
// }

// // updata elasticsearch data
// const updateElastic= async (index, id, body)=>{
// const updateDoc = await client.update({
//   index: index,
//   id: id,
//   body: body,
// })
// }

// module.exports = {searchElastic, updateElasticData, postElastic, deletetElastic, updateElastic, getAllElastic}