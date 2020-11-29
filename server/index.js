require('dotenv').config();
const app = require('./app');
const {scraping} = require('./scraping')

setInterval(()=>{
    scraping()
},120000)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});