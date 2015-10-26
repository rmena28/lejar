
function activeMenu(selectedMenuClass) {
    $('.menuList').removeClass('active');
    $('.' + selectedMenuClass).addClass('active');

}
function hideAllPanels() {
    $('.panelClass').hide();
}

function showPanel(id) {
    $('#' + id).show();
}

function showBalance() {
    $('#hasAccess').show();
    $('#hasNoAccess').hide();
}

function hideBalance() {
    $('#hasAccess').hide();
    $('#hasNoAccess').show();
}

function startSelects(){
    $('select').material_select();
}
