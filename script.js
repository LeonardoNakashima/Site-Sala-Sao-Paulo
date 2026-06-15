// pega os elementos da página
var slider = document.getElementById("slider");
var inputNumero = document.getElementById("inputNumero");
var textoPublico = document.getElementById("textoPublico");
var textoArrecadacao = document.getElementById("textoArrecadacao");
var barraOcupacao = document.getElementById("barraOcupacao");
var textoOcupacao = document.getElementById("textoOcupacao");

var precoIngresso = 120;
var capacidadeMaxima = 1388;

// atualiza tudo na tela de acordo com o número de pessoas
function atualizar(pessoas) {
  var arrecadacao = pessoas * precoIngresso;
  var ocupacao = (pessoas / capacidadeMaxima) * 100;

  textoPublico.textContent = pessoas + " pessoas";
  textoArrecadacao.textContent = arrecadacao.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  barraOcupacao.style.width = ocupacao + "%";
  textoOcupacao.textContent = ocupacao.toFixed(1).replace(".", ",") + "%";

  // atualiza o ponto no gráfico
  atualizarPontoGrafico(pessoas);
}

// quando mexe no slider
slider.addEventListener("input", function() {
  var valor = Number(slider.value);
  inputNumero.value = valor;
  atualizar(valor);
});

// quando digita no campo de número
inputNumero.addEventListener("input", function() {
  var valor = parseInt(inputNumero.value);

  if (isNaN(valor)) return;

  // não deixa passar do máximo nem ficar negativo
  if (valor > capacidadeMaxima) valor = capacidadeMaxima;
  if (valor < 0) valor = 0;

  slider.value = valor;
  atualizar(valor);
});

// quando sai do campo (blur) corrige se estiver vazio ou inválido
inputNumero.addEventListener("blur", function() {
  var valor = parseInt(inputNumero.value);

  if (isNaN(valor) || inputNumero.value === "") valor = 0;
  if (valor > capacidadeMaxima) valor = capacidadeMaxima;
  if (valor < 0) valor = 0;

  inputNumero.value = valor;
  slider.value = valor;
  atualizar(valor);
});

// ---- gráfico com chart.js ----

// monta os pontos do gráfico (um ponto a cada 14 pessoas mais ou menos)
var pontosX = [];
var pontosY = [];

for (var i = 0; i <= capacidadeMaxima; i += 14) {
  pontosX.push(i);
  pontosY.push(i * precoIngresso);
}
// garante que o último ponto é o máximo
pontosX.push(capacidadeMaxima);
pontosY.push(capacidadeMaxima * precoIngresso);

var ctx = document.getElementById("meuGrafico").getContext("2d");

var grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: pontosX,
    datasets: [
      {
        label: "R(x) = 120x",
        data: pontosY,
        borderColor: "#c9a84c",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0
      },
      {
        label: "Cenário atual",
        data: [],
        borderColor: "#e05c2a",
        backgroundColor: "#e05c2a",
        pointRadius: 7,
        showLine: false,
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#999" }
      },
      tooltip: {
        callbacks: {
          title: function(items) {
            return "Ingressos: " + items[0].label;
          },
          label: function(item) {
            var v = item.raw;
            return " R$ " + v.toLocaleString("pt-BR");
          }
        }
      }
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: capacidadeMaxima,
        title: {
          display: true,
          text: "Quantidade de ingressos (x)",
          color: "#999"
        },
        ticks: { color: "#999" },
        grid: { color: "#2a2a2a" }
      },
      y: {
        min: 0,
        max: capacidadeMaxima * precoIngresso,
        title: {
          display: true,
          text: "Arrecadação em R$",
          color: "#999"
        },
        ticks: {
          color: "#999",
          callback: function(v) {
            return "R$ " + (v / 1000).toFixed(0) + "k";
          }
        },
        grid: { color: "#2a2a2a" }
      }
    }
  }
});

function atualizarPontoGrafico(x) {
  grafico.data.datasets[1].data = [{ x: x, y: x * precoIngresso }];
  grafico.update("none");
}

// inicia com 694 pessoas
atualizar(694);
