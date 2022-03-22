(function () {
  console.log('Skyflow demo script.js');

  const getBearerToken = () => {
    console.log('getBearerToken');
    return new Promise((resolve, reject) => {
      const Http = new XMLHttpRequest();

      Http.onreadystatechange = () => {
        if (Http.readyState == 4) {
          if (Http.status == 200) {
            const response = JSON.parse(Http.responseText);
            console.log(response.data);
            resolve(response.data);
          } else {
            console.log('error');
            reject('Error occured');
          }
        }
      };

      Http.onerror = (error) => {
        reject('Error occured');
      };

      const url = 'http://localhost:3000/api/bearerToken';
      Http.open('GET', url);
      Http.send();
    });
  };

  const skyflowClient = Skyflow.init({
    vaultID: 'cce8a3de0d2548fa9551f0f47f4c09b3', //Id of the vault that the client should connect to
    vaultURL: 'https://ebfc9bee4242.vault.skyflowapis.com', //URL of the vault that the client should connect to
    getBearerToken, //helper function that retrieves a Skyflow bearer token from your backend
  });

  console.log(skyflowClient);

  skyflowClient.insert({
    records: [
      {
        table: 'credit_cards',
        fields: {
          card_number: '41111111111',
          cardholder_name: 'John Doe',
          expiry_date: '05/2025',
        },
      },
    ],
  });
})();
