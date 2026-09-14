/* =====================================
   LAUNDRY LAND V5
   INDEXED DB ENGINE
===================================== */


const DB_NAME = "LaundryLandDB";

const DB_VERSION = 1;


let db;



// ================================
// OPEN DATABASE
// ================================


function openDatabase(){


return new Promise((resolve,reject)=>{


const request =
indexedDB.open(
DB_NAME,
DB_VERSION
);



request.onupgradeneeded = function(event){


db = event.target.result;



// SETTINGS

if(!db.objectStoreNames.contains("settings")){

db.createObjectStore(
"settings",
{
keyPath:"id"
}
);

}



// EMPLOYEES

if(!db.objectStoreNames.contains("employees")){

db.createObjectStore(
"employees",
{
keyPath:"id",
autoIncrement:true
}
);

}



// ITEMS

if(!db.objectStoreNames.contains("items")){

db.createObjectStore(
"items",
{
keyPath:"id",
autoIncrement:true
}
);

}



// WORK LOGS

if(!db.objectStoreNames.contains("workLogs")){

db.createObjectStore(
"workLogs",
{
keyPath:"id",
autoIncrement:true
}
);

}



};



request.onsuccess=function(event){

db=event.target.result;

console.log(
"Database LaundryLand aktif"
);


resolve(db);

};



request.onerror=function(event){

console.error(
"Database error",
event
);


reject(event);

};



});

}



// ================================
// SAVE DATA
// ================================


function saveData(
storeName,
data
){


return new Promise(
(resolve,reject)=>{


const transaction =
db.transaction(
storeName,
"readwrite"
);



const store =
transaction.objectStore(storeName);



const request =
store.put(data);



request.onsuccess=function(){

resolve(true);

};



request.onerror=function(e){

reject(e);

};



});


}



// ================================
// GET ALL DATA
// ================================


function getAllData(
storeName
){


return new Promise(
(resolve,reject)=>{


const transaction =
db.transaction(
storeName,
"readonly"
);



const store =
transaction.objectStore(storeName);



const request =
store.getAll();



request.onsuccess=function(){

resolve(
request.result
);

};



request.onerror=function(e){

reject(e);

};



});


}





// ================================
// GET ONE DATA
// ================================


function getData(
storeName,
id
){


return new Promise(
(resolve,reject)=>{


const transaction =
db.transaction(
storeName,
"readonly"
);



const store =
transaction.objectStore(storeName);



const request =
store.get(id);



request.onsuccess=function(){

resolve(
request.result
);

};



request.onerror=function(e){

reject(e);

};



});


}




// ================================
// DELETE DATA
// ================================


function deleteData(
storeName,
id
){


return new Promise(
(resolve,reject)=>{


const transaction =
db.transaction(
storeName,
"readwrite"
);



const store =
transaction.objectStore(storeName);



const request =
store.delete(id);



request.onsuccess=function(){

resolve(true);

};



request.onerror=function(e){

reject(e);

};



});


}





// ================================
// INITIAL DATA
// ================================


async function initDefaultData(){


const settings =
await getData(
"settings",
1
);



if(!settings){



await saveData(
"settings",
{

id:1,

appName:
"LAUNDRY LAND",

showCommission:true

}

);



}





const employees =
await getAllData(
"employees"
);



if(employees.length===0){



await saveData(
"employees",
{

name:"DESI",

active:true,

commissionRules:[

{

item:"CKS",

rate:500,

unit:"KG"

}

]

}

);



}



const items =
await getAllData(
"items"
);



if(items.length===0){



await saveData(
"items",
{

name:"Cuci Kering",

code:"CKS",

unit:"KG"

}

);



await saveData(
"items",
{

name:"Sepatu",

code:"SPT",

unit:"PCS"

}

);



}



console.log(
"Data awal siap"
);



}



// ================================
// START DATABASE
// ================================


async function startDatabase(){


await openDatabase();


await initDefaultData();


console.log(
"LAUNDRY LAND DATABASE READY"
);


}

