const fillFormFields = function (data, prefix) {
    if (data.data == null) {
        console.log('Data is Null');
        return;
    }
    data = data.data
    if (data.length == 0) {
        console.log('Data is empty');
        return;
    }
    data = data[0];
    for (var property in data) {
        $(`#${prefix}-${property}`).val(data[property]);
    }
};


const createFormObject = function (prefix, formFields, idField) {
    var formObject = {};

    formFields.forEach(formField => {
        formObject[formField] = $(`#${prefix}-${formField}`).val();
    });

    if ($(`#${prefix}-${idField}`).val()) {
        formObject[idField] = $(`#${prefix}-${idField}`).val();
    }
    return formObject;
}

const validateForm = function (formSelector) {
    var validated = true;
    var formElement = $(formSelector);
    var requiredFields = formElement.find('.required');
    var validateField = function (index, element) {
        element = $(element);
        if (element.val() == '') {
            validated = false;
            element.addClass('is-empty');
        }
    }
    requiredFields.removeClass('is-empty');
    requiredFields.each(validateField);
    return validated;
}