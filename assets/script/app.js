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
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
        )

        //append the new  row to the table
        $(".tbody").append(newRow);

    });

})