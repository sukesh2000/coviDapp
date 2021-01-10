document.querySelector("#submitBtn").addEventListener("click", async () => {
    const hashAddress = document.getElementById("hashId").value;
    let response = await fetch(`https://api.delphi.tzkt.io/v1/accounts/${hashAddress}/operations`);
    let jsonData = await response.json()
    let transactionList = ""
    let count = 1
    try {
        await jsonData.forEach(element => {
            if (count === jsonData.length - 1) return false;
            ++count;
            let parameters = JSON.parse(element["parameters"])
            if (parameters["entrypoint"] === "transferVaccine" || parameters["entrypoint"] === "transferHosp") {
                let vaccineCount = parameters["value"]["args"][1]["int"]
                let targetAddress = element["target"]["address"]
                let transactionId = element["id"]
                let timestamp = `${element["timestamp"].substring(element["timestamp"].indexOf("T")+1, element["timestamp"].indexOf("Z"))}H, ${element["timestamp"].substring(0, element["timestamp"].indexOf("T"))}`
                transactionList += `<div class="transaction"><h3><span>${vaccineCount}</span> vaccines were issued for : <span>${targetAddress}</span> at <span>${timestamp}</span>. The transaction ID is = <span>${transactionId}</span></h3></div>`
            }
        });
        const bottomContainer = document.querySelector("#bottomContainer");
        if(transactionList === ""){
            bottomContainer.innerHTML = "<h3>Invalid Hash Address</h3>"
        }else{
            bottomContainer.innerHTML = transactionList
        }
    }catch(err){
        console.log(err)
    }
})