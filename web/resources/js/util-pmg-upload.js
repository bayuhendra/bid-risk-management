var pmgUpload = {};

pmgUpload.uploadFile = function (result) {
    var processResult = function (result) {
        if (result.status == 1) {
            loadPage(window.returnPage);
        }
    }
    var payload = $(`#${window.validationTableId}`).bootstrapTable('getData');
    var url = window.url.bulkProcess;
    postRequest(url, payload, processResult);
};

pmgUpload.validateFile = function () {
    $('#button-upload').hide();
    var data = new FormData();
    var file = $(`#${window.fileFieldId}`)[0].files[0];

    data.append('file', file);
    data.append('projectNumber', localStorage.projectNumber);
    data.append('projectType', getProjectType());

    var renderStagedData = function (result) {
        if (result.status == 1) {
            $('#button-upload').show();
        } else {
            setMessage(`There's an error in your uploaded file.`);
        }

        var addMessage = datum => {
            datum.message = datum.messageList.map(message => `<li>${message}</li>`).join('')
            datum.message = `<ul>${datum.message}</ul>`;
        };

        if (result.data) {
            if (result.data.forEach) {
                result.data.forEach(addMessage);
            }
        }
        console.log(result.data);
        $(`#${window.validationTableId}`).bootstrapTable('load', result.data);
    };

    $.ajax({
        url: window.url.upload,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: renderStagedData
    });
};

pmgUpload.readyFunction = function () {
    $(`#${window.validationTableId}`).bootstrapTable({data: []});
};
