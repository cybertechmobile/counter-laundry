/* =====================================
   LAUNDRY LAND V5
   APPLICATION ENGINE
===================================== */


let employees = [];

let items = [];




// ================================
// START APP
// ================================


window.onload = async function(){


await startDatabase();


await loadSettings();


await loadMasterData();


await loadDashboard();



setTimeout(()=>{


document
.getElementById("splash")
.classList
.add("hidden");



document
.getElementById("app")
.classList
.remove("hidden");



},1200);



};





// ================================
// PAGE NAVIGATION
// ================================


function showPage(pageId){


document
.querySelectorAll(".page")
.forEach(page=>{


page.classList.remove("active");


});



document
.getElementById(pageId)
.classList
.add("active");


}

if ("serviceWorker" in navigator) {

navigator.serviceWorker.register(
"sw.js"
);

}



// ================================
// SETTINGS
// ================================


async function loadSettings(){


const setting =
await getData(
"settings",
1
);



if(setting){


document
.getElementById("appName")
.innerText =
setting.appName;



document
.getElementById("settingName")
.value =
setting.appName;



document
.getElementById("showCommission")
.checked =
setting.showCommission;



}



}




async function saveSetting(){


let name =
document
.getElementById("settingName")
.value;



let show =
document
.getElementById("showCommission")
.checked;



await saveData(
"settings",
{

id:1,

appName:name,

showCommission:show

}

);



alert(
"Pengaturan tersimpan"
);



loadSettings();


}




function openSetting(){


showPage(
"settingPage"
);


}






// ================================
// MASTER DATA LOAD
// ================================


async function loadMasterData(){


employees =
await getAllData(
"employees"
);



items =
await getAllData(
"items"
);



renderEmployeeSelect();

renderItemSelect();

renderEmployeeList();

renderItemList();



}





// ================================
// KARYAWAN
// ================================


async function saveEmployee(){


let name =
document
.getElementById("employeeName")
.value
.trim();



if(!name){

alert(
"Nama karyawan kosong"
);

return;

}



await saveData(
"employees",
{

name:name,

active:true,

commissionRules:[]

}

);



document
.getElementById("employeeName")
.value="";



await loadMasterData();



}




function renderEmployeeSelect(){


let select =
document
.getElementById("employeeSelect");



select.innerHTML =
`
<option>
Pilih Karyawan
</option>
`;



employees.forEach(emp=>{


select.innerHTML +=
`

<option value="${emp.id}">
${emp.name}
</option>

`;

});


}




function renderEmployeeList(){


let box =
document
.getElementById("employeeList");



if(!box)return;



box.innerHTML="";



employees.forEach(emp=>{


box.innerHTML +=

`

<div class="list-card">

<strong>
${emp.name}
</strong>

</div>

`;

});


}






// ================================
// ITEM
// ================================


async function saveItem(){


let name =
document
.getElementById("itemName")
.value
.trim();



let code =
document
.getElementById("itemCode")
.value
.trim();



let unit =
document
.getElementById("itemUnit")
.value;



if(!name || !code){

alert(
"Data item belum lengkap"
);

return;

}



await saveData(
"items",
{

name:name,

code:code.toUpperCase(),

unit:unit

}

);



document
.getElementById("itemName")
.value="";


document
.getElementById("itemCode")
.value="";



await loadMasterData();


}





function renderItemSelect(){


let select =
document
.getElementById("itemSelect");



select.innerHTML =
`
<option>
Pilih Item
</option>
`;



items.forEach(item=>{


select.innerHTML +=
`

<option value="${item.id}">
${item.name}
</option>

`;

});


}





function renderItemList(){


let box =
document
.getElementById("itemList");



if(!box)return;



box.innerHTML="";



items.forEach(item=>{


box.innerHTML +=

`

<div class="list-card">

<strong>
${item.name}
</strong>

<br>

${item.code}
-
${item.unit}

</div>

`;

});


}






// ================================
// ITEM CHANGE
// ================================


document.addEventListener(
"change",
async function(e){


if(e.target.id==="itemSelect"){


let item =
items.find(
x=>x.id==e.target.value
);



if(item){


document
.getElementById("workUnit")
.value =
item.unit;



}



}



});






// ================================
// SAVE WORK LOG
// ================================


async function saveWorkLog(){


let employeeId =
document
.getElementById("employeeSelect")
.value;



let itemId =
document
.getElementById("itemSelect")
.value;



let qty =
parseFloat(
document
.getElementById("workQty")
.value
);



let date =
document
.getElementById("workDate")
.value;



if(
!employeeId ||
!itemId ||
!qty
){

alert(
"Data pekerjaan belum lengkap"
);

return;

}



let employee =
employees.find(
x=>x.id==employeeId
);



let item =
items.find(
x=>x.id==itemId
);




// sementara tarif default

let rate=500;



let commission =
qty * rate;



await saveData(
"workLogs",
{

date:date,

employee:
employee.name,

item:
item.name,

qty:qty,

unit:
item.unit,

commission:commission

}

);



alert(
"Hasil kerja tersimpan"
);



document
.getElementById("workQty")
.value="";



loadDashboard();


}







// ================================
// DASHBOARD
// ================================


async function loadDashboard(){


let logs =
await getAllData(
"workLogs"
);



let today =
new Date()
.toISOString()
.substring(0,10);



let totalKG=0;

let totalPCS=0;

let totalCommission=0;



logs
.filter(x=>x.date===today)
.forEach(log=>{


if(log.unit==="KG"){

totalKG += Number(log.qty);

}



if(log.unit==="PCS"){

totalPCS += Number(log.qty);

}



totalCommission +=
Number(log.commission);



});



document
.getElementById("totalKG")
.innerText =
totalKG;



document
.getElementById("totalPCS")
.innerText =
totalPCS;



document
.getElementById("totalCommission")
.innerText =
"Rp"+
totalCommission
.toLocaleString("id-ID");



document
.getElementById("reportTotal")
.innerText =
logs.length;



document
.getElementById("reportCommission")
.innerText =
"Rp"+
totalCommission
.toLocaleString("id-ID");


}