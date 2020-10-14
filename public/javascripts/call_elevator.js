let dest1 = 0;
let dest2 = 6;

let top1 = 122;
let top2 = 758;

function call_elevator(direction, storey) {
    console.log("call ", direction, " from: ", storey);
    document.getElementById(`${direction}_button_${storey}`).style.color = 'red';
    console.log(`${direction}_button_${storey}`);
    fetch(`/command/${direction}?storey=${storey}`, {
        method: 'post',
        body: JSON.stringify({ storey }),
    })
        .then(_ => {
            console.log('oke');
        });
}

document.getElementById('up_button_6').style.visibility = 'hidden';
document.getElementById('down_button_0').style.visibility = 'hidden';

function elevator_goto(index, storey) {
    console.log(`elevator ${index} go to storey ${storey}`);
    document.getElementById(`destination_button_${index}_${storey}`).style.color = 'red';
    fetch(`/command/goto${index}?storey=${storey}`, {
        method: 'post',
        body: JSON.stringify({ storey }),
    })
        .then(_ => {})
        .catch(error => console.log(error));
}

function elevator_go_up(index) {
    if (index == 1) {
        if (top1 > 122) {
            document.getElementById(`up_button_${6 - (top1 - 122)/106}`).style.color = 'white';
            top1 -= 106;
            document.getElementById('elevator_1').style.top = `${top1}px`;
        }
    } else {
        if (top2 > 122) {
            document.getElementById(`up_button_${6 - (top2 - 122)/106}`).style.color = 'white';
            top2 -= 106;
            document.getElementById('elevator_2').style.top = `${top2}px`;
        }
    }
}

function elevator_go_down(index) {
    if (index == 1) {
        if (top1 < 758) {
            document.getElementById(`down_button_${6 - (top1 - 122)/106}`).style.color = 'white';
            top1 += 106;
            document.getElementById('elevator_1').style.top = `${top1}px`;
        }
    } else {
        if (top2 < 758) {
            document.getElementById(`down_button_${6 - (top2 - 122)/106}`).style.color = 'white';
            top2 += 106;
            document.getElementById('elevator_2').style.top = `${top2}px`;
        }
    }
}

function set_arrow_color(direction, index, color) {
    [0, 1, 2, 3, 4, 5, 6].forEach(element => {
        document.getElementById(`arrow_${direction}_${index}_${element}`).style.color = color;
    });
}

function door(index) {
    console.log('open door');
    document.getElementById(`elevator_${index}_left`).classList.add('left_door_animation');
    document.getElementById(`elevator_${index}_right`).classList.add('right_door_animation');

    if (index == 1){
        document.getElementById(`destination_button_${index}_${6 - (top1 - 122)/106}`).style.color = 'white';
    } else {
        document.getElementById(`destination_button_${index}_${6 - (top2 - 122)/106}`).style.color = 'white';
    }
}

function close_door(index) {
    document.getElementById(`elevator_${index}_left`).classList.remove('left_door_animation');
    document.getElementById(`elevator_${index}_right`).classList.remove('right_door_animation');
}

door(1);
door(2);

setInterval(() => {
    fetch('/command/1', {
        mode: 'cors',
        method: 'get',
    })
        .then(response => response.json())
        .then((resp) => {
            console.log('get command: ', resp);
            close_door(1);
            set_arrow_color('up', '1', '#777777');
            set_arrow_color('down', '1', '#777777');
            if (resp == "goUp1") {
                elevator_go_up(1);
                set_arrow_color('up', '1', 'red');
            } else if (resp == "goDown1") {
                elevator_go_down(1);
                set_arrow_color('down', '1', 'red');
            } else if (resp == "door1") {
                door(1)
            }
        })
        .catch(err => console.log(err));
}, 2000);

setTimeout(() => {
    setInterval(() => {
        fetch('/command/2', {
            mode: 'cors',
            method: 'get',
        })
            .then(response => response.json())
            .then((resp) => {
                console.log('get command: ', resp);
                close_door(2);
                set_arrow_color('up', '2', '#777777');
                set_arrow_color('down', '2', '#777777');
                if (resp == "goUp2") {
                    elevator_go_up(2);
                    set_arrow_color('up', '2', 'red');
                } else if (resp == "goDown2") {
                    elevator_go_down(2);
                    set_arrow_color('down', '2', 'red');
                } else if (resp == "door2") {
                    door(2)
                }
            })
            .catch(err => console.log(err));
    }, 2000);
}, 1000);


