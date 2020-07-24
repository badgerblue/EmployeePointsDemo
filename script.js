var selectedEmployee = "REE";
var dbName = "Users";
function getDbSchema() {
	var tblUsers = {
		name: "Users",
		columns: {
			// Here "Id" is name of column
			id: { primaryKey: true, autoIncrement: true },
			firstName: { notNull: true, dataType: "string" },
			lastName: { notNull: true, dataType: "string" },
			points: { notNull: true, dataType: "number" },
		},
	};
	var db = {
		name: dbName,
		tables: [tblUsers],
	};
	return db;
}
// executing jsstore inside a web worker
var connection = new JsStore.Connection(new Worker("vendor/jsstore.worker.js"));

async function initJsStore() {
	var database = getDbSchema();
	const isDbCreated = await connection.initDb(database);
	if (isDbCreated === true) {
		console.log("db created");
		// here you can prefill database with some data
		var value = {
			firstName: "Steve",
			lastName: "Jobs",
			points: 0,
		};
		var value2 = {
			firstName: "Steve",
			lastName: "Wozniak",
			points: 0,
		};
		var value3 = {
			firstName: "Steve",
			lastName: "Buscemi",
			points: 0,
		};
		var noOfDataInserted = await connection.insert({
			into: "Users",
			values: [value, value2, value3],
		});
		if (noOfDataInserted > 0) {
			//alert("Initialization Complete");
			location.reload();
		}
	} else {
		console.log("db opened");
		// results will be array of objects
		var results = await connection.select({
			from: "Users",
			order: {
				by: "points",
				type: "desc",
			},
		});
		var dropdown =
			"<select id='currentEmployee'name='currentEmployee'style='height: 25px; width: 190px;'onchange='Class(this.id)'><option id='REE'>Select an Employee</option>";
		var mytable =
			"<table class='table'><th>First Name</th><th>Last Name</th><th>Points</th>";
		for (var x = 0; x < results.length; x++) {
			mytable += "<tr><td>" + results[x].firstName + "</td>";
			dropdown +=
				"<option id='" +
				results[x].lastName +
				"'>" +
				results[x].firstName +
				" " +
				results[x].lastName +
				"</option>";
			mytable += "<td>" + results[x].lastName + "</td>";
			mytable += "<td>" + results[x].points + "</td></tr>";
		}
		mytable += "</table></br>";
		dropdown += "</select></br>";
		$("#wrapper")[0].innerHTML = mytable;
		$("#wrapper2")[0].innerHTML = dropdown;
	}
}
initJsStore();
async function addX(x) {
	if (selectedEmployee == "REE") {
		window.alert("Please Select an Employee");
	}
	var emp = await connection.select({
		from: "Users",
		where: {
			lastName: selectedEmployee,
		},
	});
	var rowsUpdated = await connection.update({
		in: "Users",
		where: {
			lastName: selectedEmployee,
		},
		set: {
			points: emp[0].points + x,
		},
	});
	location.reload();
}
function Class(str) {
	var select = document.getElementById("currentEmployee");
	var option = select.options[select.selectedIndex];
	selectedEmployee = option.id;
}
async function insertUser() {
	var newUser = window.prompt("Enter FIRST and LAST Names", "");
	if (newUser == null || newUser == "") {
		console.log("User cancelled the prompt.");
	} else {
		//insert into database
		var newUserArr = newUser.split(" ");
		var value = {
			firstName: newUserArr[0],
			lastName: newUserArr[1],
			points: 0,
		};
		var noOfDataInserted = await connection.insert({
			into: "Users",
			values: [value],
		});
		if (noOfDataInserted > 0) {
			alert("successfully added");
			location.reload();
		}
	}
}

async function deleteUser() {
	var delUser = window.prompt("Enter FIRST and LAST Names", "");
	if (delUser == null || delUser == "") {
		console.log("User cancelled the prompt.");
	} else {
		//insert into database
		var delUserArr = delUser.split(" ");
		var rowsDeleted = await connection.remove({
			from: "Users",
			where: {
				firstName: delUserArr[0],
				lastName: delUserArr[1],
			},
		});
		alert(rowsDeleted + " record deleted");
		location.reload();
	}
}
