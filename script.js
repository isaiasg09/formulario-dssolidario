var isCpf = true;

// script pra digitar cpf corretamente
// toda vez que o usuário digitar um número, o script adiciona os pontos e traço automaticamente
document.getElementById("cpf").addEventListener("input", function (e) {
  var value = e.target.value;
  var cpfPattern = value
    .replace(/\D/g, "") // Remove qualquer coisa que não seja número
    .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona ponto após o terceiro dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona ponto após o sexto dígito
    .replace(/(\d{3})(\d)/, "$1-$2") // Adiciona traço após o nono dígito
    .replace(/(-\d{2})\d+?$/, "$1"); // Impede entrada de mais de 11 dígitos
  e.target.value = cpfPattern;
});

// script para validar o cpf ao submeter o formulário
// a função validaCPF recebe o cpf digitado e retorna true se for válido e false se for inválido
function validaCPF(cpf) {
  if (isCpf) {
    cpf = cpf.replace(/\D+/g, "");
    if (cpf.length !== 11) return false;

    let soma = 0;
    let resto;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Verifica sequências iguais

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  } else {
    return true;
  }
}

// adicionando a função pro submit do formulário
document.getElementById("formulario").addEventListener("submit", function (e) {
  var cpf = document.getElementById("cpf").value;
  if (!validaCPF(cpf)) {
    e.preventDefault(); // Impede o envio do formulário
    alert("CPF inválido. Verifique o número digitado.");
    document.getElementById("cpf").focus(); // Foca no campo de CPF após o erro
  }
});

// script para mudar de cpf pra cnpj e vice-versa
// ao clicar no checkbox, o script mostra o campo de cnpj e esconde o de cpf e vice-versa
document.getElementById("checkcnpj").addEventListener("change", (e) => {
  if (document.getElementById("checkcnpj").checked) {
    document.getElementById("cpfdiv").classList.add("hidden");
    document.getElementById("cnpjdiv").classList.remove("hidden");
    isCpf = false;
  } else {
    document.getElementById("cpfdiv").classList.remove("hidden");
    document.getElementById("cnpjdiv").classList.add("hidden");
    isCpf = true;
  }
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_6E4Dv6ieiAj_9-rRPfr49YAReuoFUh4",
  authDomain: "formulario-ong-escola.firebaseapp.com",
  databaseURL: "https://formulario-ong-escola-default-rtdb.firebaseio.com",
  projectId: "formulario-ong-escola",
  storageBucket: "formulario-ong-escola.appspot.com",
  messagingSenderId: "755423233387",
  appId: "1:755423233387:web:9541fd90b2b4df722df82e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

let voluntariosRef = firebase.database().ref("Voluntarios Coletados");

// Listen for form submit
document.getElementById("formulario").addEventListener("submit", submitForm);

// get all input values
function submitForm(e) {
  e.preventDefault();

  // Get values
  let name = getInputVal("nome");
  let email = getInputVal("email");
  let assunto = getInputVal("tipo_ajuda");
  let cpf = getInputVal("cpf");
  let cnpj = getInputVal("cnpj");
  let descricao = getInputVal("descricao");

  // Save message on firebase
  saveMessage(name, email, cpf, cnpj, assunto, descricao);

  // reset form
  document.getElementById("formulario").reset();
}

// Function to get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, email, cpf, cnpj, assunto, descricao) {
  // Add a new document in collection "Voluntarios Coletados"
  let novoVoluntario = voluntariosRef.push();

  // verify if its cpf, if true, save cpf, else save cnpj
  if (isCpf) {
    novoVoluntario.set({
      nome: name,
      email: email,
      cpf: cpf,
      ass: assunto,
      desc: descricao,
    });
  } else {
    novoVoluntario.set({
      nome: name,
      email: email,
      cnpj: cnpj,
      ass: assunto,
      desc: descricao,
    });
  }
}

// * Codigo pra listar os voluntarios coletados
// database.ref("Voluntarios Coletados").once("value", function (snapshot) {
//   var data = snapshot.val();
//   console.log(data);
// });
