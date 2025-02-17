const gestorePrenotazioniCache = (keyCacheRemota,nomeDatabaseRemoto) => {
    let keyCache=keyCacheRemota
    let nomeDatabase=nomeDatabaseRemoto
    let dizionarioPrenotazioni;
    fetch("/select", { 
        method: "POST",
        headers: {
            "content-type": "application/json",
            "key": keyCache
        },
        body: JSON.stringify({
                key: nomeDatabase
            })
    }).then(r => r.json()).then(r=>dizionarioPrenotazioni=JSON.parse(r.result)).catch(error => { throw(error) })
    return {
        aggiungerePrenotazioneCache : (prenotazione,persona) => {
            let check= true
            if(Object.keys(dizionarioPrenotazioni).length > 0){
                for (const key in dizionarioPrenotazioni){
                    if (key === prenotazione){
                        check= false
                    }
                }
            }
            if (check){
                dizionarioPrenotazioni[prenotazione]=persona;
            fetch("/insert", { 
                method: "POST",
                headers: {
                    "content-type": "application/json",
                     "key": keyCache
                },
                body: JSON.stringify({
                    key : nomeDatabase,
                    value : JSON.stringify(dizionarioPrenotazioni)
                })
            }).then(r => r.json())
              .then(r => {console.log(r.result)})
            }
        },
        
    }
}

export { gestorePrenotazioniCache }