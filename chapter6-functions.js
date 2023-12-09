class vehicle{
    constructor(color, currentSpeed, maxSpeed){
        this.color = color;
        this.currentSpeed = currentSpeed;
        this.maxSpeed = maxSpeed;
    }   

    move(){
        console.log("Moving at " + this.currentSpeed + " km/h");
    }

    accelerate(amount){
        this.currentSpeed += amount;
    }
}

class motorcycle extends vehicle{
    constructor(color, currentSpeed, maxSpeed, fuel){
        super(color, currentSpeed, maxSpeed);
        this.fuel = fuel;
    }

    doWheelie(){
        console.log("Wheeeeee!");
    }
}

let motorcycle1 = new motorcycle("red", 0, 180, "gasoline");
console.log(motorcycle1.color);
motorcycle1.accelerate(50);
motorcycle1.move();
motorcycle1.doWheelie();
