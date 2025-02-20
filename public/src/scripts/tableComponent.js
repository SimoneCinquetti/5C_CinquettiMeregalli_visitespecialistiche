export const generateTable = (parentElement) => {
    let hours;
    let days;
    let currentData = {};
    let currentType;
    let typeList;

    let date = new Date(Date.now());

    return {
        build : (newHours, newDays, newTypes) => {
            typeList=newTypes
            hours = newHours;
            days = newDays;
            while (date.getDay() !== 1) {
                if (date.getDay() === 6 || date.getDay() === 0) {
                    date.setDate(date.getDate() + 1);
                } else {
                    date.setDate(date.getDate() - 1);
                }
            }
        },
        render : () => {
            let html = '<table class="table table-bordered"> <thead>' ;
            let dataValues = Object.values(currentData);
            let importantValues=[];
            let currentTypeNumber;
            for(let i=0;i<typeList.length;i++){
                if(currentType===typeList[i].name){
                    currentTypeNumber=typeList[i].id
                }
            }
            for(let i=0;i<dataValues.length;i++){
                if(dataValues[i].idType===currentTypeNumber){
                    importantValues.push(dataValues[i])
                }
            }
            //Headers
            let hold = new Date(date)
            html += "<tr><th class='table-secondary'>#</th>";
            for (let i = 0; i < days.length; i++) {
                html += "<th  class='table-secondary'>" + days[i] + "\n" + parseInt(hold.getDate()) + "/" + parseInt(hold.getMonth() + 1) + "/" + hold.getFullYear()  + "</th>";
                hold.setDate(hold.getDate() + 1);
            }
            html += "</tr>";
            //Values
            for (let h = 0; h < hours.length; h++) { // itera per ogni ora
                hold = new Date(date)
                html += "<tr><td>" + hours[h] + "</td>";
                for (let i = 0; i < days.length; i++) {
                    let booked;
                    let c=0;
                    while(!booked && c<importantValues.length){ //--! SISTEMARE CONDIZIONE CAMBIANDO IL CONTROLLO IN BASE AL GIORNO IN MODO CORRETTO (NUMERO, NON SE è LUN/MART ETC)  
                        let appointmentDay= new Date(importantValues[c].date).getDate()
                        let appointmentMonth= new Date(importantValues[c].date).getMonth()
                        let appointmentYear= new Date(importantValues[c].date).getFullYear()
                        let appointmentHour= importantValues[c].hour
                        if(appointmentDay===hold.getDate() && appointmentHour===hours[h] && appointmentMonth===parseInt(hold.getMonth()) && appointmentYear===hold.getFullYear() ){
                            booked=importantValues[c]
                        }
                        c++
                    }
                    if(booked){
                        html += "<td>"+ booked.name +"</td>";
                    }else{
                        html += "<td></td>";
                    }
                    hold.setDate(hold.getDate() + 1);
                }
                html += "</tr>";
            }
            
            parentElement.innerHTML = html ;
        },
        add : () => {
            return true
        },
        setData : (inputData, type) => { 
            currentData = inputData;
            currentType = type
        },
        next : () => {
            date.setDate(date.getDate() + 7);
            while (date.getDay() !== 1) {
                date.setDate(date.getDate() - 1);
            }
        },
        previous : () => {
            date.setDate(date.getDate() - 7);
            while (date.getDay() !== 1) {
                date.setDate(date.getDate() - 1);
            }
        },
        getData : () => {
            return currentData;
        }
    }
}
