var masks = JSON.parse(data);
var dropdown = document.getElementById("dropdown");
var options = document.getElementsByClassName("option");
var phoneInput = document.getElementById("space_container");
var space = document.getElementById("space");
var flagsBox = document.getElementById("img_box");
var optionsContainer = document.getElementById("options");
var search = document.getElementById("search");
var countryName = document.getElementsByClassName("country");
var password = document.getElementById("password");
var eye = document.getElementById("eye");
var phoneNumb = document.getElementById("phonenumb");

function setCode(number) {
    space.innerHTML = `${masks[number].code}`;
    flagsBox.innerHTML = `<img src="flags/${masks[number].iso.toLowerCase()}.png" alt="">`;
    let phone = document.forms["leadsForm"]['phone'];
    let phoneClone = phone.cloneNode(true);
    phone.parentNode.replaceChild(phoneClone, phone);
    phoneClone.value = "";
    phoneMatrix = new TelephoneMatrix(masks[number].code + masks[number].mask, phoneClone);
    phoneMatrix.init();
}


window.addEventListener("DOMContentLoaded", function () {

    for (i = 0; i < masks.length; i++)
        optionsContainer.innerHTML += `           
                <div class="option" data-columns="${i}">
                    <img src="flags/${masks[i].iso.toLowerCase()}.png" alt="">
                    <p class="code">${masks[i].code}</p>
                    <p class="country">${masks[i].name}</p>
                </div>`;
    try {
        let numbOfCountry = masks.findIndex(element => element.iso == "UA");
        setCode(numbOfCountry);
        for (let i = 0; i < masks.length; i++) {
            options[i].addEventListener("click", function () {
                let numOption = this.dataset.columns;
                setCode(numOption);
                shadow.style.display = "none";
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                    dropdown.dataset.parent = "not_show";
                } else dropdown.style.display = "none";
            })
        }
    } catch (e) {
        console.log('Catch block reached');
        console.log(e.message);
    }
});

search.addEventListener('input', function (e) {
    var filter = search.value.toUpperCase();
    var _isNumb = /^\d+$/.test(filter);
    var a = _isNumb ?
        document.getElementsByClassName("code") :
        document.getElementsByClassName("country");
    for (i = 0; i < options.length; i++) {
        var txtValue = a[i].innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
})


let phoneMatrix;

class TelephoneMatrix {

    constructor(placeholder, input) {
        this.input = input;
        input.placeholder = placeholder;
        this.placeholder = input.placeholder;
        this.phoneIsValid = () => {
            return this.input.value.replace(/\D/g, "").length === this.expectedDigitsCount;
        };
        this.lastPhoneValue = "";

        this.expectedDigitsCount = placeholder.replace(/\D/g, '').length + (placeholder.match(/_/g) || []).length;
    }

    init() {
        this.input.addEventListener("input", e => this.mask(e), false);
        this.input.addEventListener("focus", () => {
            this.handleFieldSelection();
        });
        this.input.addEventListener("click", () => {
            this.handleFieldSelection();
        });
    }

    handleFieldSelection() {
        if (this.input.value.length === 0) {
            this.input.value = this.placeholder;
        }
        let cursorPosition = this.input.value.indexOf('_');
        cursorPosition = cursorPosition === -1 ? this.input.value.length : cursorPosition;
        this.setCursorPosition(cursorPosition, this.input);
    }

    mask(e) {

        let matrix = this.placeholder;
        let i = 0;
        let def = matrix.replace(/\D/g, "");
        let val = this.input.value.replace(/\D/g, "");

        def.length >= val.length && (val = def);

        matrix = matrix.replace(/[_\d]/g, function (a) {
            return val.charAt(i++) || "_"
        });
        if (val.length > this.expectedDigitsCount) {
            this.input.value = this.lastPhoneValue;
            return;
        } else document.querySelector("#form").reportValidity();

        this.input.value = matrix;
        this.lastPhoneValue = this.input.value;

        i = matrix.lastIndexOf(val.substr(-1));
        i < matrix.length && matrix !== this.placeholder ? i++ : i = matrix.indexOf("_");
        this.setCursorPosition(i, this.input)
    }

    setCursorPosition(pos, e) {

        e.focus();
        if (e.setSelectionRange) e.setSelectionRange(pos, pos);
        else if (e.createTextRange) {
            let range = e.createTextRange();
            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select()
        }
    }
}


phoneInput.addEventListener("click", function () {
    dropdown.style.display = "block";
    dropdown.dataset.parent = "show";
    shadow.style.display = "block";
    this.dataset.parent = "active";

})


var shadow = document.getElementById("shadow");
var cross = document.getElementById("cross");
var error = document.getElementById("error");
var formContainer = document.getElementById("form_container");

shadow.addEventListener("click", e => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        dropdown.dataset.parent = "not_show";
        shadow.style.display = "none";
    } else dropdown.style.display = "none";
    shadow.style.display = "none";

});
cross.addEventListener("click", e => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        dropdown.dataset.parent = "not_show";
        shadow.style.display = "none";
    } else dropdown.style.display = "none";
    shadow.style.display = "none";

});

