const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuid } = require("uuid");
app.use(express.json());

app.use((req, res, next) => {
	req.api_requested_by = "Sivasangari";
	next();
});

const allData = JSON.parse(fs.readFileSync(`${__dirname}/db.json`));

app.get("/", (req, res) => {
	const api_requested_by = req.api_requested_by;
	res.status(200).json({
		status: "success",
		results: allData.length,
		data: {
			api_requested_by,
			allData: allData,
		},
	});
});

app.get("/:id", (req, res) => {
	const api_requested_by = req.api_requested_by;
	const id = req.params.id;
	const user = allData.find((el) => el.id == id);
	// console.log(user);
	res.status(200).json({
		status: "success",
		data: {
			api_requested_by,
			allData: user,
		},
	});
});

app.post("/", (req, res) => {
	const api_requested_by = req.api_requested_by;
	const newId = uuid();
	const newData = Object.assign({ id: newId }, req.body);
	allData.push(newData);
	fs.writeFile(`${__dirname}/db.json`, JSON.stringify(allData), () => {
		res.status(201).json({
			status: "success",
			data: {
				api_requested_by,
				allData: newData,
			},
		});
	});
});

app.patch("/:id", (req, res) => {
	const id = req.params.id;
	const data = allData.find((el) => el.id == id);
	const update = Object.assign(data, req.body);
	fs.writeFile(`${__dirname}/db.json`, JSON.stringify(allData), () => {
		res.status(200).json({
			status: "success",
			data: {
				allData: update,
			},
		});
	});
});

app.delete("/:id", (req, res) => {
	const id = req.params.id;
	const index = allData.findIndex((el) => el.id == id);
	allData.splice(index, 1);
	fs.writeFile(`${__dirname}/db.json`, JSON.stringify(allData), () => {
		res.status(200).json({
			status: "success",
		});
	});
});

const port = 8000;
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
