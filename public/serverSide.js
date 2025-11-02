

 function Navigate(route){
        window.location.href = route;
}

   //circle loader
  const form = document.getElementById("signUpForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function() {
    
    loader.style.display = "flex";
  });