eye.addEventListener("click", function () {
    if (eye.dataset.parent === "active") {
        password.type = "password";
        eye.dataset.parent = "not_active";
        eye.innerHTML = `<img src="images/eye.png" alt="">`
    } else {
        password.type = "text";
        eye.innerHTML = `<img src="images/eye_active.png" alt="">`
        eye.dataset.parent = "active";
    }

})

var btnEnter = document.getElementById("enter");
var phoneContainer = document.getElementById("phone_container");
var passwordContainer = document.getElementById("password_container");
var errorPhone = document.getElementById("errorPhone");
var errorPassword = document.getElementById("errorPassword");
var errorEmail = document.getElementById("errorEmail");

btnEnter.addEventListener("click", e => {
    var _passwordRegular = /(?=.*[0-9])(?=.*[A-ZА-ЯЁ])[0-9a-zA-Zа-яёА-ЯЁ]{8,}/g;
    var _emailRegular = /^\S+@\S+\.\S+$/g;
    var phoneIsValid = phoneMatrix.phoneIsValid();
    var passwordIsValid = _passwordRegular.test(password.value);
    var emailIsValid = _emailRegular.test(email.value);
    if (!emailIsValid) {
        emailContainer.dataset.parent = "error";
        errorEmail.style.display = "block";
    }
    if (!phoneIsValid) {
        phoneContainer.dataset.parent = "error";
        errorPhone.style.display = "block";
    }
    if (!passwordIsValid) {
        passwordContainer.dataset.parent = "error";
        errorPassword.style.display = "block";
    }
    if (phoneIsValid && passwordIsValid || emailIsValid && passwordIsValid) {
        phoneContainer.dataset.parent = "";
        errorPhone.style.display = "none";
        passwordContainer.dataset.parent = "";
        errorPassword.style.display = "none";
        emailContainer.dataset.parent = "";
        errorEmail.style.display = "none";
    }
});

var passwordValidate = document.getElementById("passwordValidate");
var minimum = document.getElementById("minimum");
var oneNumb = document.getElementById("oneNumb");
var oneSymbol = document.getElementById("oneSymbol");

password.addEventListener("input", e => {
    passwordValidate.style.opacity = "1";
    btnEnter.dataset.parent = "down";
    var _minimumRegular = /[0-9a-zA-Zа-яёА-ЯЁ]{8,}/g;
    var _oneNumbRegular = /(?=.*[0-9])/g;
    var _oneSymbolRegular = /(?=.*[A-ZА-ЯЁ])/g;
    console.log(_minimumRegular.test(password.value));
    if(!_minimumRegular.test(password.value)) {
        minimum.dataset.parent = "incorrect";
    }
    if(_minimumRegular.test(password.value)) {
        minimum.dataset.parent = "correct";
    }
    if(_oneNumbRegular.test(password.value)) {
        oneNumb.dataset.parent = "correct";
    }
    if(_oneSymbolRegular.test(password.value)) {
        oneSymbol.dataset.parent = "correct";
    }

    if(!_oneNumbRegular.test(password.value)) {
        oneNumb.dataset.parent = "incorrect";
    }
    if(!_oneSymbolRegular.test(password.value)) {
        oneSymbol.dataset.parent = "incorrect";
    }
    if (password.value.length === 0){
        passwordValidate.style.opacity = "0";
        btnEnter.dataset.parent = "up";
    }
})


window.addEventListener("click", e => {
    if (event.target !== password) {
        passwordValidate.style.opacity = "0";
        btnEnter.dataset.parent = "up";
    }
})

var deletePassword = document.getElementById("deletePassword");

deletePassword.addEventListener("click", e => {
    password.value = "";
})

var emailBtn = document.getElementById("emailBtn");
var phoneBtn = document.getElementById("phoneBtn");
var emailContainer = document.getElementById("email_container");
var phoneTitle = document.getElementById("phoneTitle");
var email = document.getElementById("email_input");

emailBtn.addEventListener("click", e => {
    emailBtn.dataset.parent = "active";
    phoneBtn.dataset.parent = "not_active";
    emailContainer.style.display = "block";
    phoneContainer.style.display = "none";
    phoneTitle.style.display = "none";
    phoneMatrix.input.value = "";
    password.value = "";
    errorPhone.style.fontSize = "0";
    errorEmail.style.fontSize = "14px";
    phoneContainer.dataset.parent = "";
    errorPhone.style.display = "none";
    passwordContainer.dataset.parent = "";
    errorPassword.style.display = "none";
    emailContainer.dataset.parent = "";
    errorEmail.style.display = "none";
})

phoneBtn.addEventListener("click", e => {
    phoneBtn.dataset.parent = "active";
    emailBtn.dataset.parent = "not_active";
    phoneContainer.style.display = "flex";
    emailContainer.style.display = "none";
    phoneTitle.style.display = "block";
    email.value = "";
    password.value = "";
    errorEmail.style.fontSize = "0";
    errorPhone.style.fontSize = "14px";
    phoneContainer.dataset.parent = "";
    errorPhone.style.display = "none";
    passwordContainer.dataset.parent = "";
    errorPassword.style.display = "none";
    emailContainer.dataset.parent = "";
    errorEmail.style.display = "none";
})

var deleteEmail = document.getElementById("deleteEmail");

deleteEmail.addEventListener("click", e => {
    email.value = "";
})