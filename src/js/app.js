/**********************************************************************

 APP

 **********************************************************************/

import './vendors/vendors.js';
import 'glidejs';

let variable = 'Coucou';

console.log(variable);

$('.container').css('background', '#f5f5f5');

$('.glide').glide({
    type: "slider",
    autoplay: 6000
});

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