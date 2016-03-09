var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder
//app.use('/static', express.static(__dirname + '/public'));

//app.set('views', __dirname + '/public');
//app.set('view engine', 'html');
//app.engine('html', require('ejs').renderFile);

mongoose.connect('mongodb://localhost/employee');
var db = mongoose.connection;


var employeeSchema = mongoose.Schema({
	name: String,
	company: String,
	salary: Number,
	updated: { type: Date, default: Date.now }
});
var Employee = mongoose.model('Employee', employeeSchema);


app.get('/', function (req, res) {
	res.render('index');
});

app.post('/addEmployee', function (req, res) {
	var employee = new Employee(req.body);
    employee.save(function(err, emp) {
        if (err)
            return res.end(JSON.parse(err));
        else
            return res.end('SUCCESS');
    });
});

app.post('/updateEmployee', function (req, res) {
    Employee.findOne({ _id: req.body._id }, function (err, employee) {
        employee.name = req.body.name;
        employee.company = req.body.company;
        employee.salary = req.body.salary;
        employee.save(function(err, emp) {
            if (err)
                return res.end(JSON.parse(err));
            else
                return res.end('SUCCESS');
        });
    });
});

app.post('/deleteEmployee', function (req, res) {
    Employee.remove({ _id: req.body.id }, function (err) {
       if (err)
            return res.end(JSON.parse(err));
        else
            return res.end(JSON.stringify({message: 'SUCCESS', id: req.body.id }));
    });
});


app.get('/getEmployees', function (req, res) {
    Employee.find({}, function(err, employees) {
      if (err) throw err;
      // object of all the users
      res.send(employees);
    });
});

app.get('/test1', function (req, res) {
    res.render('index1');
});

var server = app.listen(3000, function () {
  console.log('Example app listening at localhost:3000');
});
