$(document).ready(function () {
    loadClientsAndPDFs();

    $('#generate-pdf-btn').click(function () {
        var selectedClient = $('#client-select').val();
        var selectedPDF = $('#pdf-select').val();
        alert('PDF gerado para o cliente: ' + selectedClient + ', usando o modelo: ' + selectedPDF);
    });

    $('#access-clients-btn').click(function () {
        // Quando o botão for clicado, vamos ler o arquivo JSON e, em seguida, exibir o modal com os dados dos clientes
        $.getJSON('clientes.json', function (data) {
            displayClientsModal(data);
        });
    });

    $('#new-client-btn').click(function () {
        $('#new-client-modal').dialog({
            modal: true,
            buttons: {
                Fechar: function () {
                    $(this).dialog("close");
                }
            }
        });
    });

    $('#client-form').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        saveClient(formData);
        $(this)[0].reset();
        $('#new-client-modal').dialog("close");
    });
});

function loadClientsAndPDFs() {
    // Simulação de dados (você deve substituir isso com sua lógica real)
    var pdfs = ["Modelo 1", "Modelo 2", "Modelo 3"];

    var pdfSelect = $('#pdf-select');
    $.each(pdfs, function (index, pdf) {
        pdfSelect.append($('<option>', {
            value: pdf,
            text: pdf
        }));
    });
}

function displayClientsModal(clients) {
    var clientsTable = $('<table>').addClass('clients-table');
    var tableHead = $('<thead>');
    var tableBody = $('<tbody>');

    // Cria a linha do cabeçalho (thead) com as colunas
    var headRow = $('<tr>');
    $.each(Object.keys(clients[0]), function (index, key) {
        headRow.append($('<th>').text(key));
    });
    tableHead.append(headRow);

    // Cria uma linha de tabela (tbody) com os valores dos clientes
    $.each(clients, function (index, client) {
        var bodyRow = $('<tr>');
        $.each(client, function (key, value) {
            bodyRow.append($('<td>').text(value));
        });
        tableBody.append(bodyRow);
    });

    clientsTable.append(tableHead, tableBody);

    $('#clients-table-container').html(clientsTable);

    // Abre o modal
    $('#clients-modal').dialog({
        modal: true,
        width: '80%', // Define a largura do modal em 80% da largura da tela
        maxWidth: 1000, // Define a largura máxima do modal em 1000 pixels
        buttons: {
            Fechar: function () {
                $(this).dialog("close");
            }
        }
    });
}

function saveClient(clientData) {
    $.getJSON('clientes.json', function (data) {
        // Gera um ID único para o novo cliente
        var newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        // Adiciona o ID ao objeto de dados do cliente
        clientData.id = newId;
        // Adiciona o novo cliente aos dados existentes
        data.push(clientData);
        // Atualiza o arquivo JSON
        $.ajax({
            url: 'clientes.json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                // Exibe a lista atualizada de clientes
                displayClientsModal(data);
            }
        });
    });
}