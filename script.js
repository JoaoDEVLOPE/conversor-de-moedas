const form = document.getElementById('converter-form');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const updateTime = document.getElementById('update-time');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    submitBtn.disabled = true;
    submitBtn.innerText = "Buscando cotação...";
    resultContainer.classList.remove('hidden');
    resultText.innerText = "Carregando dados...";
    updateTime.innerText = "";

    try {
        const url = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Falha na API');
        }

        const data = await response.json();
        const key = `${from}${to}`;
        const bid = parseFloat(data[key].bid);
        const dateStr = data[key].create_date;

        const totalConverted = amount * bid;

        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: from }).format(amount);
        const formattedResult = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: to }).format(totalConverted);

        resultText.innerText = `${formattedAmount} = ${formattedResult}`;
        
        const parsedDate = new Date(dateStr);
        updateTime.innerText = `Cotação atualizada em: ${parsedDate.toLocaleString('pt-BR')}`;

    } catch (error) {
        console.error(error);
        resultText.innerText = "Erro ao buscar cotação. Tente novamente.";
        updateTime.innerText = "Verifique sua conexão.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Converter";
    }
});