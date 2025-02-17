const createMiddleware = () => {
    return {
      load: async () => {
        const response = await fetch("/select");
        const json = await response.json();
        return json;
      },
      add: async (accident) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                accident: accident
            })
        });
        const json = await response.json();
        return json;        
      }
    }
  }

  export default createMiddleware;