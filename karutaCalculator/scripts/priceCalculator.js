function calculate(){
  var inputFeild = document.getElementById("inputFeild");
  var outputFeild = document.getElementById("output");
  var includeSymbols = document.getElementById("includeSymbols").checked;
  
  if(outputFeild.style.display === "none"){
    outputFeild.style.display = "block";
  }
  
  if(inputFeild.files.length === 0){
    outputFeild.innerHTML = "No File Selected!";
    return;
  }
  
  var file = inputFeild.files[0];
  outputFeild.innerHTML = "There was an Error! Please make sure you submitted the right file and didn't alter it.";
  
  var values = [];
  var cardInfo = [];
  
  var reader = new FileReader();
  reader.onload = function(progressEvent){
    const text = this.result;

    var lines = text.split('\n');
    for (var line = 1; line < lines.length; line++) {
      var card = lines[line].split("\",\"");
      
      var print = parseInt(card[1]);
      var wish = parseInt(card[16]);
      var edition = parseInt(card[2]);
      
      var value = 0;
      
      if(print < 10){
        value = 9999;
      }
      else if(print < 100){
        switch(edition){
          case 6:
            value = 9999;
            break;
          default:
            value = wish/5;
        }
      }
      else if(print < 1000){
        switch(edition){
          case 1:
            value = wish/55;
            break;
          case 2:
          case 4:
          case 5:
            value = wish/70;
            break;
          case 3:
            value = wish/60;
            break;
          default:
            value = 9999;
        }
      }
      else{
        switch(edition){
          case 1:
          case 2:
            value = wish/1100;
            break;
          case 3:
          case 4:
            value = wish/750;
            break;
          case 5:
            value = wish/370;
            break;
          default:
            value = 9999;
        }
      }
      
      value = Math.floor(value);
      
      values.push(value);
      
      //Format the data for selling
      var price;
      
      if(includeSymbols){
        price = "\""+value+":tickets:\",";
      }
			else{
			  price = "\""+value+"\",";
			}
			
			var wl;
			
			if(includeSymbols){
        wl = "\"♡"+wish+"\",";
      }
			else{
			  wl = "\""+wish+"\",";
			}
			
			var code = "\""+card[0].substring(1)+"\",";

			var quality = "";
			
			if(includeSymbols){
  			//☆ ★
  			switch(card[5]){
  				case "0":
  					quality = "\"☆☆☆☆\",";
  					break;
  				case "1":
  					quality = "\"★☆☆☆\",";
  					break;
  				case "2":
  					quality = "\"★★☆☆\",";
  					break;
  				case "3":
  					quality = "\"★★★☆\",";
  					break;
  				case "4":
  					quality = "\"★★★★\",";
  					break;
  			}
			}
			else{
			  quality = "\""+card[5]+"\",";
			}
			
			var number;
      
      if(includeSymbols){
        number = "\"#"+print+"\",";
      }
			else{
			  number = "\""+print+"\",";
			}
      
      var ed;
      
      if(includeSymbols){
        ed = "\"◈"+edition+"\",";
      }
			else{
			  ed = "\""+edition+"\",";
			}
      
			var series = "\""+card[4]+"\",";
			var character = "\""+card[3]+"\"\n";
			
			var cardFormatted = price+wl+code+quality+number+ed+series+character;
			cardInfo.push(cardFormatted);
    }
    
    //Sort the cards by their price, descending
    var sorted = false;
    		
    while(!sorted) {
    	sorted = true;
    			
    	for(var i = 0; i < values.length-1; i++) {
    		for(var j = i+1; j < values.length; j++) {
    			if(values[i] < values[j]) {
    				var tempValue = values[i];
    				var tempInfo = cardInfo[i];
    						
    				values[i] = values[j];
    				cardInfo[i] = cardInfo[j];
    						
    				values[j] = tempValue;
    				cardInfo[j] = tempInfo;
    						
    				sorted = false;
    			}
    		}
    	}
    }
    
    cardInfo.unshift("\"Price\",\"Wish\",\"Code\",\"Quality\",\"Print\",\"Edition\",\"Series\",\"Character\"\n");
    
    var outputFile = new File(cardInfo, "output.csv", {type: "text/csv;charset=utf-8;"});
    outputFeild.href = URL.createObjectURL(outputFile);
    outputFeild.innerHTML = "Output.csv";
  }
  
  reader.readAsText(file);
}