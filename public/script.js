(function () {
  const initializeSkyflowClient = () => {
    const getBearerToken = () => {
      return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();

        Http.onreadystatechange = () => {
          if (Http.readyState == 4) {
            if (Http.status == 200) {
              const response = JSON.parse(Http.responseText);
              resolve(response.data);
            } else {
              reject('Error occured');
            }
          }
        };

        Http.onerror = () => {
          reject('Error occured');
        };

        const url = 'http://localhost:3000/api/bearerToken';
        Http.open('GET', url);
        Http.send();
      });
    };

    const skyflowClient = Skyflow.init({
      vaultID: 'cce8a3de0d2548fa9551f0f47f4c09b3',
      vaultURL: 'https://ebfc9bee4242.vault.skyflowapis.com',
      getBearerToken,
    });

    return skyflowClient;
  };

  const createCollectContainer = (skyflowClient) =>
    skyflowClient.container(Skyflow.ContainerType.COLLECT);

  const collectStylesOptions = {
    inputStyles: {
      base: {
        border: '1px solid #071a32',
        borderRadius: '4px',
        color: '#071a32',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        padding: '10px 16px',
        marginTop: '4px',
      },
      complete: {},
      empty: {},
      focus: {
        outline: 'none',
        border: [['1px 1px 4px 1px'], ['solid'], ['#071a32']],
        padding: '10px 16px 7px 16px',
      },
      invalid: {},
    },
    labelStyles: {
      base: {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16px',
      },
    },
    errorTextStyles: {
      base: {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16px',
      },
    },
  };

  const createCollectElements = (collectContainer, collectStylesOptions) => {
    const cardHolderNameElement = collectContainer.create({
      table: 'credit_cards',
      column: 'cardholder_name',
      ...collectStylesOptions,
      label: 'Card Holder Name',
      placeholder: 'John Doe',
      type: Skyflow.ElementType.CARDHOLDER_NAME,
    });

    const cardNumberElement = collectContainer.create({
      table: 'credit_cards',
      column: 'card_number',
      ...collectStylesOptions,
      placeholder: '4111 1111 1111 1111',
      label: 'Card Number',
      type: Skyflow.ElementType.CARD_NUMBER,
    });

    const expiryDateElement = collectContainer.create({
      table: 'credit_cards',
      column: 'expiry_date',
      ...collectStylesOptions,
      label: 'Expiry Date (MM/YY)',
      placeholder: '01/24',
      type: Skyflow.ElementType.EXPIRATION_DATE,
    });

    return [cardHolderNameElement, cardNumberElement, expiryDateElement];
  };

  const mountCollectElements = (
    cardHolderNameElement,
    cardNumberElement,
    expiryDateElement
  ) => {
    cardHolderNameElement.mount('#collectCardholderName');
    cardNumberElement.mount('#collectCardNumber');
    expiryDateElement.mount('#collectExpiryDate');
  };

  const addFormSubmissionEventListener = (collectContainer) => {
    const submitCreditCardForm = (e) => {
      e.preventDefault();
      const resultContainer = document.querySelector('#result');

      const collectResponse = collectContainer.collect();
      collectResponse
        .then((data) => {
          resultContainer.textContent = `Success! Stored tokenized data with ID: ${data.records[0].fields.skyflow_id}`;
          resultContainer.classList.remove('hidden');
        })
        .catch(() => {
          resultContainer.textContent =
            'Error. Unable to store credit card info.';
          resultContainer.classList.remove('hidden');
        });
    };

    const creditCardForm = document.querySelector('#creditCardForm');
    creditCardForm.addEventListener('submit', submitCreditCardForm);
  };

  const init = () => {
    const skyflowClient = initializeSkyflowClient();

    const collectContainer = createCollectContainer(skyflowClient);

    const [cardHolderNameElement, cardNumberElement, expiryDateElement] =
      createCollectElements(collectContainer, collectStylesOptions);

    mountCollectElements(
      cardHolderNameElement,
      cardNumberElement,
      expiryDateElement
    );

    addFormSubmissionEventListener(collectContainer);
  };

  init();
})();
