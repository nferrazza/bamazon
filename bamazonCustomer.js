var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err, response) {
    if (err) throw err;
    console.log("Connection established.\nConnection ID: " + connection.threadId);
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("CURRENT INVENTORY:" + "\n" + "---------------------\n");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + (res[i].item_id -1 ) + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: " + res[i].price + "\n" + res[i].stock_quantity + " left in stock." + "\n-------------------");
        }
        userPrompt();
    });

}
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////

function userPrompt(){
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
    
    inquirer
        .prompt([
        {
            name: "productID",
            type: "input",
            message: "What item would you like to purchase today? \n Please enter this item by ID."
        },
        {
            name: "productQuantity",
            type: "input",
            message: "How many would you like to purchase?"
        }
    ])
    .then(function (answer){ 
    var i = parseInt(answer.productID);
    var quantity = answer.productQuantity;
    console.log("Ok, so you would like to buy " + quantity + " of item " + results[i].product_name);
    if (quantity <= results[i].stock_quantity){
        var sql = ("UPDATE products SET stock_quantity = stock_quantity - " + quantity + " WHERE item_id =" + i) 
        connection.query(sql, function( err, res ){
            if (err) throw err;
            console.log("Great, it seems we have just enough! Your total will be: " + results[i].price * quantity);
            displayProducts();
            
        });       
        
        
    }
    else {
        console.log("Oops! We don't have enough of those!");
        userPrompt();
    }
    
    
    });
});
}

//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////


