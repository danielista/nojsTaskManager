const btn = document.getElementById("addTask");

btn.addEventListener("click", () => {
    const name = document.getElementById("taskname").value;
    const priority = parseInt(document.getElementById("priority").value);
    const price = parseFloat(document.getElementById("price").value);
   

    const object = {name,priority};
    if (price>0){
        object.price = price;
    }
    console.log(object);
    $.ajax({
        url: "http://localhost:3000/task/new",
        type: "post",
        dataType: "json",
        //contentType: "application/json",
        data: object,
        success: (result)=>{
            console.log(result);
        },
        error:  (err)=>{
            console.log("Error: ",err);
        }
    })
})