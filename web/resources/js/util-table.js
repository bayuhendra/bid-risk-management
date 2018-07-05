var renderTableActions = function (value, row, index) {
    var objectReturn = ['<div class="btn-group-vertical class="margin-top:1rem;margin-bottom:1rem">'];
    objectReturn.push(
            `<button 
            class="btn btn-primary" 
            onclick="loadForm(this,'${row}','${index}','view')" 
            title="View"
        >
            View
        </button>`
            );
    if (!row.status) {
        row.status = "";
    }
    if (row.status.toLowerCase() == "draft" && row.isCreator == true) {
        objectReturn.push(
                `<button 
                class="btn btn-primary"
                onclick="loadForm(this,'${row}','${index}','edit')" 
                title="Edit"
            >
                Edit
            </button>`,
                );
        objectReturn.push(
                `<button 
                class="btn btn-primary" 
                onclick="deletePopUp(this,'${row}','${index}')" 
                title="Delete" 
            >
                Delete
            </button>`,
                );
    }
    objectReturn.push('</div>');
    return objectReturn.join(' ');
};

var renderTableUamAction = function (value, row, index) {
    var objectReturn = ['<div class="btn-group-vertical class="margin-top:1rem;margin-bottom:1rem">'];
    objectReturn.push(
            `<button 
            class="btn btn-primary" 
            onclick="loadForm(this,'${row}','${index}','view')" 
            title="View"
        >
            View
        </button>`
            );

    if (!row.status) {
        row.status = "";
    }
    objectReturn.push('</div>');
    return objectReturn.join(' ');
}

function formatNull(value, row, index) {
    if (value == null || value == '') {
        return '-';
    }
    return value;
} 