let form = document.querySelector('form');
let category = document.querySelectorAll('input[name="Category"]');

// Applying ForEach --> In order to apply function definition to each array's element
category.forEach((radio) => {
// Change Event triggers upon selecting the radio button
  radio.addEventListener("change", function() {
//    Usage of this is only possible in normal function not in arrow function
    if(this.value === "Patient"){
       form.action = "/patient";
    }
    else if(this.value === "Doctor"){
       form.action = "/doctor";
    }
  });
});