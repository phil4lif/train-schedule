$(document).ready(function () {
    console.log("ready")

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCdxyaMEtZs" + "lIRRdG7Px-JjPb2fS1ghCwk",
        authDomain: "phil-s-project.firebaseapp.com",
        databaseURL: "https://phil-s-project.firebaseio.com",
        projectId: "phil-s-project",
        // storageBucket: "phil-s-project.appspot.com",
        // messagingSenderId: "885502009282",
        // appId: "1:885502009282:web:42630f0bc10b5598b5005b"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    //an array that will be used in the updating function
    var trainArr = [];
    //make a clock in the jumbo tron
    var clock = $(".clock")

    setInterval(() => {
        var now = moment().format("HH:mm:ss");
        $(".clock").text(now);
    }, 1000);

    //write a click function for submitting the new train info
    $("#submit").on("click", function (e) {
        e.preventDefault();
        // console.log("submit");


        //push the new info to the database
        database.ref().push({
            name: $("#trainname").val(),
            destination: $("#destination").val(),
            firsttrain: $("#firsttrain").val(),
            frequency: $("#frequency").val()
        });
        //clear the text boxes after they've been pushed to the db
        $("#trainname").val(""),
        $("#destination").val(""),
        $("#firsttrain").val(""),
        $("#frequency").val("")
    })

    //use the child added function to take the values from the db
    database.ref().on("child_added", function (snapshot) {
        // console.log(snapshot.val());
        //and store them in new variables

        var newName = snapshot.val().name
        var newDestination = snapshot.val().destination
        var firstTime = snapshot.val().firsttrain
        var newFrequency = snapshot.val().frequency

        //-------------------------------------------------------------------------
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);
        
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % newFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = newFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
        nextTrain = nextTrain.format("HH:mm");

        //----------------------------------------------------------------------
        //display the new variables in a new tr
        var newRow = $("<tr>").append(
            $("<td>").text(newName),
            $("<td>").text(newDestination),
            $("<td>").text(newFrequency),
            // $("<td>").text(newFirstTrain),
            $("<td>").text(nextTrain).addClass("nextTrain"),
            $("<td>").text(tMinutesTillTrain).addClass("minutesTill")
        )

        //append the new  row to the table
        $(".tbody").append(newRow);

        //push all of the data from the database to our trainarray
        trainArr.push({
            newName : snapshot.val().name,
            newDestination : snapshot.val().destination,
            firstTime : snapshot.val().firsttrain,
            newFrequency : snapshot.val().frequency
            })
        console.log(trainArr)
    });
    //a function to update the displayed minutes until the next train, and the displayed next arrival time, that will update every minute
    function update() {
        $(".tbody").empty();
        for( var i = 0; i < trainArr.length; i++){
            var newName = trainArr[i].newName
            var newDestination = trainArr[i].newname
            var firstTime = trainArr[i].firstTime
            var newFrequency = trainArr[i].newFrequency
        
        //repeating the earlier calculations to make the new table rows that will replace the ones we emptied every minute
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        
        // Current Time
        var currentTime = moment();
        
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       
        // Time apart (remainder)
        var tRemainder = diffTime % newFrequency;
        
        // Minute Until Train
        var tMinutesTillTrain = newFrequency - tRemainder;
   
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        
        nextTrain = nextTrain.format("HH:mm");

        var newRow = $("<tr>").append(
            $("<td>").text(newName),
            $("<td>").text(newDestination),
            $("<td>").text(newFrequency),
            // $("<td>").text(newFirstTrain),
            $("<td>").text(nextTrain).addClass("nextTrain"),
            $("<td>").text(tMinutesTillTrain).addClass("minutesTill")
        )
        $(".tbody").append(newRow);

    }   
    }

//use a set interval function to invoke the update function every minute
setInterval(() => {
    console.log("update func")
    update()
}, 60000);

})