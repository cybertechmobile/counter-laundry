/* =====================================
   LAUNDRY LAND V5
   BACKUP & RESTORE ENGINE
===================================== */



// ================================
// EXPORT BACKUP
// ================================


async function exportBackup(){


try{


const backupData = {


app:
"LAUNDRY LAND",


version:
"V5",


date:
new Date()
.toISOString(),



settings:
await getAllData(
"settings"
),



employees:
await getAllData(
"employees"
),



items:
await getAllData(
"items"
),



workLogs:
await getAllData(
"workLogs"
)



};




const json =
JSON.stringify(
backupData,
null,
2
);




const blob =
new Blob(
[
json
],
{
type:
"application/json"
}
);




const url =
URL.createObjectURL(
blob
);




const a =
document.createElement(
"a"
);



a.href=url;



a.download =
"LAUNDRY_LAND_BACKUP_" +
new Date()
.toISOString()
.substring(0,10)
+
".json";



a.click();



URL
.revokeObjectURL(url);



alert(
"Backup berhasil dibuat"
);



}

catch(error){


console.error(
error
);


alert(
"Backup gagal"
);



}



}







// ================================
// RESTORE BACKUP
// ================================


document
.addEventListener(
"change",
function(e){



if(
e.target.id==="restoreFile"
){


restoreBackup(
e.target.files[0]
);


}



});







async function restoreBackup(file){



if(!file){

return;

}



try{


const text =
await file.text();



const data =
JSON.parse(
text
);





if(
!data.app ||
!data.version
){


alert(
"File backup tidak valid"
);


return;


}






// HAPUS DATA LAMA

await clearStore(
"settings"
);


await clearStore(
"employees"
);


await clearStore(
"items"
);


await clearStore(
"workLogs"
);





// MASUKKAN DATA BARU



for(
const item of data.settings
){

await saveData(
"settings",
item
);

}



for(
const item of data.employees
){

await saveData(
"employees",
item
);

}



for(
const item of data.items
){

await saveData(
"items",
item
);

}



for(
const item of data.workLogs
){

await saveData(
"workLogs",
item
);

}






alert(
"Restore berhasil"
);



location.reload();



}

catch(error){



console.error(
error
);



alert(
"Restore gagal"
);



}



}







// ================================
// CLEAR DATABASE STORE
// ================================


function clearStore(storeName){



return new Promise(
(resolve,reject)=>{


const transaction =
db.transaction(
storeName,
"readwrite"
);



const store =
transaction.objectStore(
storeName
);



const request =
store.clear();



request.onsuccess=function(){

resolve(true);

};



request.onerror=function(e){

reject(e);

};



});



}