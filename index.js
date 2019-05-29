const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.json({ type: 'application/json' }));
const userRouter = require('./apis/user');
const productRouter = require('./apis/product');
const groupRouter = require('./apis/group');
const messageRouter = require('./apis/messages');
app.use(bodyParser.urlencoded({ extended: false }))

const models = require('./models');

models
.connectDB()
.then(console.log('Connect db successfully'))
.catch(function(e) {
	console.error(e);
	process.exit(1)
})
 
userRouter.load(app);
productRouter.load(app);
groupRouter.load(app);
messageRouter.load(app);
app.use((err, req, res, next) => {
		if(Array.isArray(err.errors)) {
			const message = err.errors.map(function(item){
				return item.message;
			});
			return res.status(400).json({
				errors: message
			});
		}
		return res.status(400).json({
			//isSuccess: false,
			message: err.message || 'Have error',
	});
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});
