function displayHTML() {
    let select = document.getElementById("select");
    let selectedValue = select.options[select.selectedIndex].value;
  
    let html1 = "<p>You selected value 1</p>";
    let html2 = "<p>You selected value 2</p>";
    let html3 = "<p>You selected value 3</p>";
  
    let displayDiv = document.getElementById("displayDiv");
  
    switch (selectedValue) {
      case "valor1":
        displayDiv.innerHTML = html1;
        break;
      case "valor2":
        displayDiv.innerHTML = html2;
        break;
      case "valor3":
        displayDiv.innerHTML = html3;
        break;
    }
  }