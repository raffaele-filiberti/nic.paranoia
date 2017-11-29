import $ from 'jquery';

$('.container').css('background', '#f5f5f5');

function square() {
    let example = () => {
        let numbers = [];
        for (let number of arguments) {
            numbers.push(number * number);
        }

        return numbers;
    };

    console.log(example());
}

// returns: [4, 16, 56.25, 64, 132.25, 441]
square(2, 4, 7.5, 8, 11.5, 21);