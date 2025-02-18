export const createMiddleware = () => { //sostituire fetch con comandi del database (dalla relativa classe)
    return {
      load: async () => {
        const response = await fetch("/select");
        const json = await response.json();
        return json;
      },

      loadType: async () => {
        const response = await fetch("/type");
        const json = await response.json();
        return json;
      },

      add: async (visit) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(
                visit  // Assicura che `visit` sia un oggetto con {idType, date, hour, name}
            )
        });
        const json = await response.json();
        return json;        
    }
    }
  }

  /*
  body: JSON.stringify({
                visit: visitContent
            })
  */