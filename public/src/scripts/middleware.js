const createMiddleware = () => { //sostituire fetch con comandi del database (dalla relativa classe)
    return {
      load: async () => {
        const response = await fetch("/select");
        const json = await response.json();
        return json;
      },
      add: async (visitContent) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                visit: visitContent
            })
        });
        const json = await response.json();
        return json;        
      }
    }
  }

  export default createMiddleware;

  /*
  body: JSON.stringify({
                visit: visitContent
            })
  */