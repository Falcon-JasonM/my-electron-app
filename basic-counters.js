let groups = [
    ["Peter", "Paul", "Mary"],
    ["George", "Ringo", "John"],
    ["Scooby", "Shaggy", "Velma"]
];
    
for (let i=0; i<groups.length; i++){
    
    let matches = 0;
    for (let j=0; j<groups[i].length; j++){
        if (groups[i][j].startsWith("S")){
            matches++;
        }else{
            continue;
        }
        if (matches === 2){
            console.log("I found two matches in group " + (i+1));
        }
    }
}
