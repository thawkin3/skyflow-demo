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

  // skyflowClient.insert({
  //   records: [
  //     {
  //       table: 'credit_cards',
  //       fields: {
  //         card_number: '41111111111',
  //         cardholder_name: 'John Doe',
  //         expiry_date: '05/2025',
  //       },
  //     },
  //   ],
  // });

  // create collect Container
  const collectContainer = skyflowClient.container(
    Skyflow.ContainerType.COLLECT
  );

  //custom styles for collect elements
  const collectStylesOptions = {
    inputStyles: {
      base: {
        border: '1px solid #eae8ee',
        padding: '10px 16px',
        borderRadius: '4px',
        color: '#1d1d1d',
        marginTop: '4px',
      },
      complete: {
        color: '#4caf50',
      },
      empty: {},
      focus: {},
      invalid: {
        color: '#f44336',
      },
    },
    labelStyles: {
      base: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    errorTextStyles: {
      base: {
        color: '#f44336',
      },
    },
  };

  // create collect elements
  const cardNumberElement = collectContainer.create({
    table: 'credit_cards',
    column: 'card_number',
    ...collectStylesOptions,
    placeholder: '1234 5678 9012 3456',
    label: 'Card Number',
    type: Skyflow.ElementType.CARD_NUMBER,
  });

  // const cvvElement = collectContainer.create({
  //   table: 'credit_cards',
  //   column: 'cvv',
  //   ...collectStylesOptions,
  //   label: 'CVV',
  //   placeholder: '123',
  //   type: Skyflow.ElementType.CVV,
  // });

  const expiryDateElement = collectContainer.create({
    table: 'credit_cards',
    column: 'expiry_date',
    ...collectStylesOptions,
    label: 'Expiry Date (MM/YYYY)',
    placeholder: '01/2025',
    type: Skyflow.ElementType.EXPIRATION_DATE,
  });

  const cardHolderNameElement = collectContainer.create({
    table: 'credit_cards',
    column: 'cardholder_name',
    ...collectStylesOptions,
    label: 'Card Holder Name',
    placeholder: 'John Doe',
    type: Skyflow.ElementType.CARDHOLDER_NAME,
  });

  // mount the elements
  cardNumberElement.mount('#collectCardNumber');
  // cvvElement.mount('#collectCvv');
  expiryDateElement.mount('#collectExpiryDate');
  cardHolderNameElement.mount('#collectCardholderName');

  // handle form submission
  const submitCreditCardForm = (e) => {
    e.preventDefault();

    const collectResponse = collectContainer.collect();
    collectResponse
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const creditCardForm = document.querySelector('#creditCardForm');
  creditCardForm.addEventListener('submit', submitCreditCardForm);
})();
