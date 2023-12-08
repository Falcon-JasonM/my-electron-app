function magicEightBall(){
    //generate a random number from 0-5
let value = Math.floor(Math.random() * 5);
//create a variable to hold the end response
let answer = "";
//create a prompt that can take a string value input that you can repeat back to the user in the final output
let question = prompt("What is your question?", "type question here");
//create six responses each assigned to a different number from the random number generator
switch(value){
    case 0:
        answer = "All signs point to YES!";
        break;
    case 1:
        answer = "Probably NO...";
        break;
    case 2:
        answer = "Maybe...?";
        break;
    case 3:
        answer = "You can't possibly be serious.";
        break;
    case 4:
        answer = "Like, for sure, dude.";
        break;
    default:
        answer = "Ask again.";
        break;
}
//output the user's original question plus the raindomly selected case response
console.log(question + " " + answer);
}